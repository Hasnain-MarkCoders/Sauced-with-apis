import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, Alert, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import CustomRating from '../../components/CustomRating/CustomRating.jsx';
const AddReview = () => {
    const [isKeyBoard, setIsKeyBoard] = useState(false)
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

        // Cleanup function
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

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
                                     
                                        <TouchableOpacity style={{
                                            backgroundColor:"#2e210a",
                                            borderRadius:scale(10),
                                            paddingVertical:scale(13),
                                            paddingHorizontal:scale(10),
                                            borderColor:"#FFA100",
                                            borderWidth:1,
                                            flexDirection:"row",
                                            justifyContent:"space-between"
                                        }}>
                                            <Text style={{ fontSize: scale(16), color:"white" }}>
                                                Rating
                                            </Text>
                                            <CustomRating cb={(e)=>{setData(prev=>({...prev, rating:e}))}} size={12}/>
                                        </TouchableOpacity>
                                        <CustomButtom
                                            showIcon={false}
                                            buttonTextStyle={{ fontSize: scale(14) }}
                                            buttonstyle={{ width: "100%", marginTop: scale(60), borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                            // onPress={() => { Vibration.vibrate(10); Alert.alert("Review submitted."), navigation.navigate("AllReviews") }}
                                            onPress={() => { Vibration.vibrate(10); navigation.navigate("AllReviews") }}

                                            title={"Submit"}
                                        />
                                    </View>

                                </View>}

                            </View>

                        )
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default AddReview

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})