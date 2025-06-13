import { StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/Colors';
import ThemedText from './ThemedText';

interface HelloWaveProps {
  name?: string;
  style?: ViewStyle;
}

export default function HelloWave({ name, style }: HelloWaveProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
      <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={[
            styles.container,
            { backgroundColor: colors.card },
            style
          ]}
      >
        <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={styles.content}
        >
          <ThemedText variant="h1" color="text">
            👋 {name ? `Hello, ${name}!` : 'Hello!'}
          </ThemedText>
          <ThemedText variant="body2" color="textSecondary" style={styles.subtitle}>
            Welcome to MedicMitra
          </ThemedText>
        </Animated.View>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  content: {
    gap: Spacing.xs,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});
