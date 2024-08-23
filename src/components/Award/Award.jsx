import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { scale } from 'react-native-size-matters'
import CustomProgress from '../CustomProgress/CustomProgress'

const Award = ({url="", percentage, name}) => {
  return (
    <View style={{
        flexBasis:"48%",
        borderRadius:scale(10),
        borderColor:"#FFA100",
        borderWidth:1,
        alignItems:"center",
        gap:scale(20),
        justifyContent:"space-between",
        paddingVertical:scale(20),
        margin:scale(4),
    }}>
      <Text style={{
        color:"white",
        fontSize:scale(16)
      }}>Badge</Text>
     { url ? <Image style={{
        width:scale(80),
        height:scale(80),
        borderRadius:scale(50),

      }}
      source={{uri:url}}
      
      ></Image> :<View style={{
        width:scale(80),
        height:scale(80),
        borderRadius:scale(80),
        backgroundColor:"#FFA100"

      }}>

      </View>}
      <CustomProgress  percentage={percentage} name={name}/>
  
    </View>
  )
}

export default Award

const styles = StyleSheet.create({})