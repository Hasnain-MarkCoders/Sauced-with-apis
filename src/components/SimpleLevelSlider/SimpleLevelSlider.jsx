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
const THUMB_SIZE = scale(20); // Diameter of the thumb
const LEVEL_MIN = 1;
const LEVEL_MAX = 10;
const TOTAL_LEVELS = LEVEL_MAX - LEVEL_MIN;

const SimpleLevelSlider = ({cb=()=>{}}) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH); // Actual slider width after layout
  const thumbPosition = useRef(new Animated.Value(0)).current;

  // Calculate the distance between each level
  const levelDistance = sliderWidth / TOTAL_LEVELS;

  // Update thumb position when currentLevel changes
  useEffect(() => {
    Animated.spring(thumbPosition, {
      toValue: (currentLevel - 1) * levelDistance,
      useNativeDriver: false,
      friction: 7,
    }).start();
    console.log(`Current Level: ${currentLevel}`);
  }, [currentLevel, levelDistance, thumbPosition]);

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
      onPanResponderRelease: (e, gestureState) => {
        thumbPosition.flattenOffset();
        let newPos = thumbPosition.__getValue();

        // Clamp the new position within slider bounds
        if (newPos < 0) newPos = 0;
        if (newPos > sliderWidth) newPos = sliderWidth;

        // Determine the nearest level
        const newLevel = Math.round(newPos / levelDistance) + 1;

        // Clamp the level within [LEVEL_MIN, LEVEL_MAX]
        const clampedLevel = Math.min(Math.max(newLevel, LEVEL_MIN), LEVEL_MAX);

        setCurrentLevel(clampedLevel);
    cb(clampedLevel)

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
              transform: [{ translateX: thumbPosition }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Circle size={THUMB_SIZE} color="#FFA500" fill={"#FFA500"}/>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Fill the parent container
    width: '100%',
    position:"relative"
  },
  sliderLineContainer: {
    width: "100%",
    height: THUMB_SIZE,
    justifyContent: 'center',
    position:"relative"
  },
  sliderLine: {
    position: 'absolute',
    height: SLIDER_HEIGHT,
    width: '100%',
    borderRadius: SLIDER_HEIGHT / 2,
    backgroundColor:"#FFA500",
  },
  thumb: {
    position: 'absolute',
    // Center the thumb vertically relative to the slider line
    // top: (SLIDER_HEIGHT - THUMB_SIZE) ,
    // Initially positioned at level 1 (0)
  },
});

export default SimpleLevelSlider;
