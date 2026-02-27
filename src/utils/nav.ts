import type { NavElement, NavBrand, NavMenu, Distribution } from "@/types/nav";

export function isNavMenu(item: NavElement): item is NavMenu {
    return 'submenu' in item;
}

export function isNavBrand(item: NavElement): item is NavBrand {
    return 'src' in item;
}

export function getOrderFromDistribution(distribution: Distribution | undefined): number {
    if (!distribution) return 0;
    switch (distribution) {
        case "center":
            return 0;
        case "left":
            return -1;
        case "right":
            return 1;
        default:
            return 0;
    }
}

export function injectBrandElement(injectionIndex: number, brandElement: NavBrand | undefined, navElements: NavElement[]): NavElement[] {
    return brandElement
        ? [...navElements.slice(0, injectionIndex), brandElement, ...navElements.slice(injectionIndex)]
        : navElements;
}