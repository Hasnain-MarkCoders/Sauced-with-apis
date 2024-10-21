import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import getStartedbackground from './../../../assets/images/ProductDescription.jpg';
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header/Header';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
const YoutubeScreen = () => {
  const route = useRoute()
  const videoId = route?.params?.videoId
  const navigation = useNavigation()
  const [initialLoading, setInitialLoading] = useState(true)

  // if (initialLoading) {
  //   return (
  //     <ImageBackground source={getStartedbackground} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#FFA100" />
  //     </ImageBackground>
  //   );
  // }
  
  return (
 

    <ImageBackground style={{
      flex:1,
      position:"relative"
    }} source={getStartedbackground} >
      <Header showMenu={false} cb={()=>{navigation.goBack()}} showProfilePic={false} showText={false}/>
      <SafeAreaView style={{
      flex:1,
      justifyContent: 'center', alignItems: 'center'

  
    }}>
      {initialLoading && 
        <ActivityIndicator style={{marginTop:scale(200)}} size="large" color="#FFA100" />
       }
        
        <YoutubePlayer
       webViewStyle={{
        display:initialLoading ?"none":"flex"
       }}
      
          onReady={() => setInitialLoading(false)}
          height={300}
          width={"100%"}
          videoId={videoId}
          // play={!initialLoading} // Ensures the video plays only when loading is done
        />
    </SafeAreaView>

  </ImageBackground>
  )
}

export default YoutubeScreen

const styles = StyleSheet.create({})