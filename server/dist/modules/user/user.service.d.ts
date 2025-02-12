import { CreateUserDto } from './dto/create-user.dto';
import { UserRepo } from './user.repo';
import { AuthRepo } from '@modules/auth/auth.repo';
import Util from '@common/services/util.service';
import { AuthService } from '@modules/auth/auth.service';
import { FavoriteRepo } from '@modules/favorite/favorite.repo';
export declare class UserService {
    private readonly userRepo;
    private readonly util;
    private readonly authService;
    private readonly authRepo;
    private readonly favoriteRepo;
    constructor(userRepo: UserRepo, util: Util, authService: AuthService, authRepo: AuthRepo, favoriteRepo: FavoriteRepo);
    create(createUserDto: CreateUserDto): Promise<object>;
    getRoleOfUser(userId: number): Promise<string>;
    getRoleSlugOfUser(userId: number): Promise<string>;
}
