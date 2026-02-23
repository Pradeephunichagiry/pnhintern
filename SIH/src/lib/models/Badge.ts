import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  iconHint: string;
}

const BadgeSchema: Schema<IBadge> = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  iconHint: { type: String, required: true },
});

const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
