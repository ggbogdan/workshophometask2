# PET_STORE — k6 API Test Framework

A TypeScript-based API performance and integration testing framework built with [k6](https://k6.io/), targeting the [Swagger Petstore API](https://petstore.swagger.io).

---

## Overview

This project provides a structured framework for exercising the Petstore REST API. It separates HTTP calls into **services**, reusable checks and workflows into **steps**, and executable scenarios into **tests**. Pet and store scenarios use the shared step manager; the user lifecycle uses individual executable step classes.

---

## Target API

**Base URL:** `https://petstore.swagger.io`  
**API paths:** `/v2/...`  
**API Docs:** https://petstore.swagger.io/#/

---

## Project Structure

```
PET_STORE/
├── apps/
│   ├── requestManager.ts        # Singleton exposing all service instances
│   ├── stepsManager.ts          # Shared pet, store, and user step instances
│   ├── stepsManagerExec.ts      # Instances of executable user lifecycle steps
│   ├── services/
│   │   ├── baseRequest.ts       # Base HTTP class (GET, POST, PUT, DELETE)
│   │   ├── pet/
│   │   │   └── pet.ts           # PetService – pet-related API calls
│   │   ├── store/
│   │   │   └── store.ts         # StoreService – store/order API calls
│   │   └── user/
│   │       └── user.ts          # UserService – user API calls
│   └── steps/
│       ├── pet.ts               # PetSteps – pet test steps with checks
│       ├── store.ts             # StoreSteps – store test steps with checks
│       ├── user.ts              # UserSteps – user test steps with checks
│       └── user-steps/          # Individual executable user lifecycle steps
│           ├── GetUserByUserName.ts
│           ├── LoginUserByUserNameAndPassword.ts
│           ├── LogoutUser.ts
│           ├── PostUser.ts
│           └── UpdateUserData.ts
├── config/
│   └── frameworkConfig.ts       # Global config (BASE_URL)
├── framework/
│   └── k6Libs/
│       └── k6Utils.js           # Utility helpers (randomItem, randomString, etc.)
├── testData/                    # Environment-specific fixtures (currently empty)
│   ├── integration/
│   ├── prod/
│   └── stage/
├── tests/
│   ├── pet_find_available.ts    # Basic raw HTTP test (no framework)
│   ├── pet_flow.ts              # Pet flow: pending / available / sold pets + find by ID
│   ├── store_order_lifecycle.ts # Store flow: create order → delete → verify deletion
│   └── user_flow.ts             # User flow: create → get → login → update → verify
├── package.json
└── tsconfig.json
```

---

## Architecture

### Layers

| Layer | Location | Responsibility |
|---|---|---|
| **Service** | `apps/services/` | Wraps raw k6 HTTP calls per domain |
| **Steps** | `apps/steps/` | Composes service calls with `check()` assertions and `group()` labels; user lifecycle also has executable step classes under `apps/steps/user-steps/` |
| **Tests** | `tests/` | Orchestrates steps into full test scenarios |
| **Managers** | `apps/requestManager.ts`, `apps/stepsManager.ts`, `apps/stepsManagerExec.ts` | Shared access points for services and step instances |

### Data Flow (Steps Pattern)

Pet and store step methods accept a `stepData` object and return it enriched with values extracted from responses:

```ts
const addOrder = stepsManager.storeSteps.postOrderById();
const deleteOrder = stepsManager.storeSteps.deleteOrderById(addOrder, addOrder.orderID);
const getOrder = stepsManager.storeSteps.getOrderById(deleteOrder, addOrder.orderID);
```

The user lifecycle uses executable step objects. Each `execute()` call receives and returns the data accumulated by earlier steps:

```ts
const createdUser = stepsManagerExec.postUser.execute();
const fetchedUser = stepsManagerExec.getUserByUserName.execute(createdUser);
const loggedInUser = stepsManagerExec.loginUserByUserNameAndPassword.execute(fetchedUser);
```

---

## Services

### PetService (`/v2/pet`)
| Method | Description |
|---|---|
| `findPetsByStatus(status)` | GET pets filtered by `available`, `pending`, or `sold` |
| `findPetById(petId)` | GET a single pet by its ID |

### StoreService (`/v2/store`)
| Method | Description |
|---|---|
| `addOrderById(body)` | POST a new store order |
| `deleteOrderById(orderId)` | DELETE an order by ID |
| `findOrderById(orderId)` | GET an order by ID |

### UserService (`/v2/user`)
| Method | Description |
|---|---|
| `createUser(body)` | POST create a new user |
| `findUserByUserName(userName)` | GET a user by username |
| `loginUser(userName, password)` | GET login with credentials |
| `updateUser(userName, body)` | PUT update a user's data |
| `logoutUser()` | GET logout the current user |

---

## Steps

### PetSteps
| Method | Description |
|---|---|
| `getPendingPets(stepData?)` | GET pending pets, picks a random one, returns `pendingPetID` |
| `getAvailablePets(stepData?)` | GET available pets, picks a random one, returns `availablePetID` |
| `getSoldPets(stepData?)` | GET sold pets, picks a random one, returns `soldPetID` and `soldPetName` |
| `getPetById(stepData?, petId)` | GET a pet by ID, returns the response as `foundPetData` |

### StoreSteps
| Method | Description |
|---|---|
| `postOrderById(stepData?)` | POST a new order with a random ID, returns `orderID` |
| `deleteOrderById(stepData?, orderID)` | DELETE an order by ID, asserts 200 |
| `getOrderById(stepData?, orderID)` | GET an order by ID, asserts 404 (verifies deletion) |

### UserSteps and executable user steps

`UserSteps` remains available through `stepsManager.userSteps`. The current `user_flow.ts` instead composes the executable classes in `apps/steps/user-steps/`; each class exposes `execute(stepData?)` and reads the required username, password, or ID from the accumulated data.

| Method | Description |
|---|---|
| `LogoutUser.execute(stepData?)` | GET logout for the current user |
| `PostUser.execute(stepData?)` | POST a user with a random username; returns `randomUserName` |
| `GetUserByUserName.execute(stepData)` | GET the accumulated username; returns `foundUserName`, `foundUserPassword`, and `foundUserID` |
| `LoginUserByUserNameAndPassword.execute(stepData)` | GET login using the fetched username and password |
| `UpdateUserData.execute(stepData)` | PUT updated user data using the fetched user details |

---

## Tests

| File | Scenario |
|---|---|
| `pet_find_available.ts` | Raw HTTP call to fetch available pets, picks a random pet and finds it by name (no framework, introductory example) |
| `pet_flow.ts` | Fetches pending, available, and sold pets, then looks up pet IDs |
| `store_order_lifecycle.ts` | Creates a store order, deletes it, then verifies it returns 404 |
| `user_flow.ts` | User lifecycle: logout → create → get → login → update → get again |

---

## Utilities (`framework/k6Libs/k6Utils.js`)

| Function | Description |
|---|---|
| `randomItem(array)` | Returns a random element from an array |
| `randomIntBetween(min, max)` | Returns a random integer in the range [min, max] |
| `randomString(length, charset?)` | Generates a random lowercase string |
| `uuidv4()` | Generates a random UUID v4 string |
| `findBetween(content, left, right, repeat?)` | Extracts a substring (or all substrings if `repeat=true`) between two delimiters |
| `normalDistributionStages(maxVus, durationSeconds, numberOfStages?)` | Generates k6 stage config following a normal distribution curve |

---

## Prerequisites

- [k6](https://k6.io/docs/get-started/installation/) installed globally
- [Node.js](https://nodejs.org/) (for dependency installation)

---

## Installation

```bash
npm install
```

---

## Running Tests

### Using the npm script

Runs `tests/pet_find_available.ts` with HTTP debug output enabled:

```bash
npm run test
```

### Using k6 directly
```bash
k6 run tests/pet_find_available.ts
k6 run tests/pet_flow.ts
k6 run tests/store_order_lifecycle.ts
k6 run tests/user_flow.ts
```

### With HTTP debug output
```bash
k6 run tests/pet_flow.ts -e K6_HTTP_DEBUG=true
```

---

## Running in k6 Cloud (Grafana)

1. Get your API token from `https://{GRAFANA_ACCOUNT_NAME}.grafana.net/a/k6-app/settings/api-token`
2. Login:
   ```bash
   k6 cloud login --token <YOUR_API_TOKEN> --stack <GRAFANA_ACCOUNT_NAME>
   ```
3. Run in cloud:
   ```bash
   k6 cloud run tests/pet_flow.ts
   ```

---

## Configuration

| Setting | Value | File |
|---|---|---|
| Base URL | `https://petstore.swagger.io` | `config/frameworkConfig.ts` |
| API paths | `/v2/...` | Service classes under `apps/services/` |
| TypeScript target | ES2020 | `tsconfig.json` |
| Default VUs | 1 | Each test file (`options`) |
| Default iterations | 1 | Each test file (`options`) |

---

## Dependencies

| Package | Purpose |
|---|---|
| `@types/k6` | TypeScript type definitions for k6 |
