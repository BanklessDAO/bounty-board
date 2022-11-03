// Extract the string values of an object as a union of typescript string literals
export type ObjectValues<T extends Record<string, string>> = T[keyof T];
export type ObjectKeys<T extends Record<string, string>> = keyof T;
