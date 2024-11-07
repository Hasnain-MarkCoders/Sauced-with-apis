import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

const SwipeableRating = ({
  maxRating = 5,
  initialRating = 1,
  size = 50,
  color = '#FFA100',
  emptyColor = 'transparent',
  gap = 10,
  cb = () => {},
  disabled=false
}) => {
  const [rating, setRating] = useState(initialRating);
  const containerRef = useRef(null);
  const containerX = useRef(0);

  // Measure the container's position on the screen
  const onLayout = () => {
    containerRef.current.measure((x, y, width, height, pageX, pageY) => {
      containerX.current = pageX;
    });
  };

  const calculateRatingFromPosition = (pageX) => {
    const x = pageX - containerX.current; // Position relative to container
    const starWidthWithGap = size + gap;
    const totalWidth = maxRating * starWidthWithGap - gap; // Total width without the last gap

    // Clamp x to the valid range
    const clampedX = Math.max(0, Math.min(x, totalWidth));

    // Determine which star the x position falls into
    const starIndex = Math.floor(clampedX / starWidthWithGap);
    const positionInStar = clampedX - starIndex * starWidthWithGap;

    let newRating = 0;

    if (positionInStar <= size / 2) {
      newRating = starIndex + 0.5;
    } else if (positionInStar <= size) {
      newRating = starIndex + 1;
    } else {
      // Tapping in the gap area
      newRating = starIndex + 1; // Fill the next half or full star
    }

    // Clamp the rating to the maximum allowed
    newRating = Math.min(newRating, maxRating);

    return newRating;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const pageX = event.nativeEvent.pageX;
          const newRating = calculateRatingFromPosition(pageX);
          if (newRating !== rating) {
            setRating(newRating);
            cb(newRating.toString());
          }
        },
        onPanResponderMove: (event) => {
          const pageX = event.nativeEvent.pageX;
          const newRating = calculateRatingFromPosition(pageX);
          if (newRating !== rating) {
            setRating(newRating);
            cb(newRating.toString());
          }
        },
        onPanResponderRelease: () => {
          console.log(`New Rating: ${rating}`);
        },
      }),
    [rating, maxRating, size, gap]
  );

  const ratingItems = useCallback(() => {
    return Array.from({ length: maxRating }, (_, index) => {
      const isHalfFilled = rating - index === 0.5;
      const isFilled = rating >= index + 1;

      return (
        <View
          key={index}
          style={{
            marginRight: index < maxRating - 1 ? gap : 0,
            position: 'relative',
          }}
        >
          {/* Empty Star */}
          <Star width={size} height={size} color={color} fill={emptyColor} />
          {/* Half or Full Star */}
          {(isHalfFilled || isFilled) && (
            <View
              style={[
                styles.starOverlay,
                isHalfFilled ? { width: size / 2 } : { width: size },
              ]}
            >
              <Star width={size} height={size} color={color} fill={color} />
            </View>
          )}
        </View>
      );
    });
  }, [rating, maxRating, size, color, emptyColor, gap]);

  return (
    <View
      style={styles.container}
      ref={containerRef}
      onLayout={onLayout}
      {...(disabled? {}:panResponder.panHandlers)}
    >
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
