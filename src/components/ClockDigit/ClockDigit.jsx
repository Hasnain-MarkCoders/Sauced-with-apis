import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { scale } from 'react-native-size-matters'

const ClockDigit = ({
    digit=0,
    digitStyles={},
    type=""

}) => {
  return (
    <View style={{
        alignItems:"center"
    }}>

    <Text style={{
        fontSize: scale(40),
        fontWeight: '800',
        color: "white",
        ...digitStyles

    }}>{digit}</Text>
    <Text style={{
        color:"white"
    }}>
        {type}
    </Text>
    </View>
  )
}

export default memo(ClockDigit)

const styles = StyleSheet.create({})