import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, ImageBackground, Vibration } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import getStartedbackground from './../../../assets/images/getStartedbackground.png';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import saucedLogo from "./../../../assets/images/saucedlogo.png"
import { useNavigation } from '@react-navigation/native';
const GetStarted = () => {
  const navigation = useNavigation()
  const handleNavigateSignin = ()=>{
    navigation.navigate('SocialSignIn')
  }
  const handleNavigateSignUp = ()=>{
    navigation.navigate('SignUp')
  }
  return (
    <ImageBackground source={getStartedbackground} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={saucedLogo}/>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>
            Discover your perfect flavor with our extensive sauce collection.
          </Text>
          <CustomButtom
            buttonTextStyle={{ fontSize: moderateScale(16) }}  // example fontSize scaling
            buttonstyle={styles.buttonStyle}
            onPress={() =>{ handleNavigateSignUp();  Vibration.vibrate(10)}}
            title={"Sign Up"}
          />
           <CustomButtom
            buttonTextStyle={{ fontSize: moderateScale(16) }}  // example fontSize scaling
            buttonstyle={styles.buttonStyle}
            onPress={() => {handleNavigateSignin(); Vibration.vibrate(10)}}
            title={"Sign In"}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>  
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode:"contain"
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(80),
    paddingBottom: verticalScale(100),
    justifyContent: "flex-end",
    alignItems: "center",
    gap: verticalScale(20),
  },
  logo: {
    width: scale(130),
    height: scale(130),
    resizeMode:"contain"
  },
  contentContainer: {
    width: "100%",
    gap: scale(40),
  },
  titleText: {
    textAlign: "center",
    color: "white",
    fontSize: moderateScale(30),
    lineHeight: verticalScale(30),
  },
  buttonStyle: {
    width: "100%",
    borderColor: "#FFA100",
    padding: moderateScale(15),
    backgroundColor: "#2E210A",
  },
});
