import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepo } from '@modules/auth/auth.repo';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private authRepo;
    private reflector;
    private authService;
    private userService;
    constructor(jwtService: JwtService, authRepo: AuthRepo, reflector: Reflector, authService: AuthService, userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
    private verifyJwt;
}
