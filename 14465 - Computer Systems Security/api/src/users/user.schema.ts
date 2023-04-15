import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password?: string;
}

export interface UserDoc extends Document {
  username: string;
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDoc>('save', function (next) {
  if (this.isNew) {
    const mykey = crypto.createCipheriv(
      'aes-128-cbc',
      process.env.AES_KEY,
      process.env.IV,
    );
    let cipherText = mykey.update(this.username, 'utf8', 'hex');
    cipherText += mykey.final('hex');
    this.username = cipherText;
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        return next(saltError);
      }
      bcrypt.hash(this.password, salt, (hashError, hash) => {
        if (hashError) {
          return next(hashError);
        }
        this.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});
