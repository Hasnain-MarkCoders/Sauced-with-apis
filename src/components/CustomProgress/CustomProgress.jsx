import { Text, View } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters'

const CustomProgress = ({
    percentage=0,
    name="",
    nameStyle={},
    progressStyle={},
    progressbarStyle={},
    percentageStyle={}

}) => {
  return (
    <View style={{ width:"80%", alignItems:"flex-end", gap:scale(5)}}>
      <Text style={{
        fontSize:scale(10),
        color:"white",
        ...percentageStyle,

      }}>
        {percentage}%
      </Text>
      <View style={{width:"100%", height:scale(2), flexDirection:"row",backgroundColor:"white", ...progressbarStyle}}>
      <View style={{
        
        flexBasis:`${percentage}%`,
        height:scale(2),
        backgroundColor:"#FFA100",
        ...progressStyle
      }}>

      </View>
    </View>
   {/* { name&& <Text style={{
      alignSelf:"center",
      color:"white",
      ...nameStyle
    }}>
        {name}
    </Text>} */}
      </View>
  )
}

export default CustomProgress
