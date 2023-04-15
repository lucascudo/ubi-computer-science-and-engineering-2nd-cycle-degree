import { Module } from '@nestjs/common';
import { KeyExchangeService } from './key-exchange.service';

@Module({
  providers: [KeyExchangeService],
  exports: [KeyExchangeService],
})
export class KeyExchangeModule {}
