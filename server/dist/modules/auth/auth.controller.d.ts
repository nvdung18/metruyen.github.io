import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CacheService } from 'src/shared/cache/cache.service';
export declare class AuthController {
    private authService;
    private readonly cacheService;
    constructor(authService: AuthService, cacheService: CacheService);
    signIn(signInDto: SignInDto): Promise<{
        metadata: object;
    }>;
    logout(req: Request): Promise<{
        metadata: any;
    }>;
    AuthToken(req: Request): Promise<{
        metadata: any;
    }>;
    handleRefreshToken(req: Request): Promise<{
        metadata: object;
    }>;
    authRole(req: Request): Promise<{
        metadata: string;
    }>;
    testCache(): Promise<{
        metadata: {
            data: string;
        };
    }>;
}
