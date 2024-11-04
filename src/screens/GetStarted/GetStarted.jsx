import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import getStartedbackground from './../../../assets/images/getStartedbackground.png';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import saucedLogo from './../../../assets/images/saucedlogo.png';
import {useNavigation} from '@react-navigation/native';
const screenHeight = Dimensions.get('window').height;
const GetStarted = () => {
  const navigation = useNavigation();
  const handleNavigateSignin = () => {
    navigation.navigate('SocialSignIn');
  };
  const handleNavigateSignUp = () => {
    navigation.navigate('SignUp');
  };
  return (
    <ImageBackground source={getStartedbackground} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image style={styles.logo} source={saucedLogo} />
          <Text style={styles.titleText}>
            Discover your perfect flavor with our extensive sauce collection.
          </Text>

          <View
            style={{
              gap: scale(15),
            }}>
            <CustomButtom
              buttonTextStyle={{fontSize: scale(14)}} // example fontSize scaling
              buttonstyle={styles.buttonStyle}
              onPress={() => {
                handleNavigateSignUp();
              }}
              title={'Sign Up'}
            />
            <CustomButtom
              buttonTextStyle={{fontSize: scale(14)}} // example fontSize scaling
              buttonstyle={styles.buttonStyle}
              onPress={() => {
                handleNavigateSignin();
              }}
              title={'Sign In'}
            />
            <Text style={styles.secondaryTitle}>
              Discover your perfect flavor with our extensive sauce collection.
            </Text>
          </View>
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
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    // paddingHorizontal: scale(20),
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(20),
    // paddingHorizontal:scale(20)
  },
  logo: {
    width: scale(130),
    height: scale(130),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    flexGrow: 1,
    gap: scale(20),
    justifyContent: 'flex-end',
    paddingBottom: scale(40),
    paddingHorizontal: scale(20),
  },
  titleText: {
    textAlign: 'center',
    color: 'white',
    fontSize: scale(25),
    lineHeight: scale(30),
  },
  secondaryTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: scale(14),
    lineHeight: scale(30),
  },
  buttonStyle: {
    width: '100%',
    borderColor: '#FFA100',
    padding: scale(15),
    backgroundColor: '#2E210A',
  },
});
