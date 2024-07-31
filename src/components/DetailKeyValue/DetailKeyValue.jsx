import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters'

const DetailKeyValue = ({
    Key="",
    value=""
}) => {
  return (
    <View style={{
        flexDirection:"row",
        flexWrap:"wrap",
        gap:scale(10)
    }}>

<Text style={{
            color:"#FFA100",
            fontSize:scale(15),
            fontWeight:700,
        }}>
        {Key}
        </Text>
        <Text style={{
            color:"white",
            fontSize:scale(15),
            fontWeight:700,
        }}>
          {value}
        </Text>

    </View>
  )
}

export default DetailKeyValue

const styles = StyleSheet.create({})