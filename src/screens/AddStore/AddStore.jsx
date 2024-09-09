import { ImageBackground, SafeAreaView, StyleSheet, ScrollView, Text, View, Keyboard, Alert, Vibration, Image } from 'react-native'
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

const AddStore = () => {
    const axiosInstance = useAxios()
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [isloading, setIsLoading] = useState({
        submitForm: false,
        loadMap: false
    })

    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    })
    const [query, setQuery] = useState({

        storeName: "",
        address: "",
        coordinates: {}

    });
    const navigation = useNavigation()
    const handleEventCoords = (coords) => {
        setQuery(prev => ({ ...prev, ["address"]: coords?.destination, ["coordinates"]: { latitude: coords?.latitude, longitude: coords?.longitude } }))
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
                    message: "Store name is required!"
                });
                return;
            }
            if(!(query?.coordinates?.latitude && query?.coordinates?.latitude && query?.address) ){
                setAlertModal({
                    open: true,
                    message: "Store address is required!"
                });
                return;

            }
            const response = await axiosInstance.post("/add-store", {
                "storeName":query?.storeName,
                "longitude":query?.coordinates?.latitude.toString(),
                "latitude":query?.coordinates?.longitude.toString()
            });

          

            if (response && response?.data && response?.data?.message) {
                setAlertModal({
                    open: true,
                    message: response?.data.message
                })
                setQuery({})
            }

        } catch (error) {
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || "An error occurred. Please try again."
            });
        } finally {
            setIsLoading(prev => ({ ...prev, ["submitForm"]: false }))
        }

    }

    const checkLocationServiceAndNavigate = () => {
        setIsLoading(prev => ({ ...prev, loadMap: true }))
        // Start loading indicator
        const permission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        check(permission).then(result => {
            if (result === RESULTS.GRANTED) {
                fetchCurrentLocation();
            } else if (result === RESULTS.DENIED) {
                request(permission).then(result => {
                    if (result === RESULTS.GRANTED) {
                        fetchCurrentLocation();
                        setIsLoading(prev => ({ ...prev, loadMap: false }))
                    } else {
                        Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
                        setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
                    }
                });
            } else {
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
                Alert.alert("Location Permission", "Location permission is not available or blocked. Please enable it in settings.");
            }
        }).catch(error => {
            console.warn("Error checking location permission:", error);
            Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
            setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
        });
    };

    const fetchCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log("Current position:", position);
                navigation.navigate("Map", {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    fn: handleEventCoords
                });
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            (error) => {
                console.log("Error fetching current location:", error);
                Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

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
                                    placeholder="Store Name"
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

                                    title={query?.address ? query?.address : "Address"}
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




                <CustomAlertModal
                    title={alertModal?.message}
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
