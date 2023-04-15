import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateUserDto } from 'src/dto/create-user.dto';
import { IUserDto } from 'src/dto/user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async create(user: ICreateUserDto): Promise<IUserDto> {
    const createdUser = new this.userModel(user);
    await createdUser.save();
    const { _id, username } = createdUser;
    return { _id, username };
  }
}
