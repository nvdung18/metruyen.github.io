"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const lodash_1 = __importDefault(require("lodash"));
let Util = class Util {
    generateIdByTime({ fitWithInteger, } = {}) {
        fitWithInteger = fitWithInteger ?? false;
        const date = Date.now();
        let id = parseInt(date.toString(), 10);
        if (fitWithInteger)
            id = id % 1_000_000_000;
        return id;
    }
    generateSlug(elements, option = {}) {
        const text = elements.join(' ');
        return (0, slugify_1.default)(text, option);
    }
    formatStackTrace(stack) {
        if (typeof stack === 'string') {
            return stack.split('\n').map((line) => line.trim());
        }
        return stack;
    }
    getInfoData({ fields, object }) {
        return lodash_1.default.pick(object, fields);
    }
    static getAllDataOfEnum(enumObj) {
        const entries = Object.entries(enumObj);
        return entries.map(([key, value], index) => {
            const isLastEle = index === entries.length - 1;
            return `${isLastEle ? value : value + ', '}`;
        });
    }
};
Util = __decorate([
    (0, common_1.Injectable)()
], Util);
exports.default = Util;
//# sourceMappingURL=util.service.js.map