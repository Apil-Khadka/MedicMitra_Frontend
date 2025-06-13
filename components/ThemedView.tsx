import { View, ViewProps, useColorScheme } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/Colors';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'card' | 'input' | 'button';
  color?: keyof typeof Colors.light;
  padding?: keyof typeof Spacing;
  borderRadius?: keyof typeof BorderRadius;
  shadow?: keyof typeof Shadows;
}

export default function ThemedView({
                                     style,
                                     variant = 'default',
                                     color = 'background',
                                     padding,
                                     borderRadius,
                                     shadow,
                                     ...props
                                   }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
          ...Shadows.sm,
        };
      case 'input':
        return {
          backgroundColor: colors.inputBackground,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        };
      case 'button':
        return {
          backgroundColor: colors.buttonPrimary,
          borderRadius: BorderRadius.lg,
          padding: Spacing.md,
          ...Shadows.sm,
        };
      default:
        return {
          backgroundColor: colors[color],
        };
    }
  };

  return (
      <View
          style={[
            getVariantStyles(),
            padding && { padding: Spacing[padding] },
            borderRadius && { borderRadius: BorderRadius[borderRadius] },
            shadow && Shadows[shadow],
            style,
          ]}
          {...props}
      />
  );
}
