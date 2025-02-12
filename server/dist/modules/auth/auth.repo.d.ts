import { KeyToken } from './models/keyToken.model';
import { RoleGrants } from './models/rolegrants.model';
import { Role } from './models/role.model';
import { Resource } from './models/resource.model';
export declare class AuthRepo {
    private keyTokenModel;
    private roleGrantsModel;
    private roleModel;
    private resourceModel;
    constructor(keyTokenModel: typeof KeyToken, roleGrantsModel: typeof RoleGrants, roleModel: typeof Role, resourceModel: typeof Resource);
    createKeyToken({ id, user_id, refresh_key, public_key, refresh_token, }: {
        id: any;
        user_id: any;
        refresh_key: any;
        public_key: any;
        refresh_token: any;
    }): Promise<KeyToken>;
    updateOrCreateKeyTokenByUserId<T>({ id, user_id, refresh_key, public_key, refresh_token, }: {
        id?: string;
        user_id: number;
        refresh_key: string;
        public_key: string;
        refresh_token: string;
    }, option?: object): Promise<T>;
    findKeyTokenByUserId(user_id: number): Promise<KeyToken>;
    deleteKeyTokenByUserId(user_id: number): Promise<number>;
    deleteKeyTokenById(id: number): Promise<number>;
    updateRefreshTokenUsedByUserId(user_id: number, refresh_token: string, refresh_tokens_used: object): Promise<number>;
    getAllRoleGrants(): Promise<RoleGrants[]>;
    getRoleByRoleSlug(roleSlug: string): Promise<Role>;
}
