declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';

    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: number | string;
        strokeWidth?: number | string;
        absoluteStrokeWidth?: boolean;
    }

    export type Icon = FC<IconProps>;

    export const ArrowRight: Icon;
    export const Download: Icon;
    export const Users: Icon;
    export const CreditCard: Icon;
    export const Mail: Icon;
    export const Lock: Icon;
    export const Phone: Icon;
    export const User: Icon;
    export const Copy: Icon;
    export const CheckCircle: Icon;
}