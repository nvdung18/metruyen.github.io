export declare class PaginatedDto<TData> {
    page: number;
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    results: TData[];
}
