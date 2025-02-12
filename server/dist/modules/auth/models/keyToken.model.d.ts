import { Model } from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
export declare class KeyToken extends Model {
    id: number;
    user_id: number;
    refresh_key: string;
    public_key: string;
    refresh_tokens_used: object;
    refresh_token: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
