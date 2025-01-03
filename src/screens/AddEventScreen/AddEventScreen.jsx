import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  View,
  Keyboard,
  Alert,
  TouchableOpacity,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { handleText, isURL } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import DatePicker from 'react-native-date-picker';
import arrow from './../../../assets/images/arrow.png';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';
import { useSelector } from 'react-redux';

const AddEventScreen = () => {
  const [isKeyBoard, setIsKeyBoard] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [yesNoModal, setYesNoModal] = useState({
    open: false,
    message: '',
    severity: 'success',
    cb: () => { },
    isQuestion: false,
  });
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });
  const [query, setQuery] = useState({
    title: '',
    eventOrganizer: '',
    date: "",
    address: '',
    destinationDetails: '',
    coordinates: {},
    facebookLink: '',
    websiteLink: '',
    eventEndDate: "",
    isEndDate: false,
  });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);

  

  const handleEventCoords = coords => {
    setQuery(prev => ({
      ...prev,
      ['address']: coords?.destination,
      ['coordinates']: {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      },
    }));
  };

  const [isloading, setLoading] = useState(false);

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

  const checkLocationServiceAndNavigate = () => {
    setLoading(true); // Start loading indicator
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    check(permission)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          fetchCurrentLocation();
        } else if (result === RESULTS.DENIED) {
          setYesNoModal({
            open: true,
            message:
              'Location Permission Required. Would you like to grant permission?',
            success: true,
            isQuestion: true,
            cb: () => {
              request(permission).then(result => {
                if (result === RESULTS.GRANTED) {
                  fetchCurrentLocation();
                } else {
                  Alert.alert(
                    'Location Permission Blocked',
                    'Please enable location permission in your device settings to use this feature.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Open Settings',
                        onPress: () => openLocationSettings(),
                      },
                    ],
                  );
                  setLoading(false); // Stop loading indicator
                }
              });
            },
          });
        } else {
          setLoading(false); // Stop loading indicator
          setYesNoModal({
            open: true,
            message:
              'Location Permission Required. Would you like to grant permission?',
            success: true,
            isQuestion: true,
            cb: () => {
              request(permission).then(result => {
                if (result === RESULTS.GRANTED) {
                  fetchCurrentLocation();
                } else {
                  Alert.alert(
                    'Location Permission Blocked',
                    'Please enable location permission in your device settings to use this feature.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Open Settings',
                        onPress: () => openLocationSettings(),
                      },
                    ],
                  );
                  setLoading(false); // Stop loading indicator
                }
              });
            },
          });
        }
      })
      .catch(error => {
        console.warn('Error checking location permission:', error);
        // Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
        setLoading(false); // Stop loading indicator
        setAlertModal({
          open: true,
          message:
            'Error An error occurred while checking location permission. Please try again.',
          success: false,
        });
      });
  };

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        navigation.navigate('Map', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          fn: handleEventCoords,
        });
        setLoading(false); // Stop loading indicator
      },
      error => {
        setLoading(false); // Stop loading indicator
        setAlertModal({
          open: true,
          message:
            'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
          success: false,
        });
      
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  };

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

  const handleAddEvent = async () => {
    if (!query?.title) {
      return setAlertModal({
        open: true,
        message: 'Title is required!',
        success: false,
      });
    }

    if (query?.websiteLink?.trim() && !isURL(query.websiteLink)) {
      return setAlertModal({
        open: true,
        message: 'Website link must be a valid URL!',
        success: false,
      });
    }

    if (query?.facebookLink?.trim() && !isURL(query.facebookLink)) {
      return setAlertModal({
        open: true,
        message: 'Facebook link must be a valid URL!',
        success: false,
      });
    }
    try {
      setIsSubmitLoading(true);
      const res = await axiosInstance.post('/request-event', {
        eventName: query?.title,
        // "eventDetails": query?.destinationDetails,
        eventDate: query?.date,
        eventEndDate: query?.eventEndDate,
        venueAddress: query?.address,
        venueDescription: query?.destinationDetails,
        eventDetails: query?.destinationDetails,
        'venueLocation.longitude': query.coordinates?.longitude,
        'venueLocation.latitude': query.coordinates?.latitude,
      });

      setAlertModal({
        open: true,
        message: res?.data?.message,
        success: true,
      });
      setQuery({
        title: '',
        eventOrganizer: '',
        date: "",
        eventEndDate: "",
        address: '',
        destinationDetails: '',
        coordinates: {},
      });
    } catch (error) {
      setAlertModal({
        open: true,
        message: error?.message,
        success: false,
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };
  const CustomEventDateModal = useCallback(() => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setOpenDate(false);
        }}
        visible={openDate}
      >

        <TouchableWithoutFeedback
          onPress={() => {
            setOpenDate(false)
          }}
        >
          <View style={{
            backgroundColor: 'rgba(33, 22, 10, .85)',
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <TouchableWithoutFeedback>

              <DatePicker
              title={query.isEndDate?"Select Event End Date":"Select Event Start Date"}
                modal
                theme="dark"
                open={openDate}
                mode={"date"}
                date={new Date()}
                textColor="white"
                fadeToColor="none"
                androidVariant="iosClone"
                locale="en"
                cancelText='Cancel'
                confirmText={"Confirm"}
                onCancel={() => {
                  setOpenDate(false)
                }}
                onConfirm={(date) => {
                  setQuery(prev=>({
                    ...prev,
                    [query.isEndDate?"eventEndDate":"date"]:date
                  }))
                  setOpenDate(false)
                  setOpenTime(true)

                }}

              />

            </TouchableWithoutFeedback>


          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }, [openDate])
  const CustomEventTimeModal = useCallback(() => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setOpenTime(false);
        }}
        visible={openTime}
      >

        <TouchableWithoutFeedback
          onPress={() => {
            setOpenTime(false)
          }}
        >
          <View style={{
            backgroundColor: 'rgba(33, 22, 10, .85)',
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <TouchableWithoutFeedback>

              <DatePicker
              title={query.isEndDate?"Select Event End Time":"Select Event Start Time"}
                modal
                theme="dark"
                open={openTime}
                mode={"time"}
                date={query.isEndDate?query?.eventEndDate:query?.date}
                textColor="white"
                fadeToColor="none"
                androidVariant="iosClone"
                locale="en"
                cancelText='Cancel'
                confirmText={"Confirm"}
                onCancel={() => {
                  setOpenTime(false)
                }}
                onConfirm={(date) => {
                  setQuery(prev=>({
                    ...prev,
                    [query.isEndDate?"eventEndDate":"date"]:date
                  }))
                  setOpenTime(false)
                }}

              />

            </TouchableWithoutFeedback>


          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }, [openTime])
  return (
    <ImageBackground
      style={{ flex: 1, width: '100%', height: '100%' }}
      source={home}>
      <SafeAreaView
        style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
        <ScrollView>
          <Header
            cb={() => navigation.goBack()}
            showMenu={false}
            showProfilePic={false}
            headerContainerStyle={{
              paddingBottom: scale(20),
            }}
            title={''}
            showText={false}
          />

          <View
            style={{
              paddingHorizontal: scale(20),
              paddingBottom: scale(200),
              flex: 1,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 600,
                fontSize: scale(35),
                lineHeight: scale(50),
                marginBottom: scale(20),
              }}>
              Add Events
            </Text>
            <View
              style={{
                gap: scale(20),
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  gap: scale(20),
                }}>
                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Title *
                  </Text>
                  <CustomInput
                    // cb={() => setPage(1)}
                    name="title"
                    onChange={handleText}
                    updaterFn={setQuery}
                    value={query.title}
                    showTitle={false}
                    placeholder=" e.g. HS2024 Hot Sauce Festiva"
                    containterStyle={{
                      flexGrow: 1,
                    }}
                    inputStyle={{
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      color: 'white',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: scale(15),
                      paddingVertical: scale(15),
                    }}
                  />
                </View>
                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Event Organizer
                  </Text>
                  <CustomInput
                    // cb={() => setPage(1)}
                    name="eventOrganizer"
                    onChange={handleText}
                    updaterFn={setQuery}
                    value={query.eventOrganizer}
                    showTitle={false}
                    placeholder="e.g. Spicy Events Co."
                    containterStyle={{
                      flexGrow: 1,
                    }}
                    inputStyle={{
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      color: 'white',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 15,
                      paddingVertical: scale(15),
                    }}
                  />
                </View>
                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Website Link
                  </Text>
                  <CustomInput
                    // cb={() => setPage(1)}
                    name="websiteLink"
                    onChange={handleText}
                    updaterFn={setQuery}
                    value={query.websiteLink}
                    showTitle={false}
                    placeholder="e.g. https://example.com"
                    containterStyle={{
                      flexGrow: 1,
                    }}
                    inputStyle={{
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      color: 'white',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 15,
                      paddingVertical: scale(15),
                    }}
                  />
                </View>

                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Facebook Link
                  </Text>
                  <CustomInput
                    // cb={() => setPage(1)}
                    name="facebookLink"
                    onChange={handleText}
                    updaterFn={setQuery}
                    value={query.facebookLink}
                    showTitle={false}
                    placeholder="e.g. https://facebook.com"
                    containterStyle={{
                      flexGrow: 1,
                    }}
                    inputStyle={{
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      color: 'white',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 15,
                      paddingVertical: scale(15),
                    }}
                  />
                </View>
                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Date
                  </Text>
                  <CustomButtom
                    Icon={() => <Image source={arrow} />}
                    showIcon={false}
                    buttonTextStyle={{ fontSize: scale(14) }}
                    buttonstyle={{
                      width: '100%',
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      padding: 15,
                      display: 'flex',
                      gap: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setQuery(prev => ({ ...prev, isEndDate: false }));
                      setOpenDate(true);
                    }}
                    title={query?.date?query?.date?.toDateString() +" "+ query?.date?.toLocaleTimeString():"Please Select Event Start Date"}
                  />
                </View>

                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    End Date
                  </Text>
                  <CustomButtom
                    Icon={() => <Image source={arrow} />}
                    showIcon={false}
                    buttonTextStyle={{ fontSize: scale(14) }}
                    buttonstyle={{
                      width: '100%',
                      borderColor: '#FFA100',
                      backgroundColor: '#2e210a',
                      padding: 15,
                      display: 'flex',
                      gap: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setQuery(prev => ({ ...prev, isEndDate: true }));
                      setOpenDate(true);
                    }}
                    title={query?.eventEndDate?query?.eventEndDate?.toDateString() +" "+ query?.eventEndDate?.toLocaleTimeString():"Please Select Event End Date"}
                  />
                </View>

                <View>
                  <View
                    style={{
                      gap: scale(10),
                    }}>
                    <Text
                      style={{
                        fontSize: scale(17),
                        color: 'white',
                      }}>
                      Details
                    </Text>
                    <CustomInput
                      multiline={true}
                      numberOfLines={5}
                      name="destinationDetails"
                      onChange={handleText}
                      updaterFn={setQuery}
                      value={query.destinationDetails}
                      showTitle={false}
                      placeholder="e.g. Join us for a fiery celebration of hot sauces! Sample and vote for your favorite flavors."
                      containterStyle={{
                        flexGrow: 1,
                      }}
                      inputStyle={{
                        borderColor: '#FFA100',
                        backgroundColor: '#2e210a',
                        color: 'white',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 15,
                        textAlignVertical: 'top',
                        paddingVertical: scale(15),
                      }}
                    />
                  </View>
                </View>

                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: scale(17),
                      color: 'white',
                    }}>
                    Address
                  </Text>
                  <CustomButtom
                    loading={isloading}
                    Icon={() => <Image source={arrow} />}
                    showIcon={true}
                    buttonTextStyle={{ fontSize: scale(14) }}
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
                    title={
                      query?.address
                        ? query?.address?.slice(0, 35) +
                        `${query?.address?.length > 34 ? '...' : ''}`
                        : 'e.g. 123 Spicy Lane, Flavor Town, USA'
                    }
                  />
                </View>
              </View>
              <View>
                <CustomButtom
                  loading={isSubmitLoading}
                  showIcon={false}
                  buttonTextStyle={{ fontSize: scale(14) }}
                  buttonstyle={{
                    width: '100%',
                    borderColor: '#FFA100',
                    backgroundColor: '#2e210a',
                    paddingHorizontal: scale(15),
                    paddingVertical: scale(13),
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleAddEvent}
                  title={'Submit'}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <YesNoModal
          isQuestion={yesNoModal.isQuestion}
          modalVisible={yesNoModal.open}
          setModalVisible={() => {
            setYesNoModal({
              open: false,
              message: '',
              severity: true,
            });
            setLoading(false);
          }}
          success={yesNoModal.severity}
          title={yesNoModal.message}
          cb={yesNoModal.cb}
        />
        {CustomEventDateModal()}
        {CustomEventTimeModal()}
        <CustomAlertModal
          title={alertModal?.message}
          modalVisible={alertModal?.open}
          success={alertModal?.success}
          setModalVisible={() =>
            setAlertModal({
              alertModal: false,
              message: '',
            })
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
  },
  modalTitle: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: scale(20),
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: '#2e210a',
    padding: scale(20),
    borderRadius: scale(20),
    alignItems: 'center',
    borderColor: '#FFA100',
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 22, 10, .85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    padding: 15,
    backgroundColor: '#FFA100',
    borderRadius: 10,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: scale(16),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    padding: 15,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
    padding: 15,
    backgroundColor: '#FFA100',
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: scale(16),
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: scale(16),
  },
});
export default AddEventScreen;
