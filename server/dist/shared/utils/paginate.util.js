"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaginateUtil {
    static paginationReturn({ page, total, limit, offset }) {
        return {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            offset: offset,
        };
    }
    static setPaginateDto(paginateDto, data, pagination) {
        paginateDto['results'] = data;
        paginateDto['total'] = pagination['totalItems'];
        paginateDto['offset'] = pagination['offset'];
        paginateDto['totalPages'] = pagination['totalPages'];
        return paginateDto;
    }
}
exports.default = PaginateUtil;
//# sourceMappingURL=paginate.util.js.map