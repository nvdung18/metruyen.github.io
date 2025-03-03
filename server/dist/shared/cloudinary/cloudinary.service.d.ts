import { CloudinaryResponse } from './cloudinary-response';
export declare class CloudinaryService {
    uploadFile(file: Express.Multer.File, folderName: string, fileName?: string): Promise<CloudinaryResponse>;
    uploadManyFiles(files: Express.Multer.File[], folderName: string, fileNames?: any[]): Promise<CloudinaryResponse[]>;
    createNewFolder(folderName: string): Promise<CloudinaryResponse>;
    convertToFolderName(folderName: string): string;
}
