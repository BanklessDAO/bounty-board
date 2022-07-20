import { SchemaToInterface } from '@app/types/Models';
import mongoose from 'mongoose';
import { object, string } from 'yup';


export interface SavedUserQueryProps {
	_id?: string;
	customerId: string;
	discordId: string;
	savedQuery: string;
	name: string;
	createdAt: Date;
}

export const SavedUserQuerySchema = object({
	customerId: string().required(),
	discordId: string().required(),
	savedQuery: string().required(),
	name: string().required(),
});

export type SaveQueryType = SchemaToInterface<typeof SavedUserQuerySchema>;

export const SavedUserQuery = new mongoose.Schema<SavedUserQueryProps>({
	customerId: {
		type: String,
	},
	discordId: {
		type: String,
	},
	savedQuery: {
		type: String,
	},
	name: {
		type: String,
	},
	createdAt: {
		type: Date,
	},
});

export default mongoose.models.SavedUserQuery as mongoose.Model<SavedUserQueryProps>
	|| mongoose.model<SavedUserQueryProps>('SavedUserQuery', SavedUserQuery);
