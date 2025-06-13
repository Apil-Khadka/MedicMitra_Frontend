import { Text, TextProps, useColorScheme } from 'react-native';
import { Colors, Typography } from '../constants/Colors';

interface ThemedTextProps extends TextProps {
  variant?: keyof typeof Typography;
  color?: keyof typeof Colors.light;
}

export default function ThemedText({
                                     style,
                                     variant = 'body1',
                                     color = 'text',
                                     ...props
                                   }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
      <Text
          style={[
            Typography[variant],
            { color: colors[color] },
            style,
          ]}
          {...props}
      />
  );
}
