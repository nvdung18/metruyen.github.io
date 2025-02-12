import { Model } from 'sequelize-typescript';
import { Role } from '@modules/auth/models/role.model';
export declare class User extends Model {
    usr_id: number;
    usr_email: string;
    usr_password: string;
    usr_name: string;
    usr_avatar: string;
    usr_status: 'pending' | 'active' | 'block';
    usr_sex: string;
    usr_salt: string;
    usr_slug: string;
    usr_role: number;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
}
