import { PinataSDK } from 'pinata-web3';
import { PinataResponse } from './pinata-response';
export declare class PinataService {
    private readonly pinata;
    constructor(pinata: PinataSDK);
    uploadFile(file: Buffer | Express.Multer.File, fileName: string, groupName?: string): Promise<PinataResponse>;
    uploadManyFiles(files: Express.Multer.File[], groupName?: string, fileNames?: any[]): Promise<PinataResponse[]>;
    createNewGroup(folderName: string): Promise<PinataResponse>;
    getGroupByName(groupName: string): Promise<PinataResponse[]>;
    getFileByCid(cid: string): Promise<PinataResponse>;
}
