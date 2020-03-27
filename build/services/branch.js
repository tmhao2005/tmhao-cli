"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("query-string");
const base_1 = require("./base");
class BranchService extends base_1.BaseService {
    constructor(id) {
        super();
        this.id = id;
        this.createBranch = (branchName, ref) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this._http.post(`/projects/${this.id}/repository/branches`, {
                id: this.id,
                branch: branchName,
                ref,
            });
            return data;
        });
        this.deleteBranch = (branchName) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this._http.delete(`/projects/${this.id}/repository/branches/${branchName}`);
            return data;
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this._http.get(`/projects/${this.id}/repository/branches?${qs.stringify(query)}`);
            return data;
        });
    }
}
exports.BranchService = BranchService;
