import mongoose from 'mongoose';
import { CustomerProps } from '../types/Customer';

export const CustomerSchema = new mongoose.Schema({
	CustomerName: {
		type: String,
	},
	Customization: {
		type: Object,
		Logo: String,
		Colors: Object,
	},
});

export default mongoose.models.Customer ||
  mongoose.model<CustomerProps>('Customer', CustomerSchema);
