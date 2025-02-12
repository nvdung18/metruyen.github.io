import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl } from 'accesscontrol';
import { CacheService } from 'src/shared/cache/cache.service';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private authService;
    private userService;
    private cacheService;
    ac: AccessControl;
    constructor(reflector: Reflector, authService: AuthService, userService: UserService, cacheService: CacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
