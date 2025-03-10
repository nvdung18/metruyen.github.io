// cloudinary-response.ts
import { PinResponse, GroupResponseItem, GetCIDResponse } from 'pinata-web3';

export type PinataResponse = PinResponse | GroupResponseItem | GetCIDResponse;
