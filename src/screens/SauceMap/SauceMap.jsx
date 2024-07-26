import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps';
const SauceMap = () => {
  return (
    <View style={{
        flex:1,
        backgroundColor:"red"
    }}>
      <MapView
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
    </View>
  )
}

export default SauceMap

const styles = StyleSheet.create({})