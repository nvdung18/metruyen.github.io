"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const db_exception_1 = require("./common/filters/db.exception");
const helmet_1 = __importDefault(require("helmet"));
const swagger_1 = require("@nestjs/swagger");
const swagger_config_1 = require("./configs/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        disableErrorMessages: process.env.NODE_ENV == 'development' ? true : false,
    }));
    app.useGlobalFilters(new db_exception_1.DatabaseExceptionsFilter());
    app.use((0, helmet_1.default)());
    app.enableCors();
    const config = swagger_config_1.SwaggerConfig.configDocumentBuilder;
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory, swagger_config_1.SwaggerConfig.SwaggerCustomOptions);
    await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map