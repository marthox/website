export type Distribution = 'start' | 'center' | 'end';

export type Alignment = 'left' | 'center' | 'right';

export type MobileAlignment = "left" | "right";

export interface NavLink {
    label: string;
    href: string;
}

export interface NavMenu {
    label: string;
    submenu: NavElement[];
}

export interface NavBrand extends NavLink {
    src: string;
    alt: string;
}

export type NavElement = NavLink | NavMenu | NavBrand;
