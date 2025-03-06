import { PinataSDK } from 'pinata-web3';
import { PinataResponse } from './pinata-response';
export declare class PinataService {
    private readonly pinata;
    constructor(pinata: PinataSDK);
    uploadFile(file: Express.Multer.File, groupName: string, fileName?: string): Promise<PinataResponse>;
    uploadManyFiles(files: Express.Multer.File[], groupName: string, fileNames?: any[]): Promise<PinataResponse[]>;
    createNewGroup(folderName: string): Promise<PinataResponse>;
    getGroupByName(groupName: string): Promise<PinataResponse[]>;
    convertToFolderName(folderName: string): string;
}
