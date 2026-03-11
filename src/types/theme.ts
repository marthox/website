export interface SiteTheme {
    // Base palette
    colorBg?:         string;
    colorSurface?:    string;
    colorBorder?:     string;
    colorText?:       string;
    colorTextMuted?:  string;
    colorAccent?:     string;

    // Dark section variant
    colorDarkBg?:     string;
    colorDarkText?:   string;

    // Accent section variant
    colorAccentBg?:   string;
    colorAccentText?: string;

    // Typography
    fontHeading?: string;
    fontBody?:    string;
}
