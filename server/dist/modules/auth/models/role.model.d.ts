import { Model } from 'sequelize-typescript';
import { User } from '@modules/user/models/user.model';
import { Resource } from './resource.model';
export declare class Role extends Model {
    role_id: number;
    role_name: 'user' | 'admin';
    role_status: 'active' | 'inactive';
    role_description: string;
    role_slug: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    resources: Resource[];
}
