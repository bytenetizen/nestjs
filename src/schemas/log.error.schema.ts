import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogErrorDocument = HydratedDocument<LogError>;

@Schema()
export class LogError {
  @Prop()
  code: number;

  @Prop()
  error: string;

  @Prop()
  path: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop()
  front: string;

  @Prop()
  stack: string;
}

export const LogErrorSchema = SchemaFactory.createForClass(LogError);
