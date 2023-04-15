import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop()
  scratched: Date;

  @Prop()
  winner: boolean;

  @Prop()
  user?: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
