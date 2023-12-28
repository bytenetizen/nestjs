import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IpRangeDocument = HydratedDocument<IpRange>;

@Schema()
export class IpRange {
  @Prop({ type: 'string', index: true, unique: true })
  start_ip: string;

  @Prop({ type: 'string', index: true, unique: true })
  end_ip: string;

  @Prop({ type: 'string', length: 255 })
  comment: string;

  @Prop({ default: 1, index: true })
  status: number;
}

export const IpRangeSchema = SchemaFactory.createForClass(IpRange);
