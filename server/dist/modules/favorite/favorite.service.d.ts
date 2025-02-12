import { FavoriteRepo } from './favorite.repo';
import { FavoriteDetail } from './models/favorite-details.model';
import { FavoriteDetailsDto } from './dto/favorite-details.dto';
import { MangaService } from '@modules/manga/manga.service';
export declare class FavoriteService {
    private readonly favoriteRepo;
    private readonly mangaService;
    constructor(favoriteRepo: FavoriteRepo, mangaService: MangaService);
    addMangaToFavorite(favoriteDetailsDto: FavoriteDetailsDto, fav_user_id: boolean): Promise<FavoriteDetail>;
    deleteMangaFromFavorite(favoriteDetailsDto: FavoriteDetailsDto, fav_user_id: boolean): Promise<number>;
    getListMangaFromFavorite(fav_id: number, fav_user_id: boolean): Promise<FavoriteDetail[]>;
}
