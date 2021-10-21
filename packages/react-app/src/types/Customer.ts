export interface Customer {
    customerId: string;
    name: string;
    customization?: Customization;
};

export interface Customization {
    logo?: string;
    colors?: SupportedColorCustomizations;
};

export interface SupportedColorCustomizations {
    bg?: LightDark;
    'In-Review'?: string;
    'In-Progress'?: string;
    Open?: string;
    Completed?: string;
    Done?: string;
    Deleted?: string;
    Draft?: string;
    primary?: string; 
};

export interface LightDark {
    light: string;
    dark: string;
};
