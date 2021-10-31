import mongoose from 'mongoose';
export interface CustomerProps {
    CustomerId: string;
    CustomerName: string;
    Customization?: Customization;
    ApplicableRoles?: [] | string[];
}
export interface Customization {
    Logo?: string;
    Colors?: SupportedColorCustomizations;
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

export const CustomerSchema = new mongoose.Schema<CustomerProps>({
	CustomerName: {
		type: String,
	},
	CustomerId: {
		type: String,
	},
	Customization: {
		type: Object,
		Logo: String,
		Colors: Object,
	},
});

export default mongoose.models.Customer as mongoose.Model<CustomerProps>
	|| mongoose.model<CustomerProps>('Customer', CustomerSchema);
