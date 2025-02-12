import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { AuthRepo } from './auth.repo';
import { UserRepo } from '@modules/user/user.repo';
import Util from '@common/services/util.service';
import { KeyToken } from './models/keyToken.model';
export declare class AuthService {
    private jwtService;
    private userRepo;
    private authRepo;
    private util;
    constructor(jwtService: JwtService, userRepo: UserRepo, authRepo: AuthRepo, util: Util);
    signIn(data: SignInDto): Promise<object>;
    logout(keyStore: KeyToken): Promise<any>;
    handleRefreshToken(refreshToken: string, user: {
        sub: number;
        email: string;
    }, keyStore: KeyToken): Promise<object>;
    createKeyTokenPair(payload: object, keyForAccessToken: string, keyForRefreshToken: string): Promise<Record<string, string>>;
    createKeyForAccessAndRefreshToken(): {
        keyForAccessToken: string;
        keyForRefreshToken: string;
    };
    roleList(): Promise<Array<object>>;
    getRoleByRoleSlug(roleSlug: string): Promise<string>;
}
