"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_constant_1 = require("../../common/constants/cloudinary.constant");
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const streamifier = require('streamifier');
let CloudinaryService = class CloudinaryService {
    async uploadFile(file, folderName, fileName = '') {
        return new Promise((resolve, reject) => {
            const finalName = fileName || `img_${Date.now()}`;
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: `${cloudinary_constant_1.CLOUDINARY_ROOT_FOLDER}/${this.convertToFolderName(folderName)}`,
                public_id: finalName,
                resource_type: 'image',
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    async uploadManyFiles(files, folderName, fileNames = []) {
        return Promise.all(files.map((file, index) => this.uploadFile(file, folderName, fileNames[index]?.toString() || index.toString())));
    }
    async createNewFolder(folderName) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.api
                .create_folder(`${cloudinary_constant_1.CLOUDINARY_ROOT_FOLDER}/${folderName}`)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
    }
    convertToFolderName(folderName) {
        return folderName.toLowerCase().replace(/\s+/g, '-');
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map