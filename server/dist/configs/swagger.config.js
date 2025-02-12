"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_util_1 = require("../shared/utils/swagger.util");
exports.SwaggerConfig = {
    configDocumentBuilder: new swagger_1.DocumentBuilder()
        .setTitle('Manga API')
        .setDescription((0, swagger_util_1.setDescriptionDocumentBuilder)())
        .setVersion('1.0')
        .addBearerAuth()
        .addCookieAuth('client-id', {
        type: 'apiKey',
        description: `Specifies the Client ID used for API authentication. This Client ID will be applied globally across all API endpoints where authentication is required.
          If you do not provide a client id, the system will default you to a guest. `,
    }, 'client-id')
        .addGlobalParameters({
        name: 'x-client-id',
        in: 'header',
        description: 'You can override client-id here',
    })
        .build(),
    SwaggerCustomOptions: {
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
            requestInterceptor: (request) => {
                try {
                    const authorized = localStorage.getItem('authorized')
                        ? JSON.parse(localStorage.getItem('authorized'))
                        : '';
                    if (authorized && authorized['client-id']) {
                        const clientId = authorized['client-id']['value'];
                        request.headers['x-client-id'] =
                            request.headers['x-client-id'] || clientId;
                    }
                }
                catch (error) {
                    console.log(error);
                }
                return request;
            },
            defaultModelsExpandDepth: 10,
            defaultModelExpandDepth: 10,
        },
    },
};
//# sourceMappingURL=swagger.config.js.map