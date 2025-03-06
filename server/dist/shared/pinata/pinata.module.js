"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataModule = void 0;
const common_1 = require("@nestjs/common");
const pinata_service_1 = require("./pinata.service");
const pinata_provider_1 = require("./pinata.provider");
const config_1 = require("@nestjs/config");
let PinataModule = class PinataModule {
};
exports.PinataModule = PinataModule;
exports.PinataModule = PinataModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot()],
        providers: [pinata_service_1.PinataService, pinata_provider_1.PinataProvider],
        exports: [pinata_service_1.PinataService],
    })
], PinataModule);
//# sourceMappingURL=pinata.module.js.map