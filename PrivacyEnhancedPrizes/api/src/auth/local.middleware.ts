import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KeyExchangeService } from 'src/key-exchange/key-exchange.service';

@Injectable()
export class LocalMiddleware implements NestMiddleware {
  constructor(private keyExchangeService: KeyExchangeService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = JSON.parse(
      this.keyExchangeService.decryptMessage(
        Uint8Array.from(req.body.oneTimeCode),
        Uint8Array.from(req.body.publicKey),
        Uint8Array.from(req.body.cipherText),
      ),
    );
    user.publicKey = req.body.publicKey;
    req.body = user;
    next();
  }
}
