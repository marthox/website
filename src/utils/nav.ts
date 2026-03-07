import type { NavElement, NavBrand, NavMenu, Distribution } from "@/types/nav";

export function isNavMenu(item: NavElement): item is NavMenu {
    return 'submenu' in item;
}

export function isNavBrand(item: NavElement): item is NavBrand {
    return 'src' in item;
}

export function getOrderFromDistribution(distribution: Distribution | undefined): number {
    switch (distribution) {
        case "center":
            return 0;
        case "start":
            return -1;
        case "end":
            return 1;
        default:
            return 0;
    }
}

export function injectBrandElement(brandElement: NavBrand | undefined, navElements: NavElement[]): NavElement[] {
    let injectionIndex = Math.ceil(navElements.length / 2);

    return brandElement
        ? [...navElements.slice(0, injectionIndex), brandElement, ...navElements.slice(injectionIndex)]
        : navElements;
}