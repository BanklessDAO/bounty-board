import mongoose from 'mongoose';
import { array, object, string } from 'yup';
import { Role } from '@app/types/Role';

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
}).noUnknown(true);

export const CustomizationSchema = object({
	logo: string().optional(),
	colors: ColorSchema,
}).noUnknown(true);

export const CustomExternalRoleMapSchema = object({
	externalRole: string().defined(),
	roles: array().of(string()).defined(),
}).noUnknown(true);

export const ExternalRoleMapSchema = object({
	baseExternalRoles: array().of(string()).optional(),
	adminExternalRoles: array().of(string()).optional(),
	customExternalRoleMap: array().of(CustomExternalRoleMapSchema).optional(),
}).noUnknown(true);

export const CustomerSchema = object({
	customerId: string().defined(),
	customerName: string().defined(),
	customerKey: string().defined(),
	bountyChannel: string().defined(),
	customization: CustomizationSchema.optional().default(undefined),
	externalRoleMap: ExternalRoleMapSchema.optional().default(undefined),
}).noUnknown(true);

export interface CustomerProps {
  _id?: string;
  customerId: string;
  customerKey: string;
  customerName: string;
  customization?: Customization;
  bountyChannel: string;
  externalRoleMap?: ExternalRoleMap;
}
export interface ExternalRoleMap {
  baseExternalRoles?: string[];
  adminExternalRoles?: string[];
  customExternalRoleMap?: CustomExternalRoleMap[];
}
export interface CustomExternalRoleMap {
  externalRole: string;
  roles: Role[];
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

export const CustomizationModel = new mongoose.Schema<Customization>(
	{
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
	},
	{ strict: false }
);

export const ExternalRoleMapModel = new mongoose.Schema<ExternalRoleMap>({
	baseExternalRoles: {
		type: [String],
		required: false,
	},
	adminExternalRoles: {
		type: [String],
	},
	customExternalRoleMap: [
		{
			externalRole: String,
			roles: [String],
		},
	],
});

export const CustomerModel = new mongoose.Schema<CustomerProps>({
	customerName: {
		type: String,
	},
	customerId: {
		type: String,
	},
	customerKey: {
		type: String,
	},
	customization: CustomizationModel,
	bountyChannel: {
		type: String,
	},
	externalRoleMap: ExternalRoleMapModel,
});

export default (mongoose.models.Customer as mongoose.Model<CustomerProps>) ||
  mongoose.model<CustomerProps>('Customer', CustomerModel);
