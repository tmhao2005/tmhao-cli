"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
class BaseService {
    constructor() {
        this._http = http_1.createHttp();
    }
}
exports.BaseService = BaseService;
