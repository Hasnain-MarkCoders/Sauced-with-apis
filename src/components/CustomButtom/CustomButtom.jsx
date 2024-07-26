import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButtom = ({
    showIcon=false,
    title="",
    buttonstyle={},
    buttonTextStyle={},
    onPress=()=>{},
    Icon=()=>null,
    loading=false
}) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    
    style={{
        borderWidth:1,
        padding:20, 

      elevation:5,
        borderRadius:10,
        ...buttonstyle ,


      }}>
     { loading? <ActivityIndicator size="small" color="white" />: <>
        {
          showIcon?<Icon/> :null
        }
    <Text style={{color:"white",fontSize:10,textAlign:"center", ...buttonTextStyle}}>{title}</Text>
        </>
  }
  </TouchableOpacity>
  )
}

export default CustomButtom

const styles = StyleSheet.create({})