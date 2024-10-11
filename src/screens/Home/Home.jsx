import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Vibration, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import home from './../../../assets/images/home.png';
import search from "./../../../assets/images/search_icon.png";
import {  handleText } from '../../../utils';
import BrandList from '../../components/BrandList/BrandList';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import arrow from "./../../../assets/images/arrow.png";
import { useNavigation } from '@react-navigation/native';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import CustomCarousel from '../../components/CustomCarousel/CustomCarousel';
import CustomOfficialReviewsListCarousel from '../../components/CustomOfficialReviewsListCarousel/CustomOfficialReviewsListCarousel';
import TopRatedSaucesList from '../../components/TopRatedSaucesList/TopRatedSaucesList';
import FeaturedSaucesList from '../../components/FeaturedSaucesList/FeaturedSaucesList';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import useAxios from '../../../Axios/useAxios';
import Toast from 'react-native-toast-message';
import { addNotification } from '../../../android/app/Redux/notifications';
import { useDispatch } from 'react-redux';
import YesNoModal from '../../components/YesNoModal/YesNoModal';
const Home = () => {
    const navigation = useNavigation()
    const [alertModal, setAlertModal] = useState({
        open:false,
        message:"",
        severity:"success"
    })
    const [yesNoModal, setYesNoModal] = useState({
        open:false,
        message:"",
        severity:"success",
        isQuestion:false,
        cb:()=>{}
    })
    const axiosInstance = useAxios()
    const dispatch = useDispatch()
    const [initialLoading, setInitialLoading] = useState(true)
    const [data, setData] = useState({
        search: "",
    });
    const [isloading, setLoading] = useState(false)



    const updateTokenOnServer = async (newFcmToken) => {
        try {
          const resposne = await axiosInstance.post("/update-token", { notificationToken: newFcmToken });
          console.log('Token updated on the server successfully.', resposne.data);
        } catch (error) {
          console.error('Failed to update token on server:', error);
        }
      };

      
      React.useEffect(() => {
        // Get the initial token
        const getInitialFcmToken = async () => {
          const fcmToken = await messaging().getToken();
          console.log('Initial FCM Token:', fcmToken);
          await updateTokenOnServer(fcmToken); // Update token to your backend
        };
        getInitialFcmToken();
        const unsubscribe = messaging().onTokenRefresh(async (newFcmToken) => {
          console.log('FCM Token refreshed:', newFcmToken);
          await updateTokenOnServer(newFcmToken); // Update new token to your backend
        });
      
        // Clean up the listener when component unmounts
        return () => unsubscribe();
      }, []);
      


    const checkLocationServiceAndNavigate = () => {
        setLoading(true); // Start loading indicator
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
        check(permission).then(result => {
          if (result === RESULTS.GRANTED) {
            fetchCurrentLocation();
          } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {


            setYesNoModal({
                                open: true,
                                message: "Location Permission Required. Would you like to grant permission?",
                                success: true,
                                isQuestion:true,
                                cb: () => {
                                    request(permission).then(result => {
                                        if (result === RESULTS.GRANTED) {
                                          fetchCurrentLocation();
                                        } else {
                                          // Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
                                          Alert.alert(
                                              "Location Permission Blocked",
                                              "Please enable location permission in your device settings to use this feature.",
                                              [
                                                  { text: "Cancel", style: "cancel" },
                                                  { text: "Open Settings", onPress: () => Linking.openSettings() }
                                              ]
                                          );
                                          setLoading(false); // Stop loading indicator
                                        }
                                      });
                                }
                            });
           
            // setYesNoModal({
            //     open: true,
            //     message: "Location Permission Required. Would you like to grant permission?",
            //     success: true,
            // });
          } else {
            // setLoading(false); // Stop loading indicator
            // Alert.alert("Location Permission", "Location permission is not available or blocked. Please enable it in settings.");
            setYesNoModal({
                open: true,
                message: "Location Permission Required. Would you like to grant permission?",
                success: true,
                isQuestion:true,
                cb: () => {
                    request(permission).then(result => {
                        if (result === RESULTS.GRANTED) {
                          fetchCurrentLocation();
                        } else {
                          // Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
                          Alert.alert(
                              "Location Permission Blocked",
                              "Please enable location permission in your device settings to use this feature.",
                              [
                                  { text: "Cancel", style: "cancel" },
                                  { text: "Open Settings", onPress: () => Linking.openSettings() }
                              ]
                          );
                          setLoading(false); // Stop loading indicator
                        }
                      });
                }
            });
          }
        }).catch(error => {
          console.warn("Error checking location permission:", error);
        //   Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
          setAlertModal({
            open: true,
            message: 'Error, An error occurred while checking location permission. Please try again.',
            severity:false
        })
          setLoading(false); // Stop loading indicator
        });
      };
    
      const fetchCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("Current position:", position);
            navigation.navigate("Map", {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              fn:()=>{},
              showContinue:true
            });
            setLoading(false); // Stop loading indicator
          },
          (error) => {
            console.log("Error fetching current location:", error);
            // Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
            setAlertModal({
                open: true,
                message: 'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
                severity:false
            })
            setLoading(false); // Stop loading indicator
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
        );
      };




    // const checkLocationServiceAndNavigate = () => {
    //     setLoading(true); // Start loading indicator
    //     const permission = Platform.OS === 'ios' 
    //       ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
    //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
    //     // Check permission status
    //     check(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //             // Permission is granted, fetch the location
    //             fetchCurrentLocation();
    //             setPermissionGranted(true);
    //         setLoading(false); // Stop loading indicator

    //         } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    //             // Show modal asking for permission
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 cb: () => {
    //                     request(permission).then(requestResult => {
    //                         if (requestResult === RESULTS.GRANTED) {
    //                             fetchCurrentLocation();
    //                             setPermissionGranted(true);
    //                         } else {
    //                             Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                             setLoading(false); // Stop loading indicator
    //                         }
    //                     });
    //                 }
    //             });
    //         setLoading(false); // Stop loading indicator

    //         } else {
    //             // Handle other cases (e.g., PERMISSION_NEVER_ASK_AGAIN)
    //             request(permission).then(result => {
    //                 if (result === RESULTS.GRANTED) {
    //                     fetchCurrentLocation();
    //                     setPermissionGranted(true);

    //                 } else {
    //                     Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                     setLoading(false); // Stop loading indicator
    //                 }
    //             });
    //         setLoading(false); // Stop loading indicator

    //         }
    //     }).catch(error => {
    //         console.warn("Error checking location permission:", error);
    //         setAlertModal({
    //             open: true,
    //             message: 'Error, an error occurred while checking location permission. Please try again.',
    //             severity: false
    //         });
    //         setLoading(false); // Stop loading indicator
    //     });
    // };
    
    // const fetchCurrentLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("Current position:", position);
    //             navigation.navigate("Map", {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //                 fn: () => {},
    //                 showContinue: true
    //             });
    //             setLoading(false); // Stop loading indicator
    //         },
    //         (error) => {
    //             console.log("Error fetching current location:", error);
    //             setAlertModal({
    //                 open: true,
    //                 message: 'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
    //                 severity: false
    //             });
    //             setLoading(false); // Stop loading indicator
    //         },
    //         { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    //     );
    // };




    // const checkLocationServiceAndNavigate = () => {
    //     setLoading(true); // Start loading indicator
    //     const permission = Platform.OS === 'ios' 
    //       ? PERMISSIONS.IOS.LOCATION_ALWAYS // Changed to LOCATION_ALWAYS for better handling
    //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
    //     // Check permission status
    //     check(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //             // Permission is granted, fetch the location
    //             fetchCurrentLocation();
    //         } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    //             // Show modal asking for permission
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 cb: () => {
    //                     request(permission).then(requestResult => {
    //                         if (requestResult === RESULTS.GRANTED) {
    //                             fetchCurrentLocation();
    //                         } else {
    //                             Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                         }
    //                     });
    //                 }
    //             });
    //         } else {
    //             // Handle other cases (e.g., PERMISSION_NEVER_ASK_AGAIN)
    //             request(permission).then(result => {
    //                 if (result === RESULTS.GRANTED) {
    //                     fetchCurrentLocation();
    //                 } else {
    //                     Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                 }
    //             });
    //         }
    //     }).catch(error => {
    //         console.warn("Error checking location permission:", error);
    //         setAlertModal({
    //             open: true,
    //             message: 'Error, an error occurred while checking location permission. Please try again.',
    //             severity: false
    //         });
    //         // It's better to stop loading only when there's a real issue
    //     }).finally(() => {
    //         setLoading(false); // Stop loading indicator in all cases
    //     });
    // };
    
    // const fetchCurrentLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("Current position:", position);
    //             navigation.navigate("Map", {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //                 fn: () => {},
    //                 showContinue: true
    //             });
    //             setLoading(false); // Stop loading indicator
    //         },
    //         (error) => {
    //             console.log("Error fetching current location:", error);
    //             setAlertModal({
    //                 open: true,
    //                 message: 'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
    //                 severity: false
    //             });
    //             setLoading(false); // Stop loading indicator
    //         },
    //         { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    //     );
    // };



    // const checkLocationServiceAndNavigate = () => {
    //     setLoading(true); // Start loading indicator
    //     const permission = Platform.OS === 'ios' 
    //       ? PERMISSIONS.IOS.LOCATION_ALWAYS // Changed to LOCATION_ALWAYS for better handling
    //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
    //     // Check permission status
    //     check(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //             // Permission is granted, fetch the location
    //             fetchCurrentLocation();
    //         } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    //             // Show modal asking for permission
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 cb: () => {
    //                     request(permission).then(requestResult => {
    //                         if (requestResult === RESULTS.GRANTED) {
    //                             fetchCurrentLocation(); // Fetch location after granting
    //                         } else {
    //                             Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                             setLoading(false); // Stop loading indicator if permission denied
    //                         }
    //                     }).catch(() => {
    //                         setLoading(false); // Stop loading indicator on error
    //                     });
    //                 }
    //             });
    //             // Don't stop loading here since we are waiting for the user's response
    //         } else {
    //             // Handle other cases (e.g., PERMISSION_NEVER_ASK_AGAIN)
    //             request(permission).then(result => {
    //                 if (result === RESULTS.GRANTED) {
    //                     fetchCurrentLocation();
    //                 } else {
    //                     Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                     setLoading(false); // Stop loading indicator if permission denied
    //                 }
    //             }).catch(() => {
    //                 setLoading(false); // Stop loading indicator on error
    //             });
    //         }
    //     }).catch(error => {
    //         console.warn("Error checking location permission:", error);
    //         setAlertModal({
    //             open: true,
    //             message: 'Error, an error occurred while checking location permission. Please try again.',
    //             severity: false
    //         });
    //         setLoading(false); // Stop loading indicator
    //     });
    // };
    
    // const fetchCurrentLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("Current position:", position);
    //             navigation.navigate("Map", {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //                 fn: () => {},
    //                 showContinue: true
    //             });
    //             setLoading(false); // Stop loading indicator after navigation
    //         },
    //         (error) => {
    //             console.log("Error fetching current location:", error);
    //             setAlertModal({
    //                 open: true,
    //                 message: 'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
    //                 severity: false
    //             });
    //             setLoading(false); // Stop loading indicator on error
    //         },
    //         { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    //     );
    // };



    // const checkLocationServiceAndNavigate = () => {
    //     setLoading(true); // Start loading indicator
    //     const permission = Platform.OS === 'ios' 
    //       ? PERMISSIONS.IOS.LOCATION_ALWAYS // Ensure we're checking the correct permission type
    //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
    //     // Check permission status
    //     check(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //             // Permission is granted, fetch the location
    //             fetchCurrentLocation();
    //         } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    //             // Show modal asking for permission
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 cb: () => {
    //                     request(permission).then(requestResult => {
    //                         if (requestResult === RESULTS.GRANTED) {
    //                             fetchCurrentLocation(); // Fetch location after granting
    //                         } else {
    //                             Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                             setLoading(false); // Stop loading indicator if permission denied
    //                         }
    //                     }).catch(() => {
    //                         setLoading(false); // Stop loading indicator on error
    //                     });
    //                 }
    //             });
    //             // Don't stop loading here since we are waiting for the user's response
    //         } else {
    //             // Handle other cases (e.g., PERMISSION_NEVER_ASK_AGAIN)
    //             request(permission).then(result => {
    //                 if (result === RESULTS.GRANTED) {
    //                     fetchCurrentLocation();
    //                 } else {
    //                     Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                     setLoading(false); // Stop loading indicator if permission denied
    //                 }
    //             }).catch(() => {
    //                 setLoading(false); // Stop loading indicator on error
    //             });
    //         }
    //     }).catch(error => {
    //         console.warn("Error checking location permission:", error);
    //         setAlertModal({
    //             open: true,
    //             message: 'Error, an error occurred while checking location permission. Please try again.',
    //             severity: false
    //         });
    //         setLoading(false); // Stop loading indicator
    //     });
    // };
    
    // const fetchCurrentLocation = () => {
    //     setLoading(true); // Ensure loading is active while fetching location
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("Current position:", position);
    //             navigation.navigate("Map", {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //                 fn: () => {},
    //                 showContinue: true
    //             });
    //             setLoading(false); // Stop loading indicator after navigation
    //         },
    //         (error) => {
    //             console.log("Error fetching current location:", error);
    //             setAlertModal({
    //                 open: true,
    //                 message: 'Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.',
    //                 severity: false
    //             });
    //             setLoading(false); // Stop loading indicator on error
    //         },
    //         { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    //     );
    // };
    useEffect(() => {
        setTimeout(() => {
            setInitialLoading(false)
        }, 1000)
    })




    useEffect(()=>{

        try{

            async function requestUserPermission() {
                const authStatus = await messaging().requestPermission();
                const enabled =
                  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
              
                if (enabled) {
                  console.log('Authorization status:', authStatus);
                  getFcmToken();
                }
              }
              
              const getFcmToken = async () => {
                const token = await messaging().getToken();
                console.log('FCM Token:', token);
                // You can save the token to your backend if needed
              };
              requestUserPermission()
        }catch(err){
            console.log(err)
        }
      
    },[])

    // useEffect(() => {
    //     const unsubscribe = messaging().onMessage(async remoteMessage => {
    //         Toast.show({
    //             type: 'success',
    //             text1: remoteMessage.notification.title,
    //             text2: remoteMessage.notification.body})
    //             dispatch(addNotification({
    //                 type: 'success',
    //                 title: remoteMessage.notification.title,
    //                 body: remoteMessage.notification.body}
    //         ));
    //         dispatch(increaseCount());
    //         console.log("remoteMessage===============>", remoteMessage)

    //     });
      
    //     return unsubscribe;
    //   }, []);

     

    if (initialLoading) {
        return (
            <ImageBackground source={home} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                            
                            style={{width:"100%"}}
                            onPress={()=>{
                                navigation.navigate("Search")
                            }}>

                            <CustomInput
                            readOnly={true}
                                imageStyles={{ top: "50%", transform: [{ translateY: -0.5 * scale(25) }], resizeMode: 'contain', width: scale(25), height: scale(25), aspectRatio: "1/1" }}
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
                                    borderColor: "#FFA100",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 15,
                                    paddingLeft: scale(45)

                                }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(10)
                            navigation.navigate("RequestASauceScreen")
                        }}>

                            <Text style={[styles.infoText, {
                                textDecorationLine: "underline", fontWeight: 700,
                            }]}>
                                Don't see what you're looking for? Request a sauce or brand.
                            </Text>
                        </TouchableOpacity>

                    </View>

                    
                    <View style={{
                        position: "relative",
                        gap:scale(10)
                    }}>
                        <Text style={
                        {
                            color: "white",
                            lineHeight: scale(29),
                            fontSize: scale(24),
                            fontWeight: "600",
                        }
                    }>
                        Events
                    </Text>

                        <CustomCarousel
                            showText={true}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                    <FeaturedSaucesList
                            title='Featured Sauces'
                    />
                    <TopRatedSaucesList
                            title='Recently Popular Sauces'
                    />
                    <View style={{
                        gap:scale(10)
                    }}>

                        <CustomButtom
                        loading={isloading}
                            Icon={() => <Image source={arrow} />}
                            showIcon={true}
                            buttonTextStyle={{ fontSize: scale(14) }}
                            buttonstyle={{
                                width: "100%", borderColor: "#FFA100",
                                backgroundColor: "#2e210a", padding: 15,
                                display: "flex", gap: 10, flexDirection: "row-reverse",
                                alignItems: "center", justifyContent:isloading?"center": "space-between"
                            }}
                            // onPress={() => navigation.navigate("Map")}
                            // onPress={navigateIfLocationEnabled}
                            // onPress={checkLocationServiceAndNavigate}
                            onPress={checkLocationServiceAndNavigate}

                            title={"Find a hot sauce store near me"}
                        />
                         <TouchableOpacity onPress={() => {
                            Vibration.vibrate(10)
                            navigation.navigate("AddStore")
                        }}>

                            <Text style={[styles.infoText, {
                                textDecorationLine: "underline", fontWeight: 700,
                                marginLeft:scale(2)
                            }]}>
                                Want to recommend a local store?
                            </Text>
                        </TouchableOpacity>
                    </View>

                        <BrandList title='Popular Brands' />
                        <View style={{
                            gap: scale(20)
                        }}>
                            <Text style={
                                {
                                    color: "white",
                                    lineHeight: verticalScale(28.8),
                                    fontSize: moderateScale(24),
                                    fontWeight: "600",
                                }
                            }>
                                Official Reviews
                            </Text>
                            <CustomOfficialReviewsListCarousel
                                showText={false}
                            />
                        </View>

                        <CustomButtom
                            Icon={() => <Image source={arrow} />}
                            showIcon={true}
                            buttonTextStyle={{ fontSize: scale(14) }}
                            buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                            onPress={() => {
                                Vibration.vibrate(10);
                                // navigation.navigate("SauceDetails")
                                navigation.navigate("RequestASauceScreen")
                            }}
                            title={"Suggest a sauce not listed "}
                        />

                    </View>
                    <CustomAlertModal
                        title={alertModal.message}
                        modalVisible={alertModal.open}
                        setModalVisible={() => setAlertModal({
                            open: false,
                            message: "",
                            severity:true
                        })}
                    />

                    <YesNoModal
                     isQuestion= {yesNoModal.isQuestion}
                    modalVisible={yesNoModal.open}
                    setModalVisible={()=>{
                        setYesNoModal({
                            open: false,
                            messsage: "",
                            severity:true,
                        });
                        setLoading(false)
                    }}
                    success={yesNoModal.severity}
                    title={"Location Request"}
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
        flex: 1
    },
    searchContainer: {
        marginBottom: verticalScale(20),

    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: 'end',
        marginBottom: verticalScale(10),
        gap: 10
    },
    searchBar: {
        height: verticalScale(50),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: "#FFA100",
        flexGrow: 1,
        marginRight: scale(10),
    },
    qrImage: {
        borderRadius: moderateScale(10),
        width: scale(50),
        height: scale(50),
    },
    infoText: {
        color: "white",
        fontSize: moderateScale(10),
        lineHeight: verticalScale(13),
        fontFamily: "Montserrat",
    },
    contentContainer: {
        gap: verticalScale(40),
        marginTop: scale(30)
    },
    mainBanner: {
        position: "relative",
        gap: verticalScale(10),
        marginBottom: verticalScale(50)

    },
    bannerContainer: {
        position: "relative",
        width: "100%",
        height: verticalScale(130),
        gap: verticalScale(10),
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(10),
    },
    bannerTextContainer: {
        position: "absolute",
        top: "50%",
        left: "10%",
        transform: [{ translateY: -25 }, { translateX: -10 }],
    },
    bannerText: {
        color: "white",
        fontSize: moderateScale(23),
        fontWeight: 'bold',
    }
});

export default Home;
