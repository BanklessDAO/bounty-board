import { ObjectId } from 'mongoose';
export interface CustomerProps {
    _id?: ObjectId;
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
