import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { handleText } from '../../../utils.js';
import useAxios, { host } from '../../../Axios/useAxios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import arrow from "./../../../assets/images/arrow.png";
import Lightbox from 'react-native-lightbox-v2';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SelectableChips from '../../components/FoodPairing/FoodPairing.jsx';
import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';
import { X } from 'lucide-react-native';
// import { handleCheckedInSauces } from '../../../android/app/Redux/checkedInSauces.js';
import ImageView from "react-native-image-viewing";
import { handleCheckedInSauces } from '../../Redux/checkedInSauces.js';

const CheckinScreen = () => {
    const axiosInstance = useAxios()
    const route = useRoute()
    // const item = route?.params?.item
    const fn = route?.params?.fn || function () { }
    const routerNumber = route?.params?.routerNumber
    const photo = route?.params?.photo || null
    const auth = useSelector(state => state.auth)
    const sauceType = route?.params?.sauceType || ""
    const url = route?.params?.url || ""
    const title = route?.params?.title || ""
    const item = route?.params?.item || {}
    const mycb = route?.params?.mycb || function () { }
    const handleLike = route?.params?.handleLike || function () { }
    const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount || function () { }
    const setReviewCount = route?.params?.setReviewCount || function () { }
    const reviewCount = route?.params?.reviewCount || ""
    const _id = route?.params?._id || ""
    const [visible, setIsVisible] = useState(false)

    const dispatch = useDispatch()

    const [isSelected, setIsSelected] = useState(true)
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [imageUris, setImageUris] = useState(photo?.uri ? [photo] : []);
    const [fetchLocation, setFetchLocation] = useState(false)
    const [isClearChips, setIsClearChips] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [yesNoModal, setYesNoModal] = useState({
        open: false,
        message: "",
        severity: "success",
        cb: () => { },
        isQuestion: false
    })
    const [isloading, setIsLoading] = useState({
        submitForm: false,
        loadMap: false
    })
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: "",
        success: true,
        openYesNoModal: false,
        buttonText: "Cancel",
        cb: () => { }
    })

    const [data, setData] = useState({
        description: "",
        select: "",
        location: "",
        address: "",
        coordinates: {},
        foodPairings: []
    });



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
                setYesNoModal({
                    open: true,
                    message: "Location Permission Required. Would you like to grant permission?",
                    success: true,
                    isQuestion: true,
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
                                setIsLoading(prev => ({ ...prev, loadMap: false }))  // Stop loading indicator
                            }
                        });
                    }
                });
            } else {
                setYesNoModal({
                    open: true,
                    message: "Location Permission Required. Would you like to grant permission?",
                    success: true,
                    isQuestion: true,

                    cb: () => {
                        request(permission).then(result => {
                            if (result === RESULTS.GRANTED) {
                                fetchCurrentLocation();
                            } else {
                                Alert.alert(
                                    "Location Permission Blocked",
                                    "Please enable location permission in your device settings to use this feature.",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Open Settings", onPress: () => Linking.openSettings() }
                                    ]
                                );
                                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
                            }
                        });
                    }
                });
            }
        }).catch(error => {
            console.warn("Error checking location permission:", error);
            setAlertModal({
                open: true,
                message: "An error occurred while checking location permission. Please try again.",
                success: false
            })
            setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
        });
    };


    const fetchCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                navigation.navigate("Map", {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    fn: handleEventCoords
                });
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            (error) => {
                setAlertModal({
                    open: true,
                    message: "Could not fetch current location. Please ensure your location services are enabled and try again.",
                    success: false
                })
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
        );
    };



    const handleEventCoords = (coords) => {
        setData(prev => ({ ...prev, ["address"]: coords?.destination, ["coordinates"]: { latitude: coords?.latitude, longitude: coords?.longitude } }))
    }




    const handleImagePickerPermission = (isSelected = true) => {
        const cameraPermission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;

        const galleryPermission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.PHOTO_LIBRARY
            // : (Platform.Version >= 33
            //     ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Use new media permissions for Android 13+
            //     : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE); // Fallback for older Android versions
            : Platform.Version >= 34
                ? PERMISSIONS.ANDROID.CAMERA
                : PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED
                    ? PERMISSIONS.ANDROID.CAMERA
                    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        const permissionToCheck = isSelected ? cameraPermission : galleryPermission;

        check(permissionToCheck).then(result => {
            if (result === RESULTS.GRANTED) {
                handleImagePicker(isSelected); // Proceed with image picking
            } else if (result === RESULTS.DENIED) {

                setYesNoModal({
                    open: true,
                    message: isSelected
                        ? "Camera Permission Required. Would you like to grant permission?"
                        : "Gallery Permission Required. Would you like to grant permission?",
                    success: true,
                    isQuestion: true,

                    cb: () => {
                        request(permissionToCheck).then(result => {
                            if (result === RESULTS.GRANTED) {
                                handleImagePicker(isSelected);
                            } else {
                                Alert.alert(
                                    isSelected
                                        ? "Camera Permission Blocked"
                                        : "Gallery Permission Blocked",
                                    `Please enable ${isSelected ? 'Camera' : 'Gallery'} permission in your device settings to use this feature.`,
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Open Settings", onPress: () => Linking.openSettings() }
                                    ]
                                );
                            }
                        });
                    }
                });
            } else {
                setYesNoModal({
                    open: true,
                    message: isSelected
                        ? "Camera Permission Required. Would you like to grant permission?"
                        : "Gallery Permission Required. Would you like to grant permission?",
                    success: true,
                    isQuestion: true,

                    cb: () => {
                        request(permissionToCheck).then(result => {
                            if (result === RESULTS.GRANTED) {
                                handleImagePicker(isSelected);
                            } else {
                                Alert.alert(
                                    isSelected
                                        ? "Camera Permission Blocked"
                                        : "Gallery Permission Blocked",
                                    `Please enable ${isSelected ? 'Camera' : 'Gallery'} permission in your device settings to use this feature.`,
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Open Settings", onPress: () => Linking.openSettings() }
                                    ]
                                );
                            }
                        });
                    }
                });
            }
        }).catch(error => {
            console.warn("Error checking camera/gallery permission:", error);
            setAlertModal({
                open: true,
                message: `An error occurred while checking ${isSelected ? 'camera' : 'gallery'} permission. Please try again.`,
                success: false,
            });
        });
    };


    const handleImagePicker = (isSelected) => {

        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 0, // Allows multiple selection
        };
        const launchFunction = isSelected ? launchCamera : launchImageLibrary;
        launchFunction(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response?.error);
                // Open the alert modal with the error message
                setAlertModal({
                    open: true,
                    message: 'Something went wrong while picking the image.',
                    success: false
                });
            } else {
                const sources = response?.assets?.map(asset => ({
                    uri: asset?.uri,
                    type: asset?.type,
                    name: asset?.fileName,
                })) || []; // Default to empty array if undefined

                setImageUris(prevUris => [...prevUris, ...sources]);
            }
        });
    };
    const handleCheckedIn = (data) => {
        if (!!data) {

            dispatch(handleCheckedInSauces([data]))
        }
    }


    const handleSubmit = async () => {
        try {
            // Input validations
            if (!data?.description) {
                return setAlertModal({
                    open: true,
                    message: 'Description is required!',
                    success: false,
                });
            }

            //   if (imageUris.length<1) {
            //     return setAlertModal({
            //       open: true,
            //       message: 'Images required!',
            //       success: false,
            //     });
            //   }

            //   if (!data.coordinates?.latitude || !data?.coordinates?.longitude || !data?.address) {
            //     return setAlertModal({
            //       open: true,
            //       message: 'Location is required!',
            //       success: false,
            //     });
            //   }

            // Set loading state
            setLoading(true);

            // Create FormData to send
            const formData = new FormData();

            // Append each image to the FormData object
            imageUris.forEach((imageUri, index) => {
                if (imageUri.uri && imageUri.name && imageUri.type) {
                    formData.append('images', {
                        uri: imageUri.uri,
                        type: imageUri.type, // Use the correct MIME type
                        name: imageUri.name,
                    });
                } else {
                    console.warn(`Image at index ${index} is missing required properties.`);
                }
            });

            // Append other fields (description, coordinates, sauceId)
            formData.append('text', data?.description);
            formData.append('latitude', data.coordinates?.latitude);
            formData.append('longitude', data.coordinates?.longitude);
            formData.append('sauceId', _id); // Assuming item._id contains the sauceId

            // Append foodPairings
            data?.foodPairings.forEach(item => {
                formData.append('foodPairings', item);
            });

            // Perform the axios POST request
            const response = await axios.post(`${host}/checkin`, formData, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`, // Authorization header with token
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            });
            console.log("response.data===============>", response.data)
            const reviewedSauce = await axios.post(host + '/view-sauce', { sauceId: _id }, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,

                },
            });
            handleCheckedIn(reviewedSauce.data.sauce)

            // Handle successful response
            if (response?.data?.message) {
                setAlertModal({
                    open: true,
                    message: response?.data?.message,
                    success: true, // Success is true for a successful response,
                    buttonText: "View all check-ins",
                    cb: () => {
                        navigation.navigate('AllCheckinsScreen', { _id, routerNumber, fn, item, url, title, reviewCount, setReviewCount, handleIncreaseReviewCount, mycb, sauceType, handleLike })
                    }
                });

                // Reset form fields after successful submission
                setData({
                    description: "",
                    select: "",
                    location: "",
                    address: "",
                    coordinates: {},
                    foodPairings: []
                });

                setImageUris([]);
                setIsSelected(true);
                setIsClearChips(true)

                // Navigate back after successful check-in
                // setTimeout(() => {
                //   navigation.navigate('AllCheckinsScreen', { _id: item?._id, routerNumber, fn })
                // }, 2000);
            }
        } catch (error) {
            // Handle error response (e.g., 400 error)
            console.log("error==============>", JSON.stringify(error))
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || error.message,
                success: false, // Error, so success is false
            });
            console.log(error?.response?.data?.message)
            console.log(error?.message)
        } finally {
            // Always stop loading after request
            setLoading(false);
        }
    };
    const deleteImage = (index) => {
        setImageUris(prevUris => prevUris.filter((_, i) => i !== index));
    };

    

    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={false} cb={() => !loading && navigation.goBack()} showProfilePic={false} showDescription={false} title="Add Check-in" />
                    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>

                        <View style={{ alignItems: "center", gap: 20 }}>
                            <CustomInput
                                imageStyles={{ top: "4%", left: "4%", transform: [{ translateY: 10 }], width: scale(25), height: scale(25), aspectRatio: "1/1" }}

                                showImage={true}
                                multiline={true}
                                isURL={true}
                                uri={auth?.url}
                                localImage={true}
                                numberOfLines={5}
                                name="description"
                                onChange={handleText}
                                updaterFn={setData}
                                value={data.description}
                                showTitle={false}
                                placeholder="Description"
                                containterStyle={{
                                    width: "100%",
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    borderColor: "#FFA100",
                                    backgroundColor: "#2e210a",
                                    color: "white",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontSize: scale(14),
                                    padding: 15,
                                    textAlignVertical: 'top',
                                    paddingLeft: scale(50)

                                }} />
                            <CustomButtom
                                loading={isloading?.loadMap}
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

                                title={data?.address ? data?.address : "Address"}
                            />
                            <SelectableChips isClearChips={isClearChips} setData={setData} />
                            <View style={{
                                width: "100%",

                            }}>
                                <Text style={{
                                    fontSize: scale(18),
                                    color: "white"
                                }}>
                                    Choose image from
                                </Text>

                            </View>
                            <View style={{
                                width: "100%",
                                flexDirection: "row",
                                gap: scale(10)
                            }}>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => {
                                        setIsSelected(true)
                                        handleImagePickerPermission(true)
                                    }}
                                    style={{
                                        backgroundColor: isSelected ? '#FFA500' : '#2e210a', // Dark box for unselected chips
                                        borderRadius: scale(20),
                                        paddingVertical: scale(6),
                                        paddingHorizontal: scale(10),
                                        borderColor: '#FFA500', // Orange border for chips to match the theme
                                        borderWidth: scale(1),
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            color: isSelected ? '#000' : '#fff'
                                        }}
                                    >
                                        Camera
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => {
                                        setIsSelected(false)
                                        handleImagePickerPermission(false)
                                    }}
                                    style={{
                                        backgroundColor: isSelected ? '#2e210a' : '#FFA500', // Dark box for unselected chips
                                        borderRadius: scale(20),
                                        paddingVertical: scale(6),
                                        paddingHorizontal: scale(10),
                                        borderColor: '#FFA500', // Orange border for chips to match the theme
                                        borderWidth: scale(1),
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            color: isSelected ? '#fff' : '#000'
                                        }}
                                    >
                                        Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: "flex",
                                width: "100%",
                                flexWrap: "wrap",
                                flexDirection: "row",
                                gap: scale(20),
                                justifyContent: "center"
                            }}>
                                {imageUris.map((uri, index) => (
                                    <TouchableOpacity onPress={() => {
                                        setIsVisible(true)
                                        console.log("index==========================================>", index)
                                        setCurrentImageIndex(index)

                                    }}>
                                        <View style={{
                                            position: "relative"
                                        }}>
                                            <TouchableOpacity
                                                disabled={loading}
                                                onPress={async () => {
                                                    deleteImage(index)
                                                }}
                                                style={styles.closeButton}
                                            >
                                                <View style={styles.closeButtonInner}>
                                                    <X color="#fff" size={scale(15)} />
                                                </View>
                                            </TouchableOpacity>
                                            {/* <ImageView
                                                 images={imageUris.map(uri => ({ uri: uri.uri }))}
                                                imageIndex={index}
                                                visible={visible}
                                                onRequestClose={() => setIsVisible(false)}
                                            /> */}

                                            {/* <Lightbox
                                          disabled={loading}
                                            // springConfig={{ tension: 30, friction: 7 }}
                                            activeProps={{
                                                style: {
                                                    width: '100%',
                                                    height: scale(400),
                                                    borderColor: 'transparent',
                                                    borderWidth: 0,
                                                    borderRadius: 0,
                                                    opacity: loading ? 0 : 1,
                                                },
                                            }}
                                        > */}

                                            <Image key={`${index}_${uri?.uri}`} source={{ uri: uri?.uri }} style={{
                                                width: scale(100), borderColor: "#FFA100",
                                                borderWidth: 1, height: scale(100), borderRadius: scale(12)
                                            }} />

                                            {/* </Lightbox> */}

                                        </View>
                                    </TouchableOpacity>

                                ))}

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { handleImagePickerPermission(isSelected) }}
                                    style={{
                                        width: imageUris[0] ? scale(100) : "100%",

                                    }}>

                                    <View style={{
                                        minHeight: scale(100),

                                        borderColor: "#FFA100",
                                        borderWidth: 1,
                                        backgroundColor: "#2e210a",
                                        borderRadius: scale(12),
                                        width: "100%",
                                        marginBottom: scale(60),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderStyle: 'dashed'
                                    }}>
                                        <Text style={{
                                            fontSize: scale(16),
                                            lineHeight: scale(19),
                                            color: "white",
                                            fontWeight: 700
                                        }}>
                                            {imageUris[0] ? "+" : "Upload a picture"}
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                            </View>

                            <CustomButtom
                                disabled={loading}
                                loading={loading}
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(16) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                onPress={() => handleSubmit()}
                                title={"Submit"}
                            />
                            <View style={{
                                borderColor: "#FFA100", backgroundColor: "#2e210a"
                            }}>

                            </View>

                        </View>
                    </View>
                    <YesNoModal
                        modalVisible={alertModal.openYesNoModal}
                        setModalVisible={() => {
                            setAlertModal({
                                open: false,
                                message: "",
                                success: true,
                                openYesNoModal: false
                            })
                        }}
                        success={alertModal.success}
                        title={"Location Request"}
                        cb={alertModal.cb}

                    />

                    <CustomAlertModal
                        success={alertModal?.success}
                        title={alertModal?.message}
                        modalVisible={alertModal?.open}
                        buttonText={alertModal.buttonText}
                        cb={alertModal.cb || function () { }}
                        setModalVisible={() => setAlertModal({
                            open: false,
                            message: ""
                        })}
                    />
                    <YesNoModal
                        isQuestion={yesNoModal.isQuestion}
                        modalVisible={yesNoModal.open}
                        setModalVisible={() => {
                            setYesNoModal({
                                open: false,
                                message: "",
                                severity: true,
                            })
                            setIsLoading(prev => ({
                                ...prev,
                                loadMap: false
                            }))
                        }}
                        success={yesNoModal.severity}
                        title={yesNoModal.message}
                        cb={yesNoModal.cb}

                    />
                          <ImageView
                            imageIndex={currentImageIndex}
                        images={imageUris.map(uri => ({ uri: uri.uri }))}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                    />
                </ScrollView>
            </SafeAreaView>

        </ImageBackground>
    );
};

export default CheckinScreen;


const styles = StyleSheet.create({
    closeButton: {
        top: scale(10),
        position: "absolute",
        zIndex: 1,
        right: scale(10),
        zIndex: 11
    },
    closeButtonInner: {
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: scale(2),
        borderRadius: 100,
    },
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        backgroundColor: "#2e210a",
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: "#FFA100",
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontSize: scale(14)
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color: "#FFA100"
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#2e210a",
        borderColor: "#FFA100",
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: scale(14),
        fontWeight: '500',
        color: 'white',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});