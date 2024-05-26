export interface Field {
    type: "text" | "password" | "select" | "textarea" | "switch" | "number" | "email";
    name: string;
    value?: any;
    options?: {
        label: string;
        value: any;
    }[];
    description?: string;
    label: string;
    placeholder?: '';
}