import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'

const CustomButtom = ({
    showIcon=false,
    title="",
    buttonstyle={},
    buttonTextStyle={},
    onPress=()=>{},
    Icon=()=>null,
    loading=false,
    disabled=false
}) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
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

export default memo(CustomButtom)

const styles = StyleSheet.create({})