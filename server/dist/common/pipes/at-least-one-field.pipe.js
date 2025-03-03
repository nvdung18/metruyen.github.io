"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtLeastOneFieldPipe = void 0;
const common_1 = require("@nestjs/common");
let AtLeastOneFieldPipe = class AtLeastOneFieldPipe {
    constructor({ removeAllEmptyField = false, } = {}) {
        this.removeAllEmptyField = removeAllEmptyField;
    }
    transform(value, metadata) {
        if (this.removeAllEmptyField)
            value = this.executeRemoveAllEmptyField(value);
        if (Object.keys(value).length === 0 ||
            Object.values(value).some((val) => val === undefined || val === null)) {
            throw new common_1.BadRequestException('At least one field must be provided or some value is undefined, null');
        }
        return value;
    }
    executeRemoveAllEmptyField(value) {
        value = Object.fromEntries(Object.entries(value).filter(([_, val]) => val !== '' &&
            val !== -1 &&
            val !== null &&
            val !== undefined &&
            (!Array.isArray(val) || val.length > 0)));
        return value;
    }
};
exports.AtLeastOneFieldPipe = AtLeastOneFieldPipe;
exports.AtLeastOneFieldPipe = AtLeastOneFieldPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], AtLeastOneFieldPipe);
//# sourceMappingURL=at-least-one-field.pipe.js.map