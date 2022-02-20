import mongoose from 'mongoose';
import { array, object, string } from 'yup';

export const ColorSchema = object({
	background: object({
		light: string().optional(),
		dark: string().optional(),
	}).noUnknown(true),
	'In-Review': string().optional(),
	'In-Progress': string().optional(),
	Open: string().optional(),
	Completed: string().optional(),
	Done: string().optional(),
	Deleted: string().optional(),
	Draft: string().optional(),
	primary: string().optional(),
})
	.noUnknown(true);

export const CustomizationSchema = object({
	logo: string().optional(),
	colors: ColorSchema,
})
	.noUnknown(true);

export const CustomerSchema = object({
	customerId: string().defined(),
	customerName: string().defined(),
	bountyChannel: string().defined(),
	customization: CustomizationSchema.optional().default(undefined),
	applicableRoles: array(string()).optional(),
})
	.noUnknown(true);
export interface CustomerProps {
	_id?: string;
    customerId: string;
    customerName: string;
    customization?: Customization;
    applicableRoles?: [] | string[];
		bountyChannel: string;
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

export const CustomizationModel = new mongoose.Schema<Customization>({
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

export const CustomerModel = new mongoose.Schema<CustomerProps>({
	customerName: {
		type: String,
	},
	customerId: {
		type: String,
	},
	applicableRoles: {
		type: [String],
	},
	customization: CustomizationModel,
	bountyChannel: {
		type: String,
	},
});

export default mongoose.models.Customer as mongoose.Model<CustomerProps>
	|| mongoose.model<CustomerProps>('Customer', CustomerModel);
