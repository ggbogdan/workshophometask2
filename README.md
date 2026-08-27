# PET_STORE — k6 API Test Framework

A TypeScript-based API performance and integration testing framework built with [k6](https://k6.io/), targeting the [Swagger Petstore API](https://petstore.swagger.io).

---

## Overview

This project provides a structured, layered test framework for automating API tests against the Petstore REST API. It separates concerns into **services** (HTTP layer), **steps** (business logic + assertions), and **tests** (test scenarios), enabling clean and reusable test composition.

---

## Target API

**Base URL:** `https://petstore.swagger.io`  
**API Version:** v2  
**API Docs:** https://petstore.swagger.io/#/

---

## Project Structure

```
PET_STORE/
├── apps/
│   ├── requestManager.ts        # Singleton exposing all service instances
│   ├── stepsManager.ts          # Singleton exposing all step instances
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
│       └── user.ts              # UserSteps – user test steps with checks
├── config/
│   └── frameworkConfig.ts       # Global config (BASE_URL)
├── framework/
│   └── k6Libs/
│       └── k6Utils.js           # Utility helpers (randomItem, randomString, etc.)
├── testData/
│   ├── integration/             # Test data for integration environment
│   ├── prod/                    # Test data for production environment
│   └── stage/                   # Test data for staging environment
├── tests/
│   ├── test.ts                  # Basic raw HTTP test (no framework)
│   ├── test2.ts                 # Pet flow: pending / available / sold pets + find by ID
│   ├── test3.ts                 # Store flow: create order → delete → verify deletion
│   └── test4.ts                 # User flow: create → get → login → update → verify
├── package.json
└── tsconfig.json
```

---

## Architecture

### Layers

| Layer | Location | Responsibility |
|---|---|---|
| **Service** | `apps/services/` | Wraps raw k6 HTTP calls per domain |
| **Steps** | `apps/steps/` | Composes service calls with `check()` assertions and `group()` labels |
| **Tests** | `tests/` | Orchestrates steps into full test scenarios |
| **Managers** | `apps/requestManager.ts`, `apps/stepsManager.ts` | Singleton access points for services and steps |

### Data Flow (Steps Pattern)

Each step method accepts a generic `stepData` object and returns it enriched with new values extracted from the response. This allows chaining steps without shared global state:

```ts
const addOrder = stepsManager.storeSteps.postOrderById();
const deleteOrder = stepsManager.storeSteps.deleteOrderById(addOrder, addOrder.orderID);
const getOrder = stepsManager.storeSteps.getOrderById(deleteOrder, addOrder.orderID);
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
| `getPetById(stepData?, petId)` | GET a pet by ID, returns `soldPetID` |

### StoreSteps
| Method | Description |
|---|---|
| `postOrderById(stepData?)` | POST a new order with a random ID, returns `orderID` |
| `deleteOrderById(stepData?, orderID)` | DELETE an order by ID, asserts 200 |
| `getOrderById(stepData?, orderID)` | GET an order by ID, asserts 404 (verifies deletion) |

### UserSteps
| Method | Description |
|---|---|
| `postUser(stepData?)` | POST a new user with a random username, returns `randomUserName` |
| `getUserByUserName(stepData?, userName)` | GET a user by username, returns `foundUserName`, `foundUserPassword`, `foundUserID` |
| `loginUserByUserNameAndPassword(stepData?, userName, password)` | GET login with credentials, asserts 200 |
| `updateUserData(stepData?, userName, password, userId)` | PUT updated user data with random name/email/phone, asserts 200 |
| `logoutUser(stepData?)` | GET logout the current user, asserts 200 |

---

## Tests

| File | Scenario |
|---|---|
| `test.ts` | Raw HTTP call to fetch available pets, picks a random pet and finds it by name (no framework, introductory example) |
| `test2.ts` | Fetches pending, available, and sold pets; finds a sold pet and a pending pet by ID |
| `test3.ts` | Creates a store order, deletes it, then verifies it returns 404 |
| `test4.ts` | Full user lifecycle: logout → create → get → login → update → verify (get again) |

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

### Using npm script (with HTTP debug mode enabled)
```bash
npm run test
```

### Using k6 directly
```bash
k6 run tests/test.ts
k6 run tests/test2.ts
k6 run tests/test3.ts
k6 run tests/test4.ts
```

### With HTTP debug output
```bash
k6 run tests/test2.ts -e K6_HTTP_DEBUG=true
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
   k6 cloud run tests/test2.ts
   ```

---

## Configuration

| Setting | Value | File |
|---|---|---|
| Base URL | `https://petstore.swagger.io` | `config/frameworkConfig.ts` |
| TypeScript target | ES2020 | `tsconfig.json` |
| Default VUs | 1 | Each test file (`options`) |
| Default iterations | 1 | Each test file (`options`) |

---

## Dependencies

| Package | Purpose |
|---|---|
| `@types/k6` | TypeScript type definitions for k6 |
