import { Inject, Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';
import { Blob } from 'buffer';
import { PinataResponse } from './pinata-response';
@Injectable()
export class PinataService {
  constructor(@Inject('PINATA_SDK') private readonly pinata: PinataSDK) {}

  async uploadFile(
    file: Express.Multer.File,
    groupName: string,
    fileName: string = '',
  ): Promise<PinataResponse> {
    const groups = await this.getGroupByName(groupName);
    let group: PinataResponse;
    if (groups.length === 0) {
      group = await this.createNewGroup(groupName);
    } else {
      group = groups[0];
    }

    const objFile = Object.assign(
      new Blob([file.buffer], { type: 'text/plain' }),
      {
        name: fileName,
        lastModified: Date.now(),
      },
    );

    //  Upload file lên Pinata
    const upload = await this.pinata.upload.file(objFile, {
      groupId: group['id'],
    });

    return upload;
  }

  async uploadManyFiles(
    files: Express.Multer.File[],
    groupName: string,
    fileNames: any[] = [],
  ): Promise<PinataResponse[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(
          file,
          groupName,
          fileNames[index]?.toString() || index.toString(),
        ),
      ),
    );
  }

  async createNewGroup(folderName: string): Promise<PinataResponse> {
    const group = await this.pinata.groups.create({ name: folderName });
    return group;
  }

  async getGroupByName(groupName: string): Promise<PinataResponse[]> {
    const group = await this.pinata.groups.list().name(groupName);
    return group;
  }

  convertToFolderName(folderName: string): string {
    return folderName.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
  }
}
