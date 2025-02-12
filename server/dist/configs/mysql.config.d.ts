import { Dialect } from 'sequelize';
declare const _default: (() => {
    dialect: Dialect;
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
    autoLoadModels: boolean;
    logging: boolean;
    dialectOptions: {
        charset: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    dialect: Dialect;
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
    autoLoadModels: boolean;
    logging: boolean;
    dialectOptions: {
        charset: string;
    };
}>;
export default _default;
