"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataService = void 0;
const common_1 = require("@nestjs/common");
const pinata_web3_1 = require("pinata-web3");
const buffer_1 = require("buffer");
let PinataService = class PinataService {
    constructor(pinata) {
        this.pinata = pinata;
    }
    async uploadFile(file, fileName, groupName = '') {
        const fileBuffer = file instanceof Buffer ? file : file.buffer;
        const objFile = Object.assign(new buffer_1.Blob([fileBuffer], { type: 'text/plain' }), {
            name: fileName,
            lastModified: Date.now(),
        });
        let group = null;
        if (groupName != '') {
            const groups = await this.getGroupByName(groupName);
            if (groups.length === 0) {
                group = await this.createNewGroup(groupName);
            }
            else {
                group = groups[0];
            }
        }
        const upload = await this.pinata.upload.file(objFile, {
            groupId: group == null ? '' : group['id'],
        });
        return upload;
    }
    async uploadManyFiles(files, groupName = '', fileNames = []) {
        return Promise.all(files.map((file, index) => this.uploadFile(file, fileNames[index]?.toString() || index.toString(), groupName)));
    }
    async createNewGroup(folderName) {
        const group = await this.pinata.groups.create({ name: folderName });
        return group;
    }
    async getGroupByName(groupName) {
        const group = await this.pinata.groups.list().name(groupName);
        return group;
    }
    async getFileByCid(cid) {
        const file = await this.pinata.gateways.get(cid);
        return file;
    }
};
exports.PinataService = PinataService;
exports.PinataService = PinataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PINATA_SDK')),
    __metadata("design:paramtypes", [pinata_web3_1.PinataSDK])
], PinataService);
//# sourceMappingURL=pinata.service.js.map