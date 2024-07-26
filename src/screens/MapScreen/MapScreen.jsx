import { Image, ImageBackground, TouchableOpacity} from 'react-native'
import React from 'react'
import map from "./../../../assets/images/map.png"
import darkArrow from "./../../../assets/images/darkArrow.png"
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
const MapScreen = () => {
    const navigation = useNavigation()
  return (
    <ImageBackground 
    imageStyle={
        {
            resizeMode:"cover"

        }
    }
    style={{ flex: 1 , paddingLeft:scale(20), paddingTop:scale(30)}} source={map}>
        <TouchableOpacity onPress={()=>{
            navigation.goBack()
        }}>
        <Image style={{
           tintColor:"black",
        }} source={darkArrow}/>
        </TouchableOpacity>
      
    </ImageBackground>
  )
}

export default MapScreen