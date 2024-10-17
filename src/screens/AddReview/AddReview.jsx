import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Keyboard,
    Vibration,
    AppRegistry,
    Image,
    Platform,
    Linking,
    Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
// SwipeableRating
// import SwipeableRating from 'react-native-swipeable-rating';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios, { host } from '../../../Axios/useAxios.js';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// import { handleIncreaseReviewCountOfFeaturedSauce } from '../../../android/app/Redux/featuredSauces.js';
// import { handleIncreaseReviewCountOfListOneSauce } from '../../../android/app/Redux/saucesListOne.js';
// import { handleIncreaseReviewCountOfListTwoSauce } from '../../../android/app/Redux/saucesListTwo.js';
// import { handleIncreaseReviewCountOfListThreeSauce } from '../../../android/app/Redux/saucesListThree.js';
// import { handleIncreaseReviewCountOfFavoriteSauce } from '../../../android/app/Redux/favoriteSauces.js';
// import { handleIncreaseReviewCountOfCheckedInSauce } from '../../../android/app/Redux/checkedInSauces.js';
// import { handleIncreaseReviewCountOfTopRatedSauce } from '../../../android/app/Redux/topRatedSauces.js';
// import { handleReviewedSauces } from '../../../android/app/Redux/reviewedSauces.js';




import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { X } from 'lucide-react-native';
import Lightbox from 'react-native-lightbox-v2';
import ImageView from "react-native-image-viewing";
import SwipeableRating from '../../components/SwipeableRating/SwipeableRating.jsx';
import SimpleLevelSlider from '../../components/SimpleLevelSlider/SimpleLevelSlider.jsx';
import { handleIncreaseReviewCountOfFeaturedSauce } from '../../Redux/featuredSauces.js';
import { handleIncreaseReviewCountOfListOneSauce } from '../../Redux/saucesListOne.js';
import { handleIncreaseReviewCountOfListTwoSauce } from '../../Redux/saucesListTwo.js';
import { handleIncreaseReviewCountOfListThreeSauce } from '../../Redux/saucesListThree.js';
import { handleIncreaseReviewCountOfFavoriteSauce } from '../../Redux/favoriteSauces.js';
import { handleIncreaseReviewCountOfCheckedInSauce } from '../../Redux/checkedInSauces.js';
import { handleIncreaseReviewCountOfTopRatedSauce } from '../../Redux/topRatedSauces.js';
import { handleReviewedSauces } from '../../Redux/reviewedSauces.js';


const AddReview = () => {
    const route = useRoute();
    const [imageUris, setImageUris] = useState([]);
    const sauceId = route?.params?.sauceId;
    const sauceType = route?.params?.sauceType || ""
    const url = route?.params?.url || ""
    const title = route?.params?.title || ""
    const item = route?.params?.item || {}
    const mycb = route?.params?.mycb || function () { }
    const handleLike = route?.params?.handleLike || function () { }
    const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount || function () { }
    const setReviewCount = route?.params?.setReviewCount || function () { }
    const reviewCount = route?.params?.reviewCount || ""
    const [isSelected, setIsSelected] = useState(true)
    const [isKeyBoard, setIsKeyBoard] = useState(false);
    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(false);
    const progress = useSharedValue(1);
    const min = useSharedValue(0);
    const max = useSharedValue(10);
    const dispatch = useDispatch()
    const auth = useSelector(state => state?.auth);
    const featuredSauces = useSelector(state => state?.featuredSauces)
    const [visible, setIsVisible] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    console.log(auth?.token);
    const [yesNoModal, setYesNoModal] = useState({
        open: false,
        message: "",
        severity: "success",
        cb: () => { },
        isQuestion:false
    })
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: '',
        success: true,
        cb: () => { }
    });
    const [data, setData] = useState({
        review: '',
        rating: '1',
        heatLevel: 5,
    });
    const navigation = useNavigation();





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
                    isQuestion:true,

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
                    isQuestion:true,

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
            // maxWidth: 300,
            // maxHeight: 300,
            quality: 1,
            selectionLimit: 0,
        };

        const launchFunction = isSelected ? launchCamera : launchImageLibrary;
        launchFunction(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response?.error);
                Alert.alert('Error', 'Something went wrong while picking the image.');
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

    const handleUpdateReviewsCount = () => {
        if (sauceType == "toprated") {
            dispatch(handleIncreaseReviewCountOfTopRatedSauce(sauceId))
        }
        if (sauceType == "featured") {
            dispatch(handleIncreaseReviewCountOfFeaturedSauce(sauceId))
        }
        if (sauceType == "favourite") {
            dispatch(handleIncreaseReviewCountOfFavoriteSauce(sauceId))
        }
        if (sauceType == "checkedin") {
            dispatch(handleIncreaseReviewCountOfCheckedInSauce(sauceId))
        }
        if (sauceType == 1) {
            dispatch(handleIncreaseReviewCountOfListOneSauce(sauceId))
        }
        if (sauceType == 2) {
            dispatch(handleIncreaseReviewCountOfListTwoSauce(sauceId))
        }
        if (sauceType == 3) {
            dispatch(handleIncreaseReviewCountOfListThreeSauce(sauceId))
        }
    }
