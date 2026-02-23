import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  role: 'student' | 'educator';
  points?: number;
  level?: number;
  streak?: number;
  educatorId?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: { type: String },
  role: { type: String, enum: ['student', 'educator'], required: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  educatorId: { type: String },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
