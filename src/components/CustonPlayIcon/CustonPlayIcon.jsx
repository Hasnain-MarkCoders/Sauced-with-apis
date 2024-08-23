import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustonPlayIcon = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerTriangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#FFA100',
    justifyContent: 'center', // This replaces 'placeContent: "center"'
    alignItems: 'center',
    transform: [{ translateX: -35 }, { translateY: -35 }], // Calculated half of width and height
  },
  innerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 18,
    borderBottomColor: 'white',
    transform: [{ rotate: '90deg' }],
    marginLeft: 5,
  }
});

export default CustonPlayIcon;
