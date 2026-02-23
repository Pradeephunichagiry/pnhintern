import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChallenge extends Document {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  points: number;
  deadline: string;
  badgeId?: string;
  imageUrl: string;
  imageHint: string;
  createdBy: string;
}

const ChallengeSchema: Schema<IChallenge> = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  whyItMatters: { type: String, required: true },
  points: { type: Number, required: true },
  deadline: { type: String, required: true },
  badgeId: { type: String },
  imageUrl: { type: String, required: true },
  imageHint: { type: String, required: true },
  createdBy: { type: String, required: true },
});

const Challenge: Model<IChallenge> = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);

export default Challenge;
