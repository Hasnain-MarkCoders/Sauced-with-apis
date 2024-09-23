import React, {   useEffect, useState } from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, Alert, Image, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import {  useSelector } from 'react-redux';
import { handleText } from '../../../utils.js';
import useAxios, { host } from '../../../Axios/useAxios';
import { launchImageLibrary, launchCamera  } from 'react-native-image-picker';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
// import user from "./../../../assets/images/user.png"
import locationIcon from "./../../../assets/images/locationIcon.png"
import arrow from "./../../../assets/images/arrow.png";

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SelectableChips from '../../components/FoodPairing/FoodPairing.jsx';
import ChoiceModal from '../../components/ChoiceModal/ChoiceModal.jsx';
const CheckinScreen = () => {
    const axiosInstance = useAxios()
    const route = useRoute()
    const product = route?.params?.product
    const fn = route?.params?.fn 
    const routerNumber = route?.params?.routerNumber
    const photo = route?.params?.photo
    const auth = useSelector(state => state.auth)
    const [isSelected, setIsSelected] = useState(true)
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [imageUris, setImageUris] = useState(photo?.uri?[photo]:[]);
 
    const [isloading, setIsLoading] = useState({
        submitForm: false,
        loadMap: false
    })
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: "",
        success:true
    })
 
    const [data, setData] = useState({
        description: "",
        select: "", 
        location:"",
        address:"",
        coordinates:{},
        foodPairings:[]
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
                navigation.navigate("Map", {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    fn: handleEventCoords
                });
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            (error) => {
                Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
                setIsLoading(prev => ({ ...prev, loadMap: false })) // Stop loading indicator
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
        );
    };



    const handleEventCoords = (coords) => {
        setData(prev => ({ ...prev, ["address"]: coords?.destination, ["coordinates"]: { latitude: coords?.latitude, longitude: coords?.longitude } }))
    }

    // const handleImagePicker = () => {
    //     const options = {
    //         mediaType: 'photo',
    //         quality: 1,
    //         selectionLimit: 0, // Allows multiple selection
    //     };
    
    //     launchImageLibrary(options, response => {
    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         } else if (response.error) {
    //             console.log('ImagePicker Error: ', response?.error);
    //             Alert.alert('Error', 'Something went wrong while picking the image.');
    //         } else {
    //             const sources = response.assets.map(asset => ({
    //                 uri: asset?.uri,
    //                 type: asset?.type,
    //                 name: asset?.fileName,
    //             }));
    
    //             setImageUris(prevUris => [...prevUris, ...sources]);
    //         }
    //     });
    // };

    const handleImagePickerWithCamera = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 0, // Allows multiple selection
        };
    
        launchCamera(options, response => {
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
                const sources = response.assets.map(asset => ({
                    uri: asset?.uri,
                    type: asset?.type,
                    name: asset?.fileName,
                }));
    
                setImageUris(prevUris => [...prevUris, ...sources]);
            }
        });
    };
    
    const handleImagePicker = () => {
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
                const sources = response.assets.map(asset => ({
                    uri: asset?.uri,
                    type: asset?.type,
                    name: asset?.fileName,
                }));
    
                setImageUris(prevUris => [...prevUris, ...sources]);
            }
        });
    };
    
    // const handleSubmit = async () => {
    //     try {
    //         // Input validations
    //         if (!data?.description) {
    //             return setAlertModal({
    //                 open: true,
    //                 message: 'Description is required!',
    //                 success: false
    //             });
    //         }
    
    //         if (!data.coordinates?.latitude || !data.coordinates?.longitude || !data?.address) {
    //             return setAlertModal({
    //                 open: true,
    //                 message: 'Location is required!',
    //                 success: false
    //             });
    //         }
    
    //         // Set loading state
    //         setLoading(true);

    //         // Create FormData to send
    //         const formData = new FormData();
    
    //         // Append each image to the FormData object
    //         imageUris.forEach((imageUri, index) => {
    //             formData.append('images', {
    //                 uri: imageUri.uri,
    //                 type: imageUri.type, // Use JPEG as default type if not provided
    //                 name: imageUri.uri.split('/').pop() // Extract the file name from the URI
    //             });
    //         });
    
    //         // Append other fields (description, coordinates, sauceId)
    //         formData.append('text', data?.description);
    //         formData.append('latitude', data.coordinates?.latitude);
    //         formData.append('longitude', data.coordinates?.longitude);
    //         formData.append('sauceId', product?._id); // Assuming product._id contains the sauceId
    //         data?.foodPairings.forEach(item=>{
    //             formData.append("foodPairings",item)
    //         })


    
    //         // Perform the axios POST request
    //         const response = await axios.post(`${host}/checkin`, formData, {
    //             headers: {
    //                 Authorization: `Bearer ${auth?.token}`, // Authorization header with token
    //                 'Content-Type': 'multipart/form-data', // Set the content type
    //             },
    //         });
    
    //         // Handle successful response
    //         if (response?.data?.message) {
    //             setAlertModal({
    //                 open: true,
    //                 message: response?.data?.message,
    //                 success: true
    //             });
    
    //             // Reset form fields after successful submission
    //             setData({
    //                 description: '',
    //                 location: ''
    //             });
    
    //             setImageUris([]);
    
    //             // Navigate back after successful check-in
    //             setTimeout(() => {
    //                 navigation.navigate("AllCheckinsScreen", { _id: product?._id, routerNumber });
    //             }, 2000);
    //         }
    //     } catch (error) {
    //         // Handle error response (e.g., 400 error)
    //         setAlertModal({
    //             open: true,
    //             message: error?.response?.data?.message || error.message,
    //             success: false
    //         });
    //     } finally {
    //         // Always stop loading after request
    //         setLoading(false);
    //     }
    // };

    // const handleSubmit = async () => {
    //     try {
    //         // Input validations
    //         if (!data?.description) {
    //             return setAlertModal({
    //                 open: true,
    //                 message: 'Description is required!',
    //                 success: false,
    //             });
    //         }
    
    //         if (!data.coordinates?.latitude || !data.coordinates?.longitude || !data?.address) {
    //             return setAlertModal({
    //                 open: true,
    //                 message: 'Location is required!',
    //                 success: false,
    //             });
    //         }
    
    //         // Set loading state
    //         setLoading(true);
    
    //         // Create FormData to send
    //         const formData = new FormData();
    //         // Append each image to the FormData object
    //         imageUris.forEach((imageUri, index) => {
    //             formData.append('images', {
    //                 uri: imageUri.uri,
    //                 // type: imageUri.type, // Use JPEG as default type if not provided
    //                 type:"image/JPEG",
    //                 // name: imageUri.uri.split('/').pop(), // Extract the file name from the URI
    //                 name :imageUri.name
    //             });
    //         });
    
    //         // Append other fields (description, coordinates, sauceId)
    //         formData.append('text', data?.description);
    //         formData.append('latitude', data.coordinates?.latitude);
    //         formData.append('longitude', data.coordinates?.longitude);
    //         formData.append('sauceId', product?._id); // Assuming product._id contains the sauceId
    
    //         // Append foodPairings
    //         data?.foodPairings.forEach(item => {
    //             formData.append('foodPairings', item);
    //         });
    
    //         // Perform the axios POST request
    //         const response = await axios.post(`${host}/checkin`, formData, {
    //             headers: {
    //                 Authorization: `Bearer ${auth?.token}`, // Authorization header with token
    //                 'Content-Type': 'multipart/form-data', // Set the content type
    //             },
    //         });
    
    //         // Handle successful response
    //         if (response?.data?.message) {
    //             setAlertModal({
    //                 open: true,
    //                 message: response?.data?.message,
    //                 success: true, // Success is true for a successful response
    //             });
    
    //             // Reset form fields after successful submission
    //             setData({
    //                 description: '',
    //                 location: '',
    //             });
    
    //             setImageUris([]);
    
    //             // Navigate back after successful check-in
    //             setTimeout(() => {
    //                 navigation.navigate('AllCheckinsScreen', { _id: product?._id, routerNumber , fn});
    //             }, 2000);
    //         }
    //     } catch (error) {
    //         // Handle error response (e.g., 400 error)
    //         setAlertModal({
    //             open: true,
    //             message: error?.response?.data?.message || error.message,
    //             success: false, // Error, so success is false
    //         });
    //     } finally {
    //         // Always stop loading after request
    //         setLoading(false);
    //     }
    // };
    
 
