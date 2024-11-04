import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import React, { useState} from 'react';
import home from './../../../assets/images/home.png';
import {handleText} from '../../../utils';
import {scale} from 'react-native-size-matters';
import CustomInput from '../../components/CustomInput/CustomInput';
import {useNavigation} from '@react-navigation/native';
import search from './../../../assets/images/search_icon.png';
import VerticalUserSearchList from '../../components/VerticalUserSearchList/VerticalUserSearchList';
import Header from '../../components/Header/Header';

const UserSearchScreen = () => {
  const [query, setQuery] = useState({
    search: '',
  });
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={home}
      style={{
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? scale(32) : scale(0),
      }}>
      <Header
        showMenu={false}
        cb={() => navigation.goBack()}
        showProfilePic={false}
        headerContainerStyle={{
          paddingBottom: scale(20),
        }}
        showText={false}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          paddingHorizontal: scale(20),
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              marginBottom: scale(10),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'end',
                marginBottom: scale(10),

                gap: 10,
              }}>
              <CustomInput
                autoFocus={true}
                imageStyles={{
                  top: '50%',
                  transform: [{translateY: -0.5 * scale(25)}],
                  width: scale(25),
                  height: scale(25),
                  aspectRatio: '1/1',
                }}
                isURL={false}
                showImage={true}
                uri={search}
                name="search"
                onChange={handleText}
                updaterFn={setQuery}
                value={query.search}
                showTitle={false}
                placeholder="Find new Friends..."
                containterStyle={{
                  flexGrow: 1,
                }}
                inputStyle={{
                  borderColor: '#FFA100',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 15,
                  paddingLeft: scale(45),
                  paddingVertical: scale(15),
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RequestASauceScreen');
              }}>
              <Text
                style={[
                  {
                    color: 'white',
                    fontSize: scale(10),
                    lineHeight: scale(13),
                    fontFamily: 'Montserrat',
                  },
                  {textDecorationLine: 'underline', fontWeight: 700},
                ]}>
                Don't see what you're looking for? Request a sauce or brand.
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <VerticalUserSearchList
              horizontal={false}
              numColumns={2}
              searchTerm={query?.search}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default UserSearchScreen;
