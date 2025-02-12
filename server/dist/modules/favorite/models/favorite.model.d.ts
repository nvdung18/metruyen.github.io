import { User } from '@modules/user/models/user.model';
import { Model } from 'sequelize-typescript';
export declare class Favorite extends Model {
    fav_id: number;
    fav_user_id: number;
    user: User;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
