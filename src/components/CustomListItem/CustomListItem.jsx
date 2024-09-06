import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import dot from "./../../../assets/images/dot.png"
import { scale } from 'react-native-size-matters'
const CustomListItem = ({text, showDot=true}) => {
  return (
    <View
    style={{
      flexDirection:"row",
      gap:showDot ?scale(10):0,
      alignItems:"center",
    }}>
 
 <View>


{
  showDot&&
  <Image style={{
    display:"flex"
  }} source={dot}/>
}


 </View>
   
    <Text style={{
      color:"white",
      fontFamily:"Montserrat",
      fontSize:scale(12),
      fontWeight:'700',
      lineHeight:18
    }}>
     {text}
    </Text>
    </View>
  )
}

export default CustomListItem
