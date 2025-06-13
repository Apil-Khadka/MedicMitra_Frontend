/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2563eb'; // Modern blue
const tintColorDark = '#60a5fa'; // Lighter blue for dark mode

export const Colors = {
  light: {
    primary: '#2563eb', // Main brand color
    primaryLight: '#60a5fa', // Lighter shade for hover states
    secondary: '#64748b', // Secondary text and icons
    accent: '#f59e0b', // Accent color for CTAs
    success: '#22c55e', // Success states
    error: '#ef4444', // Error states
    warning: '#f59e0b', // Warning states
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    border: '#e2e8f0',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    inputBackground: '#ffffff',
    inputBorder: '#e2e8f0',
    inputFocus: '#2563eb',
    buttonPrimary: '#2563eb',
    buttonSecondary: '#f1f5f9',
    buttonText: '#ffffff',
    buttonTextSecondary: '#1e293b',
  },
  dark: {
    primary: '#60a5fa',
    primaryLight: '#93c5fd',
    secondary: '#94a3b8',
    accent: '#fbbf24',
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    card: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    border: '#334155',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    inputBackground: '#1e293b',
    inputBorder: '#334155',
    inputFocus: '#60a5fa',
    buttonPrimary: '#60a5fa',
    buttonSecondary: '#334155',
    buttonText: '#ffffff',
    buttonTextSecondary: '#f8fafc',
  },
};

// Typography scale
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadow styles
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
