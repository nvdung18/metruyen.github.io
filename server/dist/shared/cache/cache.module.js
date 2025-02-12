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
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const cacheable_1 = require("cacheable");
const redis_1 = __importDefault(require("@keyv/redis"));
const cache_service_1 = require("./cache.service");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
CacheModule.handleConnectionError = (err) => console.log('Connection Error', err);
CacheModule.handleClear = () => {
    console.log('Cache Cleared');
};
CacheModule.handleDisconnect = () => console.log('Disconnected');
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: 'CACHE_INSTANCE',
                useFactory: () => {
                    const secondary = new redis_1.default(process.env.REDIS_URL, {
                        namespace: 'user',
                    });
                    secondary.on('error', CacheModule.handleConnectionError);
                    return new cacheable_1.Cacheable({ secondary });
                },
            },
            cache_service_1.CacheService,
        ],
        exports: ['CACHE_INSTANCE', cache_service_1.CacheService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map