import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Redirect,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { CardsService } from './cards/cards.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { KeyExchangeService } from './key-exchange/key-exchange.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private keyExchangeService: KeyExchangeService,
  ) {}

  @Get()
  @Redirect('api', 301)
  index() {
    return;
  }

  @Get('public-key')
  publicKey() {
    return Array.from(this.keyExchangeService.getPublicKey());
  }

  @Post('register')
  async register(@Request() req) {
    const decryptedMessage = this.keyExchangeService.decryptMessage(
      Uint8Array.from(req.body.oneTimeCode),
      Uint8Array.from(req.body.publicKey),
      Uint8Array.from(req.body.cipherText),
    );
    const user = JSON.parse(decryptedMessage);
    const createdUser = this.usersService.create(user);
    const oneTimeCode = this.keyExchangeService.getOneTimeCode();
    const publicKey = this.keyExchangeService.getPublicKey();
    const cipherText = this.keyExchangeService.encryptMessage(
      oneTimeCode,
      Uint8Array.from(req.body.publicKey),
      JSON.stringify(createdUser),
    );
    return {
      oneTimeCode: Array.from(oneTimeCode),
      publicKey: Array.from(publicKey),
      cipherText: Array.from(cipherText),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const loggedUser = await this.authService.login(req.user);
    return this.keyExchangeService.encryptPlainText(
      JSON.stringify(loggedUser),
      Uint8Array.from(req.body.publicKey),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:publicKey')
  profile(@Request() req, @Param() params) {
    return this.keyExchangeService.encryptPlainText(
      JSON.stringify(req.user),
      Uint8Array.from(JSON.parse(params.publicKey)),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('scratch-card/:publicKey')
  async scratchCard(@Request() req, @Param() params) {
    const card = await this.cardsService.scratch(req.user._id);
    return this.keyExchangeService.encryptPlainText(
      JSON.stringify(card),
      Uint8Array.from(JSON.parse(params.publicKey)),
    );
  }
}
