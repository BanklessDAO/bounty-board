import mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	customizations: {
		type: Object,
		logo: String,
		colors: Object,
	},
});

export default mongoose.models.Customer ||
  mongoose.model('Customer', CustomerSchema);
