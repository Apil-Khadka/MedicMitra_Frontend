import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/Colors';
import ThemedText from './ThemedText';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  style?: ViewStyle;
}

export default function Collapsible({
                                      title,
                                      children,
                                      initiallyExpanded = false,
                                      style
                                    }: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const rotation = useSharedValue(initiallyExpanded ? 180 : 0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withSpring(isExpanded ? 0 : 180);
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
      <Animated.View
          layout={Layout.springify()}
          style={[
            styles.container,
            { backgroundColor: colors.card },
            style
          ]}
      >
        <TouchableOpacity
            style={styles.header}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
          <ThemedText variant="h3" color="text">
            {title}
          </ThemedText>
          <Animated.View style={animatedIconStyle}>
            <Ionicons
                name="chevron-down"
                size={24}
                color={colors.text}
            />
          </Animated.View>
        </TouchableOpacity>

        {isExpanded && (
            <Animated.View
                entering={FadeInDown.duration(300).springify()}
                exiting={FadeOutUp.duration(200)}
                style={styles.content}
            >
              {children}
            </Animated.View>
        )}
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
});
