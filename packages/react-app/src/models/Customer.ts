import mongoose from 'mongoose';
export interface CustomerProps {
    customer_id: string;
    customerName: string;
    customization?: Customization;
    applicableRoles?: [] | string[];
}
export interface Customization {
    logo?: string;
    colors?: SupportedColorCustomizations;
}
export interface SupportedColorCustomizations {
    background?: LightDark;
    'In-Review'?: string;
    'In-Progress'?: string;
    Open?: string;
    Completed?: string;
    Done?: string;
    Deleted?: string;
    Draft?: string;
    primary?: string;
}
export interface LightDark {
    light: string;
    dark: string;
}

export const CustomizationSchema = new mongoose.Schema<Customization>({
	logo: String,
	colors: {
		type: Object,
		background: {
			type: Object,
			light: String,
			dark: String,
			required: false,
		},
	},
}, { strict: false });

export const CustomerSchema = new mongoose.Schema<CustomerProps>({
	customerName: {
		type: String,
	},
	customer_id: {
		type: String,
	},
	applicableRoles: {
		type: [String],
	},
	customization: CustomizationSchema,
});

export default mongoose.models.Customer as mongoose.Model<CustomerProps>
	|| mongoose.model<CustomerProps>('Customer', CustomerSchema);
