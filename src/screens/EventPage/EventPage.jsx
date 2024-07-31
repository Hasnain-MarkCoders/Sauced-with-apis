import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Keyboard,
  ActivityIndicator,
  Vibration,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useEffect, useState, useRef} from 'react';
import Header from '../../components/Header/Header.jsx';
import getStartedbackground from './../../../assets/images/EventDetailBG.png';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY} from '@env';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import {topRatedSauces} from '../../../utils.js';
import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import {useRoute} from '@react-navigation/native';
import CustomSelectListModal from '../../components/CustomSelectListModal/CustomSelectListModal.jsx';
import Snackbar from 'react-native-snackbar';
import CommentsList from '../../components/CommentsList/CommentsList.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import arrow from './../../../assets/images/arrow.png';
import CustomTimer from '../../components/CustomTimer/CustomTimer.jsx';
import Location from './../../../assets/images/locationIcon.png';
import calender from './../../../assets/images/calender.png';
import destination from './../../../assets/images/destination.png';
import UserDetailsModal from '../../components/UserDetailsModal/UserDetailsModal.jsx';
import emma from "./../../../assets/images/friend2.png"
const EventPage = () => {
  const route = useRoute();
  // const { url = "", title = "" } = route?.params
  // const url
  let url,
    title = '';
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isKeyBoard, setIsKeyBoard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const [isEnabled, setisEnabled] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyBoard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyBoard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const res = await axios.get(`${UNSPLASH_URL}/photos`, {
          params: {
            client_id: VITE_UNSPLASH_ACCESSKEY,
            page: page,
          },
        });
        if (res.data.length === 0) {
          setHasMore(false);
        } else {
          setData(prevData => [...prevData, ...res.data]);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    fetchPhotos();
  }, [page]);
  const handleLoading = (listNumber, action) => {
    if (listNumber == 1) {
      return setLoading1(action);
    }
    if (listNumber == 2) {
      return setLoading2(action);
    }
    if (listNumber == 3) {
      return setLoading3(action);
    }
  };
  addToList = listNumber => {
    handleLoading(listNumber, true);
    Snackbar.show({
      text: `sauce adding in List ${listNumber}`,
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: '#FFA100',
        onPress: () => {
          Snackbar.show({
            text: `sauce remove from List ${listNumber}`,
            duration: Snackbar.LENGTH_SHORT,
          });
        },
      },
    });
    setTimeout(() => {
      handleLoading(listNumber, false);
      setModalVisible(false);
      setisEnabled(true);
    }, 2000);
  };

  if (initialLoading) {
    return (
      <ImageBackground
        source={getStartedbackground}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }
  return (
    <ImageBackground
      style={{flex: 1, width: '100%', height: '100%'}}
      source={getStartedbackground}>
      <SafeAreaView
        style={{flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0)}}>
        <Header
          showMenu={false}
          cb={() => navigation.goBack()}
          showProfilePic={false}
          headerContainerStyle={{
            paddingBottom: scale(20),
          }}
          title={'Followers'}
          showText={false}
        />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 1, 1, 1]}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  paddingHorizontal: scale(20),
                }}>
                {index == 0 && (
                  <View
                    style={{
                      marginBottom: scale(20),
                      flex: 1,
                    }}>
                    <View
                      style={{
                        marginBottom: scale(30),
                        gap: scale(20),
                      }}>
                      <View
                        style={{
                          marginBottom: scale(30),
                        }}>
                        <CustomTimer />
                      </View>
                      <View
                        style={{
                          gap: scale(5),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: scale(28),
                              fontWeight: 800,
                              lineHeight: scale(33),
                              color: 'white',
                            }}>
                            Hot Sauce Event
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              // Linking.openURL(url)
                              // navigation.navigate("Checkin")
                            }}
                            style={{
                              paddingHorizontal: scale(10),
                              paddingVertical: scale(6),
                              backgroundColor: '#FFA100',
                              borderRadius: scale(5),
                              elevation: scale(5),
                              alignSelf: 'flex-end',
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontWeight: '700',
                              }}>
                              Interested
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: scale(5),
                          }}>
                          <Text
                            style={{
                              color: 'white',
                            }}>
                            Organized by
                          </Text>
                          <TouchableOpacity onPress={()=>{
                            setOpenUserDetailsModal(true)
                          }}>

                          <Text
                            style={{
                              color: '#FFA100',
                            }}>
                            Emma Williams
                          </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        gap: scale(25),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: scale(10),
                        }}>
                        <Image
                          style={{
                            width: scale(20),
                            height: scale(20),
                            aspectRatio: '1/1',
                          }}
                          source={calender}
                        />
                        <Text
                          style={{
                            fontSize: scale(12),
                            fontWeight: 700,
                            fontFamily: 'Montserrat',
                            color: 'white',
                            flexShrink:1
                          }}>
                          Wed July 31, 2024 at 3:00 PM - Thu, August 01, 2024 at
                          3:00 PM
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: scale(10),
                        }}>
                        <Image
                          style={{
                            width: scale(18),
                            height: scale(23),
                          }}
                          source={Location}
                        />
                        <View
                          style={{
                            gap: scale(6),
                          }}>
                          <Text
                            style={{
                              fontSize: scale(16),
                              lineHeight: scale(22),
                              color: '#FFA100',
                            }}>
                            Lorem Hall
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: scale(11),
                              lineHeight: scale(14),
                            flexShrink:1

                            }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {index == 1 && (
                  <View
                    style={{
                      marginBottom: scale(20),
                      gap: scale(20),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        lineHeight: verticalScale(29),
                        fontSize: moderateScale(24),
                        fontWeight: 600,
                        marginTop: scale(20),
                      }}>
                      Details
                    </Text>

                    <ProductsBulletsList
                      textStyles={{
                        fontWeight: 700,
                        color: 'white',
                      }}
                    />
                    <View
                      style={{
                        marginTop: scale(30),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          lineHeight: verticalScale(29),
                          fontSize: moderateScale(24),
                          fontWeight: 600,
                        }}>
                        About The Venue
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Map');
                        }}
                        style={{
                          paddingHorizontal: scale(10),
                          paddingVertical: scale(6),
                          backgroundColor: '#FFA100',
                          borderRadius: scale(5),
                          elevation: scale(5),
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: '700',
                          }}>
                          Get Destination
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        height: scale(200),
                        minWidth: scale(300),
                      }}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                        source={destination}
                      />
                    </View>
                    <View
                      style={{
                        gap: scale(6),
                      }}>
                      <Text
                        style={{
                          fontSize: scale(16),
                          lineHeight: scale(22),
                          color: '#FFA100',
                        }}>
                        15 Km distance from your home
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: scale(11),
                          lineHeight: scale(14),
                        }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
        />
        <CustomSelectListModal
          modalVisible={modalVisible}
          setModalVisible={() => {
            setModalVisible(false);
          }}
          cb={addToList}
          isEnabled={isEnabled}
          loading1={loading1}
          loading2={loading2}
          loading3={loading3}
          title1="List 1"
          title2="List 2"
          title3="List 3"
        />
      </SafeAreaView>
      <UserDetailsModal
          name= 'Emma william'
          email='Emma@gmail.com'
          prfilePicture= {emma}
        modalVisible={openUserDetailsModal}
        setModalVisible={setOpenUserDetailsModal}
      />
    </ImageBackground>
  );
};

export default EventPage;
