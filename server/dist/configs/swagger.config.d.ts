export declare const SwaggerConfig: {
    configDocumentBuilder: Omit<import("@nestjs/swagger").OpenAPIObject, "paths">;
    SwaggerCustomOptions: {
        swaggerOptions: {
            docExpansion: string;
            persistAuthorization: boolean;
            requestInterceptor: (request: any) => any;
            defaultModelsExpandDepth: number;
            defaultModelExpandDepth: number;
        };
    };
};
