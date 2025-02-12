import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UserRepo } from './user.repo';
import { AuthRepo } from '@modules/auth/auth.repo';
import Util from '@common/services/util.service';
import { AuthService } from '@modules/auth/auth.service';
import { FavoriteRepo } from '@modules/favorite/favorite.repo';
import { Favorite } from '@modules/favorite/models/favorite.model';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly util: Util,
    private readonly authService: AuthService,
    private readonly authRepo: AuthRepo,
    private readonly favoriteRepo: FavoriteRepo,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<object> {
    const user: User = await this.userRepo.findUserByEmail(
      createUserDto.usr_email,
    );
    if (user) {
      throw new HttpException(
        'User already registered! ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hash(createUserDto.usr_password, 10); // it should be hash from the client, not the server.
    createUserDto.usr_password = passwordHash;

    const userId: number = this.util.generateIdByTime();
    const userSlug: string = this.util.generateSlug([
      createUserDto.usr_name,
      Math.floor(userId / 1000).toString(),
    ]);
    const newUser = await this.userRepo.createNewUser(
      new User({
        usr_id: userId,
        usr_slug: userSlug,
        usr_role: 1,
        ...createUserDto,
      }),
    );

    if (newUser) {
      const { keyForAccessToken, keyForRefreshToken } =
        this.authService.createKeyForAccessAndRefreshToken();

      const payload = { sub: newUser.usr_id, email: newUser.usr_email };
      const { accessToken, refreshToken } =
        await this.authService.createKeyTokenPair(
          payload,
          keyForAccessToken,
          keyForRefreshToken,
        );

      // add key and token to database
      const keyStore = await this.authRepo.createKeyToken({
        id: this.util.generateIdByTime(),
        user_id: newUser.usr_id,
        refresh_key: keyForRefreshToken,
        public_key: keyForAccessToken,
        refresh_token: refreshToken,
      });
      if (!keyStore)
        throw new HttpException(
          'Cannot create key token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      // create favorite storage for user, if create failed, this func also continue execute
      const favoriteId = this.util.generateIdByTime({ fitWithInteger: true });
      await this.favoriteRepo.createFavoriteStorage(
        new Favorite({
          fav_id: favoriteId,
          fav_user_id: newUser.usr_id,
        }),
      );

      return {
        user: this.util.getInfoData({
          fields: ['usr_id', 'usr_name', 'usr_email'],
          object: newUser,
        }),
        tokens: { accessToken, refreshToken },
      };
    }
    throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
  }

  async getRoleOfUser(userId: number): Promise<string> {
    const user = await this.userRepo.getUserRoleByUserId(userId);
    return user.role.role_name;
  }

  async getRoleSlugOfUser(userId: number): Promise<string> {
    const user = await this.userRepo.getUserRoleByUserId(userId);
    return user.role.role_slug;
  }
}
