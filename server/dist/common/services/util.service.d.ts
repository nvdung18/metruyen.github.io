export default class Util {
    generateIdByTime({ fitWithInteger, }?: {
        fitWithInteger?: boolean;
    }): number;
    generateSlug(elements: Array<string>, option?: object): string;
    formatStackTrace(stack: string | any): string[] | string;
    getInfoData({ fields, object }: {
        fields: any[];
        object: any;
    }): object;
    static getAllDataOfEnum(enumObj: any): string[];
}
