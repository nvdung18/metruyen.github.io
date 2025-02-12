"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestRole = exports.Roles = exports.GUEST_ROLE = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
exports.GUEST_ROLE = 'guest';
const Roles = (params) => (0, common_1.SetMetadata)(exports.ROLES_KEY, params);
exports.Roles = Roles;
const GuestRole = (guest = true) => (0, common_1.SetMetadata)(exports.GUEST_ROLE, guest);
exports.GuestRole = GuestRole;
//# sourceMappingURL=roles.decorator.js.map