"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataProvider = void 0;
const pinata_web3_1 = require("pinata-web3");
const config_1 = require("@nestjs/config");
exports.PinataProvider = {
    provide: 'PINATA_SDK',
    useFactory: (configService) => {
        return new pinata_web3_1.PinataSDK({
            pinataJwt: configService.get('PINATA_JWT'),
            pinataGateway: configService.get('PINATA_GATEWAY_URL'),
        });
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=pinata.provider.js.map