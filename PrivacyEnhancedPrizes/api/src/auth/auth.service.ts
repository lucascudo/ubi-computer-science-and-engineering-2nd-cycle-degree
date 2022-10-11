import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const mykey = crypto.createCipheriv(
      'aes-128-cbc',
      process.env.AES_KEY,
      process.env.IV,
    );
    let cipherText = mykey.update(username, 'utf8', 'hex');
    cipherText += mykey.final('hex');
    const user: User = await this.usersService.findOne(cipherText);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const mykey = crypto.createDecipheriv(
      'aes-128-cbc',
      process.env.AES_KEY,
      process.env.IV,
    );
    let decryptedUsername = mykey.update(user._doc.username, 'hex', 'utf8');
    decryptedUsername += mykey.final('utf8');
    const payload = {
      username: decryptedUsername,
      sub: user._doc._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
