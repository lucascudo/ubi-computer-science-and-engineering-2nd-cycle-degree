import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  private isLucky(chances: number): boolean {
    return (
      Math.floor(Math.random() * chances) ===
      Math.floor(Math.random() * chances)
    );
  }

  async scratch(userId: string): Promise<any> {
    let card;
    const lastCards: Card[] = await this.cardModel
      .find({ user: userId })
      .sort({ _id: -1 })
      .limit(1);
    if (
      lastCards &&
      lastCards.length &&
      moment().isBefore(
        moment(lastCards[0].scratched).add(
          parseInt(process.env.TIMEOUT),
          'seconds',
        ),
      )
    ) {
      card = lastCards[0];
    } else {
      const createdCard = new this.cardModel({
        user: userId,
        scratched: new Date(),
        winner: this.isLucky(parseInt(process.env.CHANCES)),
      });
      await createdCard.save();
      card = createdCard;
    }
    const { _id, scratched, winner } = card;
    return {
      _id,
      scratched,
      winner,
      timeout: process.env.TIMEOUT,
    };
  }
}
