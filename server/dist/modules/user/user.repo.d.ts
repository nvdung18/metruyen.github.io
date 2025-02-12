import { User } from './models/user.model';
export declare class UserRepo {
    private userModel;
    constructor(userModel: typeof User);
    findUserByEmail(email: string): Promise<User>;
    createNewUser(user: User): Promise<User>;
    getUserRoleByUserId(userId: number): Promise<User>;
}
