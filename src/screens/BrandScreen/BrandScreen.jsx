import { ImageBackground, SafeAreaView, Text, View, ActivityIndicator } from 'react-native'
import React, { memo, useEffect, useState, useRef } from 'react'
import Header from '../../components/Header/Header.jsx'
import getStartedbackground from './../../../assets/images/welcome_screen.png';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
import { useRoute } from "@react-navigation/native"

import BrandCard from '../../components/BrandCard/BrandCard.jsx';

const BrandScreen = () => {
  const route = useRoute()
  const { url = "", title = "" } = route?.params
  const brand = route?.params?.item
  const [initialLoading, setInitialLoading] = useState(true)
  const navigation = useNavigation()
  useEffect(() => {
        setTimeout(()=>{
            setInitialLoading(false)
        },1000)
  }, [brand]);


  if (initialLoading) {
    return (
      <ImageBackground source={getStartedbackground} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={getStartedbackground}>
      <SafeAreaView style={{ flex: 1, paddingBottom: verticalScale(0) }}>
        <Header
          showMenu={false}
          cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
            paddingBottom: scale(20)
          }} title={""} showText={false} />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 1, 1, 1]}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  height:"100%",
                  paddingHorizontal: scale(20),
                }}>

                {
                  index == 0 && <View style={{
                    marginBottom: scale(20),
                  }}>

                    <BrandCard
                    product={brand}
                      url={url} title={title} />
                  </View>
                }

                {
                  index == 1 && <View style={{
                    marginBottom: scale(20),
                    gap: scale(20)
                  }}>


                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: 600,
                    }}>
                      About {brand?.brand?.name}

                    </Text>
               
                     <Text style={{
      color:"white",
      fontSize:scale(12),
      fontWeight:400,
      lineHeight:18,
    }}>
  {brand?.brand?.about}
    </Text>
                  </View>
                }
                {
                  index == 2 && <View style={{
                    marginTop: scale(20),
                    // alignSelf:"flex-end",
                    marginBottom: scale(20),

                  }}>
                      <SauceList 
                      
                      endpoint='/brand-sauces'
                      _id={brand?.brand?._id} title='Recent Sauces'  />
                  </View>
                }
              </View>
            )
          }}
        />
    

    
      </SafeAreaView>
    </ImageBackground>

  )
}

export default memo(BrandScreen)
