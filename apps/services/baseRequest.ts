import http, { Params, RequestBody } from 'k6/http';
import { BASE_URL } from '../../config/frameworkConfig.ts';

export class BaseRequest {

constructor(private readonly baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
}

protected GET(path: string, params?: Params){
    return http.get(`${this.baseUrl}${path}`, params);
}
    
protected POST(path: string, body?: RequestBody | null, params?: Params){
    return http.post(`${this.baseUrl}${path}`, body != null ? JSON.stringify(body) : null, params);
}

protected DELETE(path: string, body?: RequestBody | null, params?: Params){
    return http.del(`${this.baseUrl}${path}`, body != null ? JSON.stringify(body) : null, params);
}

protected PUT(path: string, body?: RequestBody | null, params?: Params){
    return http.put(`${this.baseUrl}${path}`, body != null ? JSON.stringify(body) : null, params);
}
}