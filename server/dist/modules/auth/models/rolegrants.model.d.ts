import { Model } from 'sequelize-typescript';
import { Role } from './role.model';
import { Resource } from './resource.model';
export declare class RoleGrants extends Model {
    grant_role: number;
    grant_resource: number;
    grant_action: object;
    grant_attributes: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    resource: Resource;
}
