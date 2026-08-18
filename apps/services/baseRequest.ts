import http, { Params, RequestBody } from 'k6/http';
import { BASE_URL } from '../../config/frameworkConfig.ts';

export class BaseRequest {

constructor(private readonly baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
}

protected GET(path: String, params?: Params){
    return http.get(`${this.baseUrl}${path}`, params);
}
    
protected POST(path: String, body?: RequestBody | null, params?: Params){
    return http.post(`${this.baseUrl}${path}`, JSON.stringify(body), params);
}

protected DELETE(path: String, body?: RequestBody | null, params?: Params){
    return http.del(`${this.baseUrl}${path}`, JSON.stringify(body), params);
}

protected PUT(path: String, body?: RequestBody | null, params?: Params){
    return http.put(`${this.baseUrl}${path}`, JSON.stringify(body), params);
}
}