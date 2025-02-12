"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mysql-database', () => ({
    dialect: process.env.DB_DIALECT,
    port: (process.env.DB_PORT || 3306),
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME_DB || 'default_db',
    autoLoadModels: true,
    logging: false,
    dialectOptions: {
        charset: 'utf8mb4',
    },
}));
//# sourceMappingURL=mysql.config.js.map