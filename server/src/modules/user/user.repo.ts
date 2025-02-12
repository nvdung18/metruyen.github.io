import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Role } from '@modules/auth/models/role.model';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { usr_email: email } });
  }

  async createNewUser(user: User): Promise<User> {
    return this.userModel.create(user.toJSON());
  }

  async getUserRoleByUserId(userId: number): Promise<User> {
    return this.userModel.findByPk(userId, {
      include: [{ model: Role, required: false }],
    });
  }
}
