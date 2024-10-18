import { ImageBackground, SafeAreaView, StyleSheet, ScrollView, Text, View, Keyboard, Alert, Vibration, Image, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { handleText, isURL } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import arrow from "./../../../assets/images/arrow.png";
import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';

const AddStore = () => {
    const axiosInstance = useAxios()
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [yesNoModal, setYesNoModal] = useState({
        open:false,
        message:"",
        severity:"success",
        cb:()=>{},
        isQuestion:false
    })
    const [isloading, setIsLoading] = useState({
        submitForm: false,
        loadMap: false
    })

    const [alertModal, setAlertModal] = useState({
        open: false,
        message: "",
        success:true
    })
    const [query, setQuery] = useState({
        storeName: "",
        address: "",
        coordinates: {},
        zip:"",
        place_id:""

    });
    const navigation = useNavigation()
    const handleEventCoords = (coords) => {
        setQuery(prev => ({ ...prev, ["address"]: coords?.destination, ["coordinates"]: { latitude: coords?.latitude, longitude: coords?.longitude } , ["zip"]:coords.zip, ["place_id"]:coords.place_id}))
    }
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyBoard(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyBoard(false)
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleRequestSauce = async () => {
        try {
            setIsLoading(prev => ({ ...prev, ["submitForm"]: true }))

            if (!query?.storeName) {
                setAlertModal({
                    open: true,
                    message: "Store name is required!",
                    success:false
                });
                return;
            }
            if(!(query?.coordinates?.latitude && query?.coordinates?.latitude && query?.address) ){
                setAlertModal({
                    open: true,
                    message: "Store address is required!",
                    success:false
                });
                return;

            }
            const response = await axiosInstance.post("/add-store", {
                "storeName":query?.storeName,
                "longitude":query?.coordinates?.latitude.toString(),
                "latitude":query?.coordinates?.longitude.toString(),
                zip:query?.zip,
                place_id:query?.place_id,
            });

          

            if (response && response?.data && response?.data?.message) {
                setAlertModal({
                    open: true,
                    message: response?.data.message,
                    success:true
                })
                setQuery({})
            }

        } catch (error) {
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || "An error occurred. Please try again.",
                success:false

            });
        } finally {
            setIsLoading(prev => ({ ...prev, ["submitForm"]: false }))
        }

    }


    //current location code start 

    // const checkLocationServiceAndNavigate = () => {
    //     setIsLoading(prev => ({ ...prev, loadMap: true }))
    //     // Start loading indicator
    //     const permission = Platform.OS === 'ios'
    //         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    //         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    //     check(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //             fetchCurrentLocation();
    //         } else if (result === RESULTS.DENIED) {
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 isQuestion:true,
    //                 cb: () => {
    //                     request(permission).then(result => {
    //                         if (result === RESULTS.GRANTED) {
    //                           fetchCurrentLocation();
    //                         } else {
    //                           // Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //                           Alert.alert(
    //                               "Location Permission Blocked",
    //                               "Please enable location permission in your device settings to use this feature.",
    //                               [
    //                                   { text: "Cancel", style: "cancel" },
    //                                   { text: "Open Settings", onPress: () => Linking.openSettings() }
    //                               ]
    //                           );
    //                           setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //                         }
    //                       });
    //                 }
    //             });
    //         } else {
    //             setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //             setYesNoModal({
    //                 open: true,
    //                 message: "Location Permission Required. Would you like to grant permission?",
    //                 success: true,
    //                 isQuestion:true,
    //                 cb: () => {
    //                     request(permission).then(result => {
    //                         if (result === RESULTS.GRANTED) {
    //                           fetchCurrentLocation();
    //                         } else {
    //                           Alert.alert(
    //                               "Location Permission Blocked",
    //                               "Please enable location permission in your device settings to use this feature.",
    //                               [
    //                                   { text: "Cancel", style: "cancel" },
    //                                   { text: "Open Settings", onPress: () => Linking.openSettings() }
    //                               ]
    //                           );
    //                           setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //                         }
    //                       });
    //                 }
    //             });
    //         }
    //     }).catch(error => {
    //         console.warn("Error checking location permission:", error);
    //         Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
    //         setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //     });
    // };

    // const fetchCurrentLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("Current position:", position);
    //             navigation.navigate("Map", {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //                 fn: handleEventCoords,
    //                 showContinue:false

    //             });
    //             setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //         },
    //         (error) => {
    //             console.log("Error fetching current location:", error);
    //             Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
    //             setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
    //         },
    //         { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    //     );
    // };

    //current location code end


    //test location code start
    const checkLocationServiceAndNavigate = async () => {
        setIsLoading(prev => ({ ...prev, loadMap: true })); // Start loading indicator
        const permission = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
        try {
          const result = await check(permission);
          switch (result) {
            case RESULTS.UNAVAILABLE:
              Alert.alert(
                "Location Services Unavailable",
                "Location services are not available on this device.",
                [{ text: "OK", onPress: () => setIsLoading(prev => ({ ...prev, loadMap: false })) }]
              );
              break;
            case RESULTS.DENIED:
              showPermissionModal(
                "Location Permission Required. Would you like to grant permission?",
                async () => {
                  const requestResult = await request(permission);
                  if (requestResult === RESULTS.GRANTED) {
                    fetchCurrentLocation();
                  } else if (requestResult === RESULTS.BLOCKED) {
                    handleBlockedPermission();
                  } else {
                    setIsLoading(prev => ({ ...prev, loadMap: false }));
                  }
                }
              );
              break;
            case RESULTS.GRANTED:
            case RESULTS.LIMITED:
              // For iOS, proceed even if access is limited
              fetchCurrentLocation();
              break;
            case RESULTS.BLOCKED:
              handleBlockedPermission();
              break;
            default:
              Alert.alert(
                "Permission Error",
                "An unexpected error occurred while checking location permission.",
                [{ text: "OK", onPress: () => setIsLoading(prev => ({ ...prev, loadMap: false })) }]
              );
              break;
          }
        } catch (error) {
          console.warn("Error checking location permission:", error);
          Alert.alert(
            "Error",
            "An error occurred while checking location permission. Please try again.",
            [{ text: "OK", onPress: () => setIsLoading(prev => ({ ...prev, loadMap: false })) }]
          );
        }
      };
      
      const fetchCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("Current position:", position);
            navigation.navigate("Map", {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              fn: handleEventCoords,
              showContinue: false,
            });
            setIsLoading(prev => ({ ...prev, loadMap: false })); // Stop loading indicator
          },
          (error) => {
            console.log("Error fetching current location:", error);
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
            Alert.alert(
              "Location Service Error",
              `Could not fetch current location. ${errorMessage}`,
              [{ text: "OK", onPress: () => setIsLoading(prev => ({ ...prev, loadMap: false })) }]
            );
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
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
      
      const handleBlockedPermission = () => {
        Alert.alert(
          "Location Permission Blocked",
          "Please enable location permission in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel", onPress: () => setIsLoading(prev => ({ ...prev, loadMap: false })) },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
                setIsLoading(prev => ({ ...prev, loadMap: false }));
              },
            },
          ]
        );
      };



    //test location code end
    

    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
                <Header cb={() => navigation.goBack()}
                    showMenu={false}
                    showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} title={"Followers"} showText={false} />

                <View style={{
                    paddingHorizontal: scale(20),
                    paddingBottom: scale(20),
                    flex: 1
                }}>
                    <Text style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: scale(35),
                        lineHeight: scale(50),
                        marginBottom: scale(20)
                    }}>
                        Add Store
                    </Text>
                    <View style={{
                        gap: scale(20),
                        flex: 1,
                        justifyContent: "space-between",
                    }}>

                        <View style={{
                            gap: scale(20)
                        }}>
                            <View style={{
                                gap: scale(10)
                            }}>
                                <Text style={{
                                    fontSize: scale(17),
                                    color: "white"
                                }}>
                                    Store *
                                </Text>
                                <CustomInput
                                    name="storeName"
                                    onChange={handleText}
                                    updaterFn={setQuery}
                                    value={query.storeName}
                                    showTitle={false}
                                    placeholder="e.g. The Heat Exchange"
                                    containterStyle={{
                                        flexGrow: 1,
                                    }}
                                    inputStyle={{
                                        borderColor: "#FFA100",
                                        backgroundColor: "#2e210a",
                                        color: "white",
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        padding: 15,
                                        paddingVertical:scale(15)

                                    }} />
                            </View>
                            <View style={{
                                gap: scale(10)
                            }}>
                                <Text style={{
                                    fontSize: scale(17),
                                    color: "white"
                                }}>
                                    Address *
                                </Text>

                                <CustomButtom
                                    loading={isloading.loadMap}
                                    Icon={() => <Image source={arrow} />}
                                    showIcon={true}
                                    buttonTextStyle={{ fontSize: scale(14) }}
                                    buttonstyle={{
                                        width: "100%", borderColor: "#FFA100",
                                        backgroundColor: "#2e210a", padding: 15,
                                        display: "flex", gap: 10, flexDirection: "row-reverse",
                                        alignItems: "center", justifyContent: isloading?.loadMap ? "center" : "space-between"
                                    }}
                                    onPress={checkLocationServiceAndNavigate}

                                    title={query?.address ? query?.address?.slice(0,35)+`${query?.address.length>34?"...":""}` : "e.g. 123 Spicy Lane, Flavor Town, USA"}
                                />

                            </View>

                        </View>
                        <View>

                            <CustomButtom
                                loading={isloading.submitForm}
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
                                onPress={handleRequestSauce}
                                title={"Submit"}
                            />
                        </View>
                    </View>
                </View>


                <YesNoModal
                  isQuestion= {yesNoModal.isQuestion}
                    modalVisible={yesNoModal.open}
                    setModalVisible={()=>{
                        setYesNoModal({
                            open: false,
                            messsage: "",
                            severity:true,
                        })
                        setIsLoading(prev => ({ ...prev, loadMap: false }))
                    }}
                    success={yesNoModal.severity}
                    title={"Location Request"}
                    cb={yesNoModal.cb}
                                    
                    />

                <CustomAlertModal
                    title={alertModal?.message}
                    success={alertModal?.success}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        open: false,
                        messsage: ""
                    })}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default AddStore
