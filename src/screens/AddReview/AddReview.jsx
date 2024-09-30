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
import SwipeableRating from 'react-native-swipeable-rating';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios, { host } from '../../../Axios/useAxios.js';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { handleIncreaseReviewCountOfFeaturedSauce } from '../../../android/app/Redux/featuredSauces.js';
import { handleIncreaseReviewCountOfListOneSauce } from '../../../android/app/Redux/saucesListOne.js';
import { handleIncreaseReviewCountOfListTwoSauce } from '../../../android/app/Redux/saucesListTwo.js';
import { handleIncreaseReviewCountOfListThreeSauce } from '../../../android/app/Redux/saucesListThree.js';
import { handleIncreaseReviewCountOfFavoriteSauce } from '../../../android/app/Redux/favoriteSauces.js';
import { handleIncreaseReviewCountOfCheckedInSauce } from '../../../android/app/Redux/checkedInSauces.js';
import { handleIncreaseReviewCountOfTopRatedSauce } from '../../../android/app/Redux/topRatedSauces.js';
const AddReview = () => {
    const route = useRoute();
    const [imageUris, setImageUris] = useState([]);
    const sauceId = route?.params?.sauceId;
    const sauceType = route?.params?.sauceType;
    const mycb = route?.params?.mycb || function(){};
    const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount || function(){};
    const setReviewCount = route?.params?.setReviewCount || function(){};
    const reviewCount = route?.params?.reviewCount 





    const [isKeyBoard, setIsKeyBoard] = useState(false);
    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(false);
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(10);
    const dispatch = useDispatch()
    const auth = useSelector(state => state?.auth);
    const featuredSauces = useSelector(state=>state?.featuredSauces)
    
    console.log(auth?.token);
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: '',
        success:true
    });
    const [data, setData] = useState({
        review: '',
        rating: '',
        heatLevel: 0,
    });
    const navigation = useNavigation();

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            // maxWidth: 300,
            // maxHeight: 300,
            quality: 1,
            selectionLimit: 0,
        };

        launchImageLibrary(options, response => {
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

const handleUpdateReviewsCount = ()=>{
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



    const handleSubmit = async () => {
        try {
            if (!data?.review) {
               return setAlertModal({
                    open: true,
                    message: 'Review is required!',
                    success:false

                });
            }
            if (!data?.rating) {
               return setAlertModal({
                    open: true,
                    message: 'Rating is required!',
                    success:false

                });
            }
            if (!data?.heatLevel) {
                return setAlertModal({
                     open: true,
                     message: 'Heat level is required!',
                     success:false

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
                handleIncreaseReviewCount(sauceId, setReviewCount, reviewCount)
                setAlertModal({
                    open: true,
                    message: res?.data?.message,
                    success:true

                });
                handleUpdateReviewsCount()
                
                
                setData({
                    review: '',
                    rating: '',
                    heatLevel: 0,
                });
                progress.value=0
                setImageUris([]);
                setTimeout(()=>{
                navigation.goBack();
                },2000)
            }
        } catch (error) {
            return setAlertModal({
                open: true,
                message: error.message,
                success:false

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
                    data={[1, 1]}
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
                                                gap:scale(30)
                                            }}>

                                            <View style={{
                                                gap:scale(50)
                                            }}>


                                            <SwipeableRating
                                                rating={data.rating}
                                                allowHalves={true}
                                                style={{
                                                    margin: 'auto',
                                                }}
                                                size={50}
                                                color="#FFA100"
                                                emptyColor="#FFA100"
                                                gap={4}
                                                onPress={e => {
                                                    setData(prev => ({ ...prev, rating: e }));
                                                }}
                                                xOffset={30}
                                            />
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
                                                                paddingVertical: scale(10),
                                                                paddingHorizontal: scale(20),

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
                                                <Slider
                                                    heartbeat={false}
                                                    onSlidingComplete={e => {
                                                        setData(prev => ({
                                                            ...prev,
                                                            heatLevel: Math.round(e),
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
                                                />
                                            </View>
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
                                                ))}
                                                <TouchableOpacity
                                                    onPress={handleImagePicker}
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
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />

                <View
                    style={{
                        position: 'absolute',
                        bottom: scale(20),
                        width: '100%',
                        paddingHorizontal: scale(20),
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
                </View>
            </SafeAreaView>
            <CustomAlertModal
                title={alertModal?.message}
                success={alertModal?.success}
                modalVisible={alertModal?.open}
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
});
