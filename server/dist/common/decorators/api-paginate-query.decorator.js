"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginateQuery = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiPaginateQuery = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }));
};
exports.ApiPaginateQuery = ApiPaginateQuery;
//# sourceMappingURL=api-paginate-query.decorator.js.map