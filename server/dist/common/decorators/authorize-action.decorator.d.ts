interface RoleAction {
    action: string;
    resource: string;
}
export declare function AuthorizeAction(roleAction: RoleAction): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
