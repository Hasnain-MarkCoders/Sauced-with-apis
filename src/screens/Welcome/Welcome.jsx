import {   View, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native';
import home from './../../../assets/images/home.png';
import WelcomeLists from '../../components/WelcomeList/WelcomeList';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import Header from '../../components/Header/Header';
import { scale } from 'react-native-size-matters';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { host } from '../../../Axios/useAxios';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
const userAuth = useSelector(state=>state.auth)
const navigation = useNavigation()
  const handleWelcome = async()=>{
      try {
        const response = await axios.post(host + "/welcome", {
          headers: {
            Authorization: `Bearer ${userAuth.token}`, // Assuming userAuth is defined and accessible
          }
        });

      } catch (error) {
        console.log("Error: ", error);
      }
  }
  return (
    <ImageBackground style={{
      flex: 1,
      width: '100%',
      height: '100%',
    }} source={home} >
      <SafeAreaView style={{
        flex: 1,
      }}>

        <ScrollView contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom:scale(150),
        }}>
          <View>
          <Header showBackButton={false}  showMenu={false} showProfilePic={false} isWelcome ={ true} title={"Welcome to"} />
            <WelcomeLists />
          </View>
         
        </ScrollView>
        <View style={{
            position:"absolute",
            width:"90%",
            left:"50%",
            transform: [{ translateX: -Dimensions.get('window').width * .45 }],
            bottom:scale(40)
          }}>

         <CustomButtom
          buttonTextStyle={{ fontSize: scale(20) }}
              buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" }}
              onPress={() =>{ handleWelcome(); navigation.navigate("Drawer")}}
              title={"Next"}
              />
          </View>


      </SafeAreaView>

    </ImageBackground>

  )
}

export default Welcome

