import type { NavElement, NavBrand, NavMenu, Distribution } from "@/types/nav";

export function isNavMenu(item: NavElement): item is NavMenu {
    return 'submenu' in item;
}

export function isNavBrand(item: NavElement): item is NavBrand {
    return 'src' in item;
}

export function getIndexFromDistribution(distribution: Distribution, length: number): number {
    switch (distribution) {
        case 'left':
            return 0;
        case 'right':
            return length;
        case 'center':
            return Math.ceil(length / 2);
    }
}

export function injectBrandElement(injectionIndex: number, brandElement: NavBrand, navElements: NavElement[]): NavElement[] {
    return [...navElements.slice(0, injectionIndex), brandElement, ...navElements.slice(injectionIndex)];
}