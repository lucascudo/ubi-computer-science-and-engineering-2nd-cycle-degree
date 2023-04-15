import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './card.schema';
import { CardsService } from './cards.service';

@Module({
  providers: [CardsService],
  exports: [CardsService],
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
})
export class CardsModule {}