// CheckinScreen.js

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
  
      if (!data.coordinates?.latitude || !data?.coordinates?.longitude || !data?.address) {
        return setAlertModal({
          open: true,
          message: 'Location is required!',
          success: false,
        });
      }
  
      // Set loading state
      setLoading(true);

      // Create FormData to send
      const formData = new FormData();
  
      // Log imageUris for debugging
      console.log("Submitting images:", imageUris);
  
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
      formData.append('sauceId', product?._id); // Assuming product._id contains the sauceId
  
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
  
      // Handle successful response
      if (response?.data?.message) {
        setAlertModal({
          open: true,
          message: response?.data?.message,
          success: true, // Success is true for a successful response
        });
  
        // Reset form fields after successful submission
        setData({
            description: "",
            select: "", 
            location:"",
            address:"",
            coordinates:{},
            foodPairings:[]
        });
  
        setImageUris([]);
  
        // Navigate back after successful check-in
        setTimeout(() => {
          navigation.navigate('AllCheckinsScreen', { _id: product?._id, routerNumber, fn });
        }, 2000);
      }
    } catch (error) {
      // Handle error response (e.g., 400 error)
      setAlertModal({
        open: true,
        message: error?.response?.data?.message || error.message,
        success: false, // Error, so success is false
      });
      console.log(error?.response?.data?.message)
      console.log( error?.message)
    } finally {
      // Always stop loading after request
      setLoading(false);
    }
  };
  

    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={false} cb={() => navigation.goBack()} showProfilePic={false} showDescription={false} title="Add Check-in" />
                    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>

                        <View style={{ alignItems: "center", gap: 20 }}>
                            <CustomInput
                imageStyles={{top:"4%", left:"4%", transform: [{ translateY: 10 }], width:scale(25), height:scale(25), aspectRatio:"1/1"}}

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
                                alignItems: "center", justifyContent:isloading?.loadMap?"center": "space-between"
                            }}
                            onPress={checkLocationServiceAndNavigate}

                            title={data?.address ? data?.address : "Address"}
                        />
                          <SelectableChips setData={setData}/>
                          <View style={{
                            width:"100%",

                          }}>
                            <Text style={{
                                fontSize:scale(18),
                                color:"white"
                            }}>
                                Choose image from 
                            </Text>

                          </View>
                          <View style={{
                            width:"100%",
                            flexDirection:"row",
                            gap:scale(10)
                          }}>
                                    <TouchableOpacity 
                                    
                                    onPress={()=>{setIsSelected(true)}}
                                    style={{
    backgroundColor: isSelected?'#FFA500':'#2e210a', // Dark box for unselected chips
    borderRadius: scale(20),
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderColor: '#FFA500', // Orange border for chips to match the theme
    borderWidth: scale(1),
    alignItems: 'center',
  }}>
                                        <Text
                                        style={{
                                            color:isSelected?'#000':'#fff'
                                        }}
                                        >
                                            Camera
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    
                                    onPress={()=>{setIsSelected(false)}}
                                    style={{
    backgroundColor: isSelected? '#2e210a':'#FFA500', // Dark box for unselected chips
    borderRadius: scale(20),
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderColor: '#FFA500', // Orange border for chips to match the theme
    borderWidth: scale(1),
    alignItems: 'center',
  }}>
                                        <Text
                                         style={{
                                            color:isSelected?'#fff':'#000'
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
                                    <Image key={index} source={{ uri: uri?.uri }} style={{
                                        width: scale(100), borderColor: "#FFA100",
                                        borderWidth: 1, height: scale(100), borderRadius: scale(12)
                                    }} />
                                ))}
                               
                                <TouchableOpacity

                                    onPress={handleImagePicker}
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
             
                    <CustomAlertModal
                     success={alertModal?.success}
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        open: false,
                        messsage: ""
                    })}
                />
           
                </ScrollView>
            </SafeAreaView>
       
        </ImageBackground>
    );
};

export default CheckinScreen;


const styles = StyleSheet.create({
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
        fontSize:scale(14)
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color:"#FFA100"
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