import { CircleOff } from 'lucide-react-native'
import React from 'react'
import { View,Text } from 'react-native'
import { scale } from 'react-native-size-matters'

const NotFound = ({
    title=""
}) => {
  return (
    <View style={{
      alignItems:"center",
      gap:scale(20)
    }}>
        <CircleOff color="#FFA100" size={30} />
        <Text style={{
          color:"white"
        }}>
            {title?title:"Not Found "} 
        </Text>
    </View>
  )
}

export default NotFound