import { Model } from 'sequelize-typescript';
import { Role } from './role.model';
export declare class Resource extends Model {
    src_id: number;
    src_name: string;
    src_slug: string;
    src_description: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
}
