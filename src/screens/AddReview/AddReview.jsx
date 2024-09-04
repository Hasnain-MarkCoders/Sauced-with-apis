import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, Vibration, AppRegistry } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import SwipeableRating from 'react-native-swipeable-rating';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
const AddReview = () => {
    const route = useRoute()
    const sauceId = route?.params?.sauceId
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const axiosInstance = useAxios()
    const [loading , setLoading] = useState(false)
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(100);
    // const []
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    })
    const [data, setData] = useState({
        review: "",
        rating: ""
    });
    const navigation = useNavigation()
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
    const handleSubmit = async() => {
        try{
            Vibration.vibrate(10)
            setLoading(true)
            Vibration.vibrate(10)
            if (!data?.review) {
                return setAlertModal({
                    open: true,
                    message: "Review is required!"
                })
            }
            else if (!data?.rating) {
                return setAlertModal({
                    open: true,
                    message: "Rating is required!"
                })
            }
            const response = await axiosInstance.post("/create-review", {sauceId, star:data?.rating, text:data?.review});
            if(response && response?.data &&  response?.data?.message){
                setAlertModal({
                    open: true,
                    message: response?.data.message
                })
                setData({})
            }

        }catch(error){
            console.log(error)
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || "An error occurred. Please try again."
            });
        }finally{
            setLoading(false)
        }

     
    }


    useEffect(()=>{
        console.log(progress)
    },[progress])
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
                <Header
                    showMenu={false}

                    cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} title={"Followers"} showText={false} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                flex: 1,

                                paddingHorizontal: scale(20)

                            }}>
                                {index == 0 && <View style={{
                                    marginBottom: scale(20)
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(35),
                                        lineHeight: scale(50),
                                        marginBottom: scale(20)
                                    }}>
                                        Add Review
                                    </Text>
                                    <View style={{
                                        gap: scale(20)
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
                                                borderColor: "#FFA100",
                                                backgroundColor: "#2e210a",
                                                color: "white",
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                fontSize: scale(14),
                                                padding: 15,
                                                textAlignVertical: 'top',

                                            }} />

                                        <SwipeableRating
                                            rating={data.rating}
                                            allowHalves={true}
                                            style={{
                                                margin:"auto"
                                            }}
                                            size={50}
                                            color='#FFA100'
                                            emptyColor='#FFA100'
                                            gap={4}
                                            onPress={(e) => { setData(prev => ({ ...prev, rating: e })) }}
                                            xOffset={30}
                                        />





                                    <Slider
                                    heartbeat={true}
                                    onValueChange={(e)=>{console.log(Math.round(e))}}
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


                                        <CustomButtom
                                            showIcon={false}
                                            buttonTextStyle={{ fontSize: scale(14) }}
                                            buttonstyle={{ width: "100%", marginTop: scale(60), borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                            loading={loading}
                                            onPress={handleSubmit}

                                            title={"Submit"}
                                        />
                                    </View>

                                </View>}

                            </View>

                        )
                    }}
                />
            </SafeAreaView>
            <CustomAlertModal
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        open: false,
                        messsage: ""
                    })}
                />
        </ImageBackground>
    )
}

export default AddReview

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})