import { Inject, Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';
import { Blob } from 'buffer';
import { PinataResponse } from './pinata-response';
@Injectable()
export class PinataService {
  constructor(@Inject('PINATA_SDK') private readonly pinata: PinataSDK) {}

  async uploadFile(
    file: Buffer | Express.Multer.File,
    fileName: string,
    groupName: string = '',
  ): Promise<PinataResponse> {
    const fileBuffer = file instanceof Buffer ? file : file.buffer;
    const objFile = Object.assign(
      new Blob([fileBuffer], { type: 'text/plain' }),
      {
        name: fileName,
        lastModified: Date.now(),
      },
    );

    let group: PinataResponse = null;
    if (groupName != '') {
      const groups = await this.getGroupByName(groupName);
      if (groups.length === 0) {
        group = await this.createNewGroup(groupName);
      } else {
        group = groups[0];
      }
    }

    //  Upload file lên Pinata
    const upload = await this.pinata.upload.file(objFile, {
      groupId: group == null ? '' : group['id'],
    });

    return upload;
  }

  async uploadManyFiles(
    files: Express.Multer.File[],
    groupName: string = '',
    fileNames: any[] = [],
  ): Promise<PinataResponse[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(
          file,
          fileNames[index]?.toString() || index.toString(),
          groupName,
        ),
      ),
    );
  }

  async deleteFilesByCid(cid: string[]): Promise<PinataResponse[]> {
    const deleteResponse = await this.pinata.unpin(cid);
    return deleteResponse;
  }

  async createNewGroup(folderName: string): Promise<PinataResponse> {
    const group = await this.pinata.groups.create({ name: folderName });
    return group;
  }

  async getGroupByName(groupName: string): Promise<PinataResponse[]> {
    const group = await this.pinata.groups.list().name(groupName);
    return group;
  }

  async getFileByCid(cid: string): Promise<PinataResponse> {
    const file = await this.pinata.gateways.get(cid);
    return file;
  }
}
