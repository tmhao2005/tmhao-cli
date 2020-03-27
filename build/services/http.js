"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
function createHttp(opts = {}) {
    const http = axios_1.default.create(Object.assign({ baseURL: `${process.env.GITLAB_API}/api/v4`, headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
        } }, opts));
    return http;
}
exports.createHttp = createHttp;
