import { PinataSDK } from 'pinata-web3';
import { ConfigService } from '@nestjs/config';
export declare const PinataProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => PinataSDK;
    inject: (typeof ConfigService)[];
};
