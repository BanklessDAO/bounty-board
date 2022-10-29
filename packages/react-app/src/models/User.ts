import mongoose from 'mongoose';
import { object, string } from 'yup';

export const UserSchema = object({
	userDiscordId: string().defined(),
	walletAddress: string().defined(),
}).noUnknown(true);

export interface UserProps {
  _id?: string;
  userDiscordId: string;
  walletAddress: string;
}

export const UserModel = new mongoose.Schema<UserProps>({
	userDiscordId: {
		type: String,
	},
	walletAddress: {
		type: String,
	},
}, { collection: 'user' });

export default (mongoose.models.User as mongoose.Model<UserProps>) ||
  mongoose.model<UserProps>('User', UserModel);
