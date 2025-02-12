"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivedResourceAccess = exports.ARCHIVED_RESOURCE_ACCESS = void 0;
const common_1 = require("@nestjs/common");
exports.ARCHIVED_RESOURCE_ACCESS = 'archived_resource_access';
const ArchivedResourceAccess = (isArchivedResource = true) => (0, common_1.SetMetadata)(exports.ARCHIVED_RESOURCE_ACCESS, isArchivedResource);
exports.ArchivedResourceAccess = ArchivedResourceAccess;
//# sourceMappingURL=archived-resource.decorator.js.map