export declare const ROLES_KEY = "roles";
export declare const GUEST_ROLE = "guest";
export declare const Roles: (params: {
    action: string;
    resource: string;
}) => import("@nestjs/common").CustomDecorator<string>;
export declare const GuestRole: (guest?: boolean) => import("@nestjs/common").CustomDecorator<string>;
