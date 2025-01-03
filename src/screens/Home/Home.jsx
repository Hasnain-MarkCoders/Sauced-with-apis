import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import home from './../../../assets/images/home_screen.png';
import search from './../../../assets/images/search_icon.png';
import {handleText} from '../../../utils';
import BrandList from '../../components/BrandList/BrandList';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import arrow from './../../../assets/images/arrow.png';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import CustomCarousel from '../../components/CustomCarousel/CustomCarousel';
import CustomOfficialReviewsListCarousel from '../../components/CustomOfficialReviewsListCarousel/CustomOfficialReviewsListCarousel';
import TopRatedSaucesList from '../../components/TopRatedSaucesList/TopRatedSaucesList';
import FeaturedSaucesList from '../../components/FeaturedSaucesList/FeaturedSaucesList';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import useAxios from '../../../Axios/useAxios';
import {useDispatch} from 'react-redux';
import YesNoModal from '../../components/YesNoModal/YesNoModal';
const Home = () => {
  const [refresh, setRefresh] = useState(true);
  const navigation = useNavigation();
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });
  const [yesNoModal, setYesNoModal] = useState({
    open: false,
    message: '',
    severity: 'success',
    isQuestion: false,
    cb: () => {},
  });
  const axiosInstance = useAxios();
  let watchId = useRef(null)
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState({
    search: '',
  });
  const [isloading, setLoading] = useState(false);

  const updateTokenOnServer = async newFcmToken => {
    try {
      const resposne = await axiosInstance.post('/update-token', {
        notificationToken: newFcmToken,
      });
    } catch (error) {
      console.error('Failed to update token on server:', error);
    }
  };

  React.useEffect(() => {
    // Get the initial token
    const getInitialFcmToken = async () => {
      const fcmToken = await messaging().getToken();
      await updateTokenOnServer(fcmToken); // Update token to your backend
    };
    getInitialFcmToken();
    const unsubscribe = messaging().onTokenRefresh(async newFcmToken => {
      await updateTokenOnServer(newFcmToken); // Update new token to your backend
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);



  const checkLocationServiceAndNavigate =async () => {
    setLoading(true); // Start loading indicator
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await check(permission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          setAlertModal({
            open: true,
            message: 'Location services are  N/A on this device.',
            success: false,
          });
          setLoading(false);
          break;
        case RESULTS.DENIED:
          showPermissionModal(
            'Location Permission Required. Would you like to grant permission?',
            async () => {
              const requestResult = await request(permission);
              if (requestResult === RESULTS.GRANTED) {
                fetchCurrentLocation();
              } else if (requestResult === RESULTS.BLOCKED) {
                handleBlockedPermission();
              } else {
                setLoading(false);
              }
            },
          );
          break;
        case RESULTS.LIMITED:
          // iOS only: proceed with limited access
          fetchCurrentLocation();
          break;
        case RESULTS.GRANTED:
          fetchCurrentLocation();
          break;
        case RESULTS.BLOCKED:
          handleBlockedPermission();
          break;
        default:
          setAlertModal({
            open: true,
            message:
              'An unexpected error occurred while checking location permission.',
            success: false,
          });
          setLoading(false);
          break;
      }
    } catch (error) {
      console.warn('Error checking location permission:', error);
      setAlertModal({
        open: true,
        message:
          'An error occurred while checking location permission. Please try again.',
        success: false,
      });
      setLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
  watchId.current = Geolocation.watchPosition(
      position => {
        navigation.navigate('Map', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          fn: () => {},
          showContinue: true,
        });
        setLoading(false); // Stop loading indicator
      },
      error => {
        let errorMessage = '';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permission to access location was denied.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'The request to get user location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while fetching location.';
            break;
        }
        setAlertModal({
          open: true,
          message: `Location Service Error: ${errorMessage}`,
          success: false,
        });
        setLoading(false); // Stop loading indicator
      },
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 30000},
    );
  };

  const showPermissionModal = (message, onConfirm) => {
    setYesNoModal({
      open: true,
      message: message,
      success: true,
      isQuestion: true,
      cb: onConfirm,
    });
  };

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        // Android: Open Location Settings
        const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
        await Linking.sendIntent(url);
      } else if (Platform.OS === 'ios') {
        // iOS: Open App Settings
        const url = 'app-settings:';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open settings');
        }
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert('Error', 'Unable to open settings');
    }
  };

  const handleBlockedPermission = () => {
    Alert.alert(
      'Location Permission Blocked',
      'Please enable location permission in your device settings to use this feature.',
      [
        {text: 'Cancel', style: 'cancel', onPress: () => setLoading(false)},
        {
          text: 'Open Settings',
          onPress: () => {
            openLocationSettings();
            setLoading(false);
          },
        },
      ],
    );
  };


  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
  });

  useEffect(() => {
    try {
      async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          getFcmToken();
        }
      }

      const getFcmToken = async () => {
        const token = await messaging().getToken();
      };
      requestUserPermission();
    } catch (err) {
    }
  }, []);


  useEffect(() => {
    navigation.addListener('focus', () => {
      setRefresh(true);
    });
    navigation.addListener('blur', () => {
      setRefresh(false);
    });
    return () => {
      navigation.removeListener('focus', () => {
        setRefresh(true);
      });
      navigation.removeListener('blur', () => {
        setRefresh(false);
      });
    };
  }, []);


  useFocusEffect(
    useCallback(()=>{
      if (watchId.current !==null)
        Geolocation.clearWatch(watchId.current)
    },[watchId])
  )

  if (initialLoading) {
    return (
      <ImageBackground
        source={home}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }
  return (
    <ImageBackground source={home} style={styles.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBarContainer}>
            <TouchableOpacity
                        style={{
                          width: '100%',
                        }}
                        onPress={() => {
                          navigation.navigate('Search');
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: scale(53),
                            borderRadius: scale(8),
                            borderWidth: 1,
                            borderColor: '#FFA100',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: scale(10),
                            paddingLeft: scale(10),
                          }}>
                          <Image
                            style={{
                              width: scale(27),
                              height: scale(27),
                            }}
                            source={search}
                          />
                          <Text
                            style={{
                              color: 'white',
                              fontSize: scale(13),
                            }}>
                            Search for a sauce...
                          </Text>
                        </View>
                      </TouchableOpacity>
              {/* <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Search');
                }}>
                <CustomInput
                  readOnly={true}
                  imageStyles={{
                    top: '50%',
                    transform: [{translateY: -0.5 * scale(25)}],
                    resizeMode: 'contain',
                    width: scale(25),
                    height: scale(25),
                    aspectRatio: '1/1',
                  }}
                  isURL={false}
                  showImage={true}
                  uri={search}
                  name="search"
                  onChange={handleText}
                  updaterFn={setData}
                  value={data.search}
                  showTitle={false}
                  placeholder="Search for a sauce..."
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
              </TouchableOpacity> */}
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RequestASauceScreen');
              }}>
              <Text
                style={[
                  styles.infoText,
                  {
                    textDecorationLine: 'underline',
                    fontWeight: 700,
                  },
                ]}>
                Don't see what you're looking for? Request a sauce or brand.
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: 'relative',
              gap: scale(10),
            }}>
            <Text
              style={{
                color: 'white',
                lineHeight: scale(29),
                fontSize: scale(24),
                fontWeight: '600',
              }}>
              Events
            </Text>

            <CustomCarousel showText={true} />
          </View>
          <View style={styles.contentContainer}>
            <FeaturedSaucesList refresh={refresh} title="Featured Sauces" />
            <TopRatedSaucesList
              refresh={refresh}
              title="Recently Popular Sauces"
            />
            <View
              style={{
                gap: scale(10),
              }}>
              <CustomButtom
                loading={isloading}
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: isloading ? 'center' : 'space-between',
                }}
                onPress={checkLocationServiceAndNavigate}
                title={'Find a hot sauce store near me'}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddStore');
                }}>
                <Text
                  style={[
                    styles.infoText,
                    {
                      textDecorationLine: 'underline',
                      fontWeight: 700,
                      marginLeft: scale(2),
                    },
                  ]}>
                  Want to recommend a local store?
                </Text>
              </TouchableOpacity>
            </View>

            <BrandList title="Popular Brands" />
            <View
              style={{
                gap: scale(20),
              }}>
              <Text
                style={{
                  color: 'white',
                  lineHeight: verticalScale(28.8),
                  fontSize: moderateScale(24),
                  fontWeight: '600',
                }}>
                Official Reviews
              </Text>
              <CustomOfficialReviewsListCarousel showText={false} />
            </View>

            <CustomButtom
              Icon={() => <Image source={arrow} />}
              showIcon={true}
              buttonTextStyle={{fontSize: scale(14)}}
              buttonstyle={{
                width: '100%',
                borderColor: '#FFA100',
                backgroundColor: '#2e210a',
                padding: 15,
                display: 'flex',
                gap: 10,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                navigation.navigate('RequestASauceScreen');
              }}
              title={'Suggest a sauce not listed '}
            />
          </View>
          <CustomAlertModal
            title={alertModal.message}
            modalVisible={alertModal.open}
            setModalVisible={() =>
              setAlertModal({
                open: false,
                message: '',
                success: true,
              })
            }
            success={alertModal.success}
          />

          <YesNoModal
            isQuestion={yesNoModal.isQuestion}
            modalVisible={yesNoModal.open}
            setModalVisible={() => {
              setYesNoModal({
                open: false,
                messsage: '',
                severity: true,
              });
              setLoading(false);
            }}
            success={yesNoModal.severity}
            title={'Location Request'}
            cb={yesNoModal.cb}
          />
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  safeArea: {
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(150),
    paddingHorizontal: scale(20),
    flex: 1,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  searchContainer: {
    marginBottom: verticalScale(20),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'end',
    marginBottom: verticalScale(10),
    gap: 10,
  },
  searchBar: {
    height: verticalScale(50),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#FFA100',
    flexGrow: 1,
    marginRight: scale(10),
  },
  qrImage: {
    borderRadius: moderateScale(10),
    width: scale(50),
    height: scale(50),
  },
  infoText: {
    color: 'white',
    fontSize: moderateScale(10),
    lineHeight: verticalScale(13),
    fontFamily: 'Montserrat',
  },
  contentContainer: {
    gap: verticalScale(40),
    marginTop: scale(30),
  },
  mainBanner: {
    position: 'relative',
    gap: verticalScale(10),
    marginBottom: verticalScale(50),
  },
  bannerContainer: {
    position: 'relative',
    width: '100%',
    height: verticalScale(130),
    gap: verticalScale(10),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },
  bannerTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    transform: [{translateY: -25}, {translateX: -10}],
  },
  bannerText: {
    color: 'white',
    fontSize: moderateScale(23),
    fontWeight: 'bold',
  },
});

export default Home;
