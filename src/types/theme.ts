export interface SiteTheme {
    // Base palette
    colorBg?:         string;
    colorSurface?:    string;
    colorBorder?:     string;
    colorText?:       string;
    colorTextMuted?:  string;
    colorAccent?:     string;

    // Dark section variant (existing)
    colorDarkBg?:     string;
    colorDarkText?:   string;

    // Dark section variant — new extended fields
    colorDarkSurface?:   string;   // default #0D1525
    colorDarkBorder?:    string;   // default #1E2D45
    colorDarkTextMuted?: string;   // default #8892B0
    colorDarkAccent?:    string;   // default #00CFFF

    // Accent section variant (kept for adapter compatibility — not used by Digital Hub)
    colorAccentBg?:   string;
    colorAccentText?: string;

    // Typography
    fontHeading?: string;
    fontBody?:    string;
}