const handleReviewState = (data)=>{
    if(!!data){

        dispatch(handleReviewedSauces([data]))
    }
}

const handleRating = (rating)=>{
    setData(prev=>({...prev,rating}))
}
const handleSlider = (heatLevel)=>{
    setData(prev=>({...prev,heatLevel}))
}


    const handleSubmit = async () => {
        try {
            if (!data?.review) {
                return setAlertModal({
                    open: true,
                    message: 'Review is required!',
                    success: false

                });
            }
            if (!data?.rating) {
                return setAlertModal({
                    open: true,
                    message: 'Rating is required!',
                    success: false

                });
            }
            if (!data?.heatLevel) {
                return setAlertModal({
                    open: true,
                    message: 'Heat level is required!',
                    success: false

                });
            }
            if (data?.heatLevel<0.5) {
                return setAlertModal({
                    open: true,
                    message: 'Heat level at least 0.5',
                    success: false

                });
            }

            setLoading(true)
            const formData = new FormData();
            imageUris.forEach(imageUri => {
                console.log(imageUri.type);
                // You might need to provide an object with uri, type, and name depending on your backend requirements
                const file = {
                    uri: imageUri?.uri,
                    type: imageUri?.type, // assuming the type is JPEG; adjust as needed
                    name: imageUri?.uri?.split('/').pop(), // extract filename from URI
                };
                formData.append('images', file);
            });
            // formData.append('images', file);
            formData.append('heatLevel', data?.heatLevel);
            formData.append('text', data?.review);
            formData.append('star', data?.rating);
            formData.append('sauceId', sauceId);
            console.log("heatlevel =================>",  data?.rating)
            console.log("data?.heatLevel =================>", data?.heatLevel)

            const res = await axios.post(host + '/create-review', formData, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res?.data && res?.data?.message) {
                // mycb(prev => {
                //     // Return the updated state
                //     return prev.map(item => {
                //       if (item?._id === sauceId) {
                //         // Update the matched item with new reviewCount
                //         return { ...item, reviewCount: item.reviewCount + 1 };
                //       } else {
                //         // Return the unchanged item
                //         return item;
                //       }
                //     });
                //   });
                const reviewedSauce = await axios.post(host + '/view-sauce', {sauceId}, {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                       
                    },
                });
                handleReviewState(reviewedSauce.data.sauce)
              
                handleIncreaseReviewCount(sauceId, setReviewCount, reviewCount)
                setAlertModal({
                    open: true,
                    message: res?.data?.message,
                    success: true,
                    buttonText: "View Reviews",
                    cb: () => {
                        navigation.navigate("AllReviews",
                            {
                                _id: sauceId,
                                // setReviewCount, handleIncreaseReviewCount , reviewCount, product, mycb
                                item, title, url, sauceType, mycb, handleIncreaseReviewCount, setReviewCount, reviewCount, handleLike
                            })
                    }

                });
                handleUpdateReviewsCount()


                setData({
                    review: '',
                    rating: '1',
                    heatLevel: 5,
                });
                progress.value = 0
                setImageUris([]);
                // setTimeout(()=>{
                // navigation.goBack();
                // },2000)
            }
        } catch (error) {
            return setAlertModal({
                open: true,
                message: error.message,
                success: false

            });
        } finally {
            setLoading(false)
        }
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

    const deleteImage = (index) => {
        setImageUris(prevUris => prevUris.filter((_, i) => i !== index));
    };


    return (
        <ImageBackground
            style={{ flex: 1, width: '100%', height: '100%' }}
            source={home}>
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingBottom: isKeyBoard ? 0 : verticalScale(0),
                    position: 'relative',
                }}>
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
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{
                                    flex: 1,

                                    paddingHorizontal: scale(20),
                                }}>
                                {index == 0 && (
                                    <View
                                        style={{
                                            marginBottom: scale(20),
                                        }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: scale(35),
                                                lineHeight: scale(50),
                                                marginBottom: scale(20),
                                            }}>
                                            Add Review
                                        </Text>
                                        <View
                                            style={{
                                                gap: scale(20),
                                            }}>
                                            <CustomInput
                                                multiline={true}
                                                numberOfLines={5}
                                                name="review"
                                                onChange={handleText}
                                                updaterFn={setData}
                                                value={data.review}
                                                showTitle={false}
                                                placeholder="Write a Review"
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: '#FFA100',
                                                    borderWidth: 1,
                                                    backgroundColor: '#2e210a',
                                                    color: 'white',
                                                    borderRadius: 10,
                                                    fontSize: scale(14),
                                                    padding: 15,
                                                    textAlignVertical: 'top',
                                                }}
                                            />
                                            <View style={{
                                                gap: scale(30)
                                            }}>

                                                <View style={{
                                                    gap: scale(50),
                                                    // backgroundColor:"red"
                                                }}>

                                                        <SwipeableRating
                                                        cb={handleRating}
                                                        />
                                                      
                                                    {/* <SwipeableRating
                                                    swipeable={true}
                                                        rating={data.rating}
                                                        allowHalves={true}
                                                        style={{
                                                            margin: 'auto',
                                                        }}
                                                        size={50}
                                                        color="#FFA100"
                                                        emptyColor="#FFA100"
                                                        gap={10}
                                                        onSwipe={(e)=>{
                                                            console.log(e)
                                                        }}
                                                        onPress={e => {
                                                            setData(prev => ({ ...prev, rating: e }));
                                                        }}
                                                        xOffset={30}
                                                    /> */}
                                                    <View style={{
                                                        gap: scale(20)
                                                    }}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-end',
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: scale(20),
                                                                }}>
                                                                Heat Level
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}>
                                                                <View
                                                                    style={{
                                                                        backgroundColor: '#2e210a',
                                                                        borderColor: '#FFA100',
                                                                        borderWidth: 1,
                                                                        alignItems:"center",
                                                                        justifyContent:"center",
                                                                        width:scale(50),
                                                                        height:scale(50),
                                                                        borderRadius: scale(10),
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            color: 'white',
                                                                            fontSize: scale(20),
                                                                            textAlign: 'center',
                                                                        }}>
                                                                        {data.heatLevel}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {/* <Slider
                                                        step={10}
                                                        snapToStep={true}
                                                            heartbeat={false}
                                                            onSlidingComplete={e => {
                                                                setData(prev => ({
                                                                    ...prev,
                                                                    heatLevel: e.toFixed(2),
                                                                }));
                                                            }}
                                                            theme={{
                                                                disableMinTrackTintColor: '#FFA100',
                                                                maximumTrackTintColor: '#FFA100',
                                                                minimumTrackTintColor: '#FFA100',
                                                                cacheTrackTintColor: '#FFA100',
                                                                bubbleBackgroundColor: '#FFA100',
                                                                heartbeatColor: '#FFA100',
                                                            }}
                                                            progress={progress}
                                                            minimumValue={min}
                                                            maximumValue={max}


                                                        /> */}

