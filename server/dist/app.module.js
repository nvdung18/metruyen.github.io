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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@nestjs/core");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const config_1 = require("@nestjs/config");
const mysql_config_1 = __importDefault(require("./configs/mysql.config"));
const sequelize_1 = require("@nestjs/sequelize");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
const common_module_1 = require("./common/common.module");
const auth_service_1 = require("./modules/auth/auth.service");
const cache_module_1 = require("./shared/cache/cache.module");
const category_module_1 = require("./modules/category/category.module");
const manga_module_1 = require("./modules/manga/manga.module");
const favorite_module_1 = require("./modules/favorite/favorite.module");
const chapter_module_1 = require("./modules/chapter/chapter.module");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_module_1 = require("./shared/cloudinary/cloudinary.module");
const pinata_module_1 = require("./shared/pinata/pinata.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                dest: './shared/uploads',
            }),
            config_1.ConfigModule.forRoot({
                cache: true,
                isGlobal: true,
            }),
            sequelize_1.SequelizeModule.forRootAsync(mysql_config_1.default.asProvider()),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            common_module_1.CommonModule,
            cache_module_1.CacheModule,
            category_module_1.CategoryModule,
            manga_module_1.MangaModule,
            favorite_module_1.FavoriteModule,
            chapter_module_1.ChapterModule,
            cloudinary_module_1.CloudinaryModule,
            pinata_module_1.PinataModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map