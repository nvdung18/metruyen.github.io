import { FavoriteService } from './favorite.service';
import { FavoriteDetailsDto } from './dto/favorite-details.dto';
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    addMangaToFavorite(req: Request, favoriteDetailsDto: FavoriteDetailsDto): Promise<{
        metadata: any;
    }>;
    deleteMangaFromFavorite(req: Request, favoriteDetailsDto: FavoriteDetailsDto): Promise<{
        metadata: number;
    }>;
    getListMangaFromFavorite(id: number, req: Request): Promise<{
        metadata: any;
    }>;
}
