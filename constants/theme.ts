/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// CareNet Brand Colors
const primaryColor = '#E62117'; // Red from the logo
const primaryHoverColor = '#C41C13';

export const Colors = {
  // Brand colors
  primary: primaryColor,
  primaryHover: primaryHoverColor,
  
  light: {
    text: '#1F2937',
    textMuted: '#6B7280',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
    border: '#E5E7EB',
    redLight: '#FEE2E2', // red-100
    redLighter: '#FEF2F2', // red-50
  },
  dark: {
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
    background: '#18181B',
    surface: '#27272A',
    tint: primaryColor,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColor,
    border: '#3F3F46',
    redLight: 'rgba(127, 29, 29, 0.2)', // red-900/20
    redLighter: 'rgba(127, 29, 29, 0.1)', // red-900/10
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