{/* <Slider
      step={10}
      snapToStep={true}
      onSlidingComplete={(e)=>{
        setData(prev => ({
            ...prev,
            heatLevel: Math.round(e),
        }));
      }} // Use onValueChange instead of onSlidingComplete for smoother interaction
      theme={{
        disableMinTrackTintColor: '#FFA100',
        maximumTrackTintColor: '#FFA100',
        minimumTrackTintColor: '#FFA100',
        cacheTrackTintColor: '#FFA100',
        bubbleBackgroundColor: '#FFA100',
        heartbeatColor: '#FFA100',
        thumbTintColor: '#FFA100', // Change thumb color to match track
        trackWidth: 5, // Adjust track width if needed
        thumbWidth: 20, // Adjust thumb size for better visibility
        trackTintColor: 'transparent', // Make the track background transparent to hide dots
        disableTrackTintColor: 'transparent', // Hide the inactive part of the track
      }}
      minimumValue={min} // Define your min and max values
      maximumValue={max}
      progress={progress}
      value={data.heatLevel||1} // Use 'value' prop to control the slider's value
    /> */}

<SimpleLevelSlider
                                                        cb={handleSlider}
                                                        />


    
                                                    </View>
                                                </View>
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
                                                <View
                                                    style={{
                                                        width: 'flex',
                                                        width: '100%',
                                                        flexWrap: 'wrap',
                                                        flexDirection: 'row',
                                                        gap: scale(20),
                                                        justifyContent: 'center',
                                                    }}>
                                                    {imageUris.map((uri, index) => (

<TouchableOpacity onPress={()=>{
    setIsVisible(true)
    setCurrentImageIndex(index)

}}>
    {/* <ImageView
  images={[{ uri:  uri?.uri  }]}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => setIsVisible(false)}
/> */}

                                                        <View  style={{
                                                            position: "relative"
                                                        }}>
                                                            <View style={styles.closeButton}>

                                                            <TouchableOpacity
                                                            disabled={loading}
                                                            style={
                                                                styles.closeButtonInner
                                                            }
                                                                onPress={async () => {
                                                                    deleteImage(index)
                                                                }}
                                                            >
                                                                
                                                                    <X color="#fff" size={scale(15)} />
                                                            </TouchableOpacity>
                                                            </View>
{/* 
                                                            <Lightbox
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

                                                                <Image
                                                                    key={index}
                                                                    source={{ uri: uri?.uri }}
                                                                    style={{
                                                                        width: scale(100),
                                                                        borderColor: '#FFA100',
                                                                        borderWidth: 1,
                                                                        height: scale(100),
                                                                        borderRadius: scale(12),
                                                                    }}
                                                                />

                                                            {/* </Lightbox> */}

                                                        </View>
                                                        </TouchableOpacity>

                                                    ))}
                                                    <TouchableOpacity
                                                    disabled={loading}
                                                        onPress={() => {
                                                            handleImagePickerPermission(isSelected)
                                                        }}
                                                        style={{
                                                            width: imageUris[0]?.uri ? scale(100) : '100%',
                                                        }}>
                                                        <View
                                                            style={{
                                                                minHeight: scale(100),
                                                                paddingHorizontal: scale(20),
                                                                borderColor: '#FFA100',
                                                                borderWidth: 1,
                                                                backgroundColor: '#2e210a',
                                                                borderRadius: scale(12),
                                                                width: '100%',
                                                                marginBottom: scale(60),
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderStyle: 'dashed',
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    fontSize: scale(16),
                                                                    lineHeight: scale(19),
                                                                    color: 'white',
                                                                    fontWeight: 700,
                                                                }}>
                                                                {imageUris[0]?.uri ? '+' : 'Upload a picture'}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                // position: 'absolute',
                                                bottom: scale(20),
                                                width: '100%',
                                                // paddingHorizontal: scale(20),
                                            }}>
                                            <CustomButtom
                                                disabled={loading}
                                                showIcon={false}
                                                buttonTextStyle={{ fontSize: scale(14) }}
                                                buttonstyle={{
                                                    width: '100%',
                                                    // marginTop: scale(60),
                                                    borderColor: '#FFA100',
                                                    backgroundColor: '#2e210a',
                                                    // paddingHorizontal: scale(15),
                                                    paddingVertical: scale(13),
                                                    display: 'flex',
                                                    gap: 10,
                                                    flexDirection: 'row-reverse',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                loading={loading}
                                                onPress={handleSubmit}
                                                title={'Submit'}
                                            />
                                        </View>
                                    </View>
                                )}

                            </View>
                        );
                    }}
                />

                {/* <View
                    style={{
                        // position: 'absolute',
                        bottom: scale(20),
                        width: '100%',
                        paddingHorizontal: scale(20),
                        backgroundColor:"red"
                    }}>
                    <CustomButtom
                        disabled={loading}
                        showIcon={false}
                        buttonTextStyle={{ fontSize: scale(14) }}
                        buttonstyle={{
                            width: '100%',
                            marginTop: scale(60),
                            borderColor: '#FFA100',
                            backgroundColor: '#2e210a',
                            paddingHorizontal: scale(15),
                            paddingVertical: scale(13),
                            display: 'flex',
                            gap: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        loading={loading}
                        onPress={handleSubmit}
                        title={'Submit'}
                    />
                </View> */}
                <YesNoModal
                  isQuestion= {yesNoModal.isQuestion}
                    modalVisible={yesNoModal.open}
                    setModalVisible={() => {
                        setYesNoModal({
                            open: false,
                            messsage: "",
                            severity: true,
                        })
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
            </SafeAreaView>
            <CustomAlertModal
                title={alertModal?.message}
                success={alertModal?.success}
                modalVisible={alertModal?.open}
                buttonText={alertModal.buttonText}
                cb={alertModal.cb || function () { }}
                setModalVisible={() =>
                    setAlertModal({
                        open: false,
                        messsage: '',
                    })

                }
            />
        </ImageBackground>
    );
};

export default AddReview;

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    },
    closeButton: {
        top: scale(10),
        position: "absolute",
        zIndex: 111,
        right: scale(10),
    },
    closeButtonInner: {
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: scale(2),
        borderRadius: 100,
    },
});
