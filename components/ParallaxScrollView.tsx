import { StyleSheet, View, ViewStyle, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors, Spacing } from '../constants/Colors';

interface ParallaxScrollViewProps {
  headerHeight?: number;
  headerComponent: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ParallaxScrollView({
                                             headerHeight = 200,
                                             headerComponent,
                                             children,
                                             style,
                                           }: ParallaxScrollViewProps) {
  const { height: windowHeight } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
        scrollY.value,
        [-headerHeight, 0, headerHeight],
        [headerHeight / 2, 0, -headerHeight / 2],
        Extrapolate.CLAMP
    );

    const scale = interpolate(
        scrollY.value,
        [-headerHeight, 0, headerHeight],
        [1.5, 1, 0.8],
        Extrapolate.CLAMP
    );

    const opacity = interpolate(
        scrollY.value,
        [0, headerHeight / 2],
        [1, 0],
        Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
        scrollY.value,
        [0, headerHeight],
        [0, -headerHeight],
        Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
      <View style={[styles.container, { backgroundColor: colors.background }, style]}>
        <Animated.View style={[styles.header, { height: headerHeight }, headerAnimatedStyle]}>
          {headerComponent}
        </Animated.View>

        <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: headerHeight }
            ]}
        >
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {children}
          </Animated.View>
        </Animated.ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
});
