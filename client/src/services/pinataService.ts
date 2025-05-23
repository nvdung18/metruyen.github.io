import axios from 'axios';

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
console.log('PINATA_JWT: ', PINATA_JWT);
const pinataApi = axios.create({
  baseURL: 'https://api.pinata.cloud', // Remove /pinning from baseURL
  headers: {
    Authorization: `Bearer ${PINATA_JWT}`
  },
  timeout: 300000 // 5 minutes timeout for uploads
});

export class PinataService {
  static async uploadFolder(files: File[], folderName: string) {
    try {
      // 1. Upload từng file và lấy CID
      console.log('folderName', folderName);
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
          name: `page-${index}`,
          keyvalues: {
            folder: folderName,
            page: index.toString()
          }
        });
        formData.append('pinataMetadata', metadata);

        const response = await pinataApi.post(
          '/pinning/pinFileToIPFS',
          formData
        ); // Add /pinning prefix
        return {
          page: index,
          cid: response.data.IpfsHash
        };
      });

      // 2. Đợi tất cả file upload xong
      const results = await Promise.all(uploadPromises);

      // 3. Tạo JSON metadata cho folder
      const folderMetadata = {
        name: folderName,
        pages: results.map((r) => ({
          page: r.page,
          image: `ipfs.io/ipfs/${r.cid}`
        }))
      };
      console.log(
        'Folder Metadata before upload:',
        JSON.stringify(folderMetadata, null, 2)
      ); // 4. Upload JSON metadata với pinataMetadata
      const jsonResponse = await pinataApi.post('/pinning/pinJSONToIPFS', {
        pinataContent: folderMetadata, // Actual JSON content
        pinataMetadata: {
          // Metadata for the JSON file
          name: `${folderName}-metadata`,
          keyvalues: {
            type: 'chapter-metadata',
            folder: folderName,
            timestamp: new Date().toISOString()
          }
        }
      });

      return {
        folderCid: jsonResponse.data.IpfsHash,
        pages: results
      };
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw error;
    }
  }

  static async uploadFolderAsDirectory(files: File[], folderName: string) {
    try {
      const formData = new FormData();

      // Đặt tất cả file vào trong một thư mục con
      const directoryName = folderName.replace(/ /g, '%20');
      files.forEach((file, index) => {
        const paddedIndex = index.toString().padStart(3, '0');
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        // Thêm directoryName vào path của file
        formData.append(
          'file',
          file,
          `${folderName}/${paddedIndex}_${safeFileName}`
        );
      });

      const metadata = JSON.stringify({
        name: folderName,
        keyvalues: {
          type: 'manga-chapter',
          fileCount: files.length.toString(),
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        wrapWithDirectory: true,
        cidVersion: 1
      });
      formData.append('pinataOptions', options);

      const response = await pinataApi.post('/pinning/pinFileToIPFS', formData);

      return {
        folderCid: response.data.IpfsHash,
        fileCount: files.length,
        gateway: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}/${directoryName}`
      };
    } catch (error) {
      console.error('Pinata folder upload error:', error);
      throw error;
    }
  }

  static async extractCIDFromTextHtml(html: string): Promise<string[]> {
    const cidRegex = /href="\/ipfs\/([a-zA-Z0-9]+)\?filename=/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = cidRegex.exec(html)) !== null) {
      matches.push(match[1]); // Extract the CID
    }

    return matches;
  }
}
