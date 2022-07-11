import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    // Check email is present or not
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new BadRequestException('email is already taken by another user');
    }

    // Generate salt
    const salt = randomBytes(8).toString('hex');
    // hash the password and salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    // create new user
    const newUser = this.usersService.create(email, result);
    // return user
    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedhash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedhash !== hash.toString('hex')) {
      throw new BadRequestException('invalid password');
    }

    return user;
  }
}
