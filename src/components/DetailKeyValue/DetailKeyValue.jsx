import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters'

const DetailKeyValue = ({
    Key="",
    value="",
    style={}
}) => {
  return (
    <View style={{
        flexDirection:"row",
        flexWrap:"wrap",
        gap:scale(10)
    }}>

{Key&& <Text style={{
            color:"#FFA100",
            fontSize:scale(15),
            fontWeight:700,
            ...style
        }}>
        {Key}
        </Text>}
        <Text style={{
            color:"white",
            fontSize:scale(15),
            fontWeight:700,
            ...style
        }}>
          {value}
        </Text>

    </View>
  )
}

export default DetailKeyValue

const styles = StyleSheet.create({})