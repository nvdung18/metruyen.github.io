export default class PaginateUtil {
    static paginationReturn({ page, total, limit, offset }: {
        page: any;
        total: any;
        limit: any;
        offset: any;
    }): {
        currentPage: any;
        itemsPerPage: any;
        totalItems: any;
        totalPages: number;
        offset: any;
    };
    static setPaginateDto<T>(paginateDto: T, data: any, pagination: object): T;
}
