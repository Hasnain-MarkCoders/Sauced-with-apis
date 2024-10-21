// SimpleLevelSlider.js

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Circle } from 'lucide-react-native';
import { scale } from 'react-native-size-matters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDER_WIDTH = SCREEN_WIDTH * 0.8; // 80% of screen width
const SLIDER_HEIGHT = 4; // Thickness of the slider line
const THUMB_SIZE = scale(25); // Diameter of the thumb
const LEVEL_MIN = 5; // Updated minimum level
const LEVEL_MAX = 10;
const TOTAL_LEVELS = LEVEL_MAX - LEVEL_MIN; // Updated total levels

const SimpleLevelSlider = ({ cb = () => {} }) => {
  const [currentLevel, setCurrentLevel] = useState(LEVEL_MIN); // Start at level 5
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH); // Actual slider width after layout
  const thumbPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Calculate the maximum thumb position
    const maxThumbPosition = sliderWidth - THUMB_SIZE;
    const levelDistance = maxThumbPosition / TOTAL_LEVELS;

    // Update thumb position when currentLevel changes
    Animated.spring(thumbPosition, {
      toValue: (currentLevel - LEVEL_MIN) * levelDistance,
      useNativeDriver: false,
      friction: 7,
    }).start();
    console.log(`Current Level: ${currentLevel}`);
  }, [currentLevel, sliderWidth, thumbPosition]);

  // PanResponder to handle drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        thumbPosition.setOffset(thumbPosition.__getValue());
        thumbPosition.setValue(0);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: thumbPosition }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        thumbPosition.flattenOffset();
        let newPos = thumbPosition.__getValue();

        const maxThumbPosition = sliderWidth - THUMB_SIZE;

        // Clamp the new position within slider bounds
        if (newPos < 0) newPos = 0;
        if (newPos > maxThumbPosition) newPos = maxThumbPosition;

        const levelDistance = maxThumbPosition / TOTAL_LEVELS;

        // Determine the nearest level
        const newLevel = Math.round(newPos / levelDistance) + LEVEL_MIN;

        // Clamp the level within [LEVEL_MIN, LEVEL_MAX]
        const clampedLevel = Math.min(Math.max(newLevel, LEVEL_MIN), LEVEL_MAX);

        setCurrentLevel(clampedLevel);
        cb(clampedLevel);

        // Animate thumb to the exact position of the level
        Animated.spring(thumbPosition, {
          toValue: (clampedLevel - LEVEL_MIN) * levelDistance,
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Slider Line */}
      <View
        style={styles.sliderLineContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
      >
        <View style={styles.sliderLine} />
        {/* Draggable Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              left: thumbPosition,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Circle size={THUMB_SIZE} color="#FFA500" fill={"#FFA500"} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Fill the parent container
    width: '100%',
  },
  sliderLineContainer: {
    width: "100%",
    height: THUMB_SIZE,
    justifyContent: 'center',
    position: "relative", // Make parent position relative
  },
  sliderLine: {
    position: 'absolute',
    height: SLIDER_HEIGHT,
    width: '100%',
    borderRadius: SLIDER_HEIGHT / 2,
    backgroundColor: "#FFA500",
  },
  thumb: {
    position: 'absolute', // Position thumb absolutely within parent
    // top: (THUMB_SIZE - SLIDER_HEIGHT) / 2 * -1, // Center the thumb vertically over the slider line
    top:"0%",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SimpleLevelSlider;
