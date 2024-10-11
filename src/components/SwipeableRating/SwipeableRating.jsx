import React, { useState, useMemo, useCallback } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

const SwipeableRating = ({ maxRating = 5, initialRating = 1, size = 50, color = '#FFA100', emptyColor = 'transparent', gap = 10, cb=()=>{} }) => {
  const [rating, setRating] = useState(initialRating);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const position = gestureState.moveX - gap * maxRating / 2;
      const newRating = Math.max(0.5, Math.min(maxRating, Math.round(position / (size + gap) * 2) / 2)); // Half-star precision
      if (newRating !== rating && newRating >= 0 && newRating <= maxRating) {
        setRating(newRating);
        cb(newRating?.toString())
      }
    },
    onPanResponderRelease: () => {
      console.log(`New Rating: ${rating}`);
    },
  }), [rating, maxRating, size, gap]);

  const ratingItems = useCallback(() => {
    return Array.from({ length: maxRating }, (_, index) => {
      const isHalfFilled = rating - index === 0.5;
      const isFilled = rating >= index + 1;

      return (
        <View key={index} style={{ marginRight: index < maxRating - 1 ? gap : 0, position: 'relative' }}>
          {/* Empty Star */}
          <Star
            width={size}
            height={size}
            color={color}
            fill={emptyColor}
          />
          {/* Half or Full Star */}
          { (isHalfFilled || isFilled) && (
            <View style={[styles.starOverlay, isHalfFilled ? { width: size / 2 } : { width: size }]}>
              <Star
                width={size}
                height={size}
                color={color}
                fill={color}
              />
            </View>
          )}
        </View>
      );
    });
  }, [rating, maxRating, size, color, emptyColor, gap]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {ratingItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
});

export default SwipeableRating;
