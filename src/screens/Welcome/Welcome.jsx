import {View, SafeAreaView, ScrollView, Dimensions, Text} from 'react-native';
import React from 'react';
import {ImageBackground} from 'react-native';
import home from './../../../assets/images/welcome_screen.png';
import WelcomeLists from '../../components/WelcomeList/WelcomeList';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import Header from '../../components/Header/Header';
import {scale} from 'react-native-size-matters';
import {welcomepoints} from '../../../utils';

const Welcome = ({route, navigation}) => {
  const handleWelcome = route?.params?.handleWelcome;
  const About_US = route?.params?.About_US||false;
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      source={home}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingBottom: scale(150),
          }}>
          <View
            style={{
              gap: scale(40),
            }}>
            <View
              style={{
                gap: scale(0),
              }}>
              <Header
                descriptionStyle={{marginTop: 0}}
                headerContainerStyle={{
                  paddingHorizontal: 0,
                }}
                showBackButton={false}
                showMenu={false}
                showProfilePic={false}
                isWelcome={true}
                title={'Welcome to'}
              />

              <Text
                style={{
                  color: '#FFA100',
                  fontFamily: 'Montserrat',
                  fontSize: scale(15),
                  fontWeight: '700',
                  lineHeight: scale(25),
                }}>
                where we keep your hot sauce obsession organized, because who
                needs therapy when you have heat levels to track?
              </Text>
            </View>

            <View
              style={{
                gap: scale(20),
              }}>
              <View
                style={{
                  gap: scale(20),
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: scale(13.9),
                    fontWeight: '700',
                    lineHeight: scale(18),
                  }}>
                  Get ready to fire up your taste buds and your ego!
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: scale(12),
                    fontWeight: '700',
                    lineHeight: scale(18),
                  }}>
                  This app was designed by people, for people who well... are
                  obsessed with hot sauce.
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: scale(12),
                    fontWeight: '700',
                    lineHeight: scale(18),
                  }}>
                  The following are reasons why you should join this community:
                </Text>
              </View>

              <WelcomeLists data={welcomepoints} />
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            width: '90%',
            left: '50%',
            transform: [{translateX: -Dimensions.get('window').width * 0.45}],
            bottom: scale(40),
          }}>
         { About_US?
          <CustomButtom
          buttonTextStyle={{fontSize: scale(20)}}
          buttonstyle={{
            width: '100%',
            borderColor: '#FFA100',
            padding: 15,
            backgroundColor: '#2E210A',
          }}
          onPress={() => {
            navigation.goBack()
          }}
          title={'Go Back'}
        />

         :
         <CustomButtom
            buttonTextStyle={{fontSize: scale(20)}}
            buttonstyle={{
              width: '100%',
              borderColor: '#FFA100',
              padding: 15,
              backgroundColor: '#2E210A',
            }}
            onPress={() => {
              handleWelcome();
            }}
            title={'Get Started'}
          />}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Welcome;
