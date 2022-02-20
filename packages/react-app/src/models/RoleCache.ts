import { Role } from '@app/types/Role';
import Mongoose, { Model } from 'mongoose';

export interface IRoleCache{
  sessionHash: string;
  createdAt: number;
  tte: number;
  customerId: string;
  roles: Role[];
}

export const RoleSchema = new Mongoose.Schema({
	sessionHash: String,
	createdAt: Number,
	tte: Number,
	customerId: String,
	roles: Array,
}, {
	// Mongoose may not accept new fields for previously defined db  
	strict: false,
});

export default Mongoose.models.RoleCache as Model<IRoleCache>
|| Mongoose.model<IRoleCache>('RoleCache', RoleSchema);