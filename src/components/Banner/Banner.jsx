import { Linking, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import banner from "./../../../assets/images/banner.png";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import CustonPlayIcon from '../CustonPlayIcon/CustonPlayIcon';
const screenWidth = Dimensions.get('window').width;
const Banner = ({
    url = "",
    infoText = "",
    showText = true,
    title = "",
    cb = () => { },
    videoId = "",
    event = {},
    showOverlay=false,
    isInterested=false
}) => {
    const [tempIsInterested, setTempIsInterested] = useState(false)
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={{
            width: "100%",
        }} activeOpacity={.9} onPress={() => { !showText && navigation.navigate("Youtube", { url, title, videoId }) }}>
            <ImageBackground
                borderRadius={10}
                style={{
                    minHeight: scale(130),
                    position: "relative",
                }}
                source={{ uri: url }}
            >

                    {showOverlay &&<View style={styles.overlay}></View>}
                {
                    showText?
                    <View style={{ paddingVertical: scale(10),paddingHorizontal: scale(10), gap: scale(5),flex:1,justifyContent:"space-between" }}>
                        <View>
                            <Text style={[styles.bannerText, {
                                color: 'white',
                                fontSize: 24,
                                fontWeight: 'bold',
                                textShadowColor: 'rgba(0, 0, 0, 1)',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 10
                            }]}>{event?.eventName}</Text>
                            <View style={{
                                gap: scale(10)
                            }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: scale(10),
                                    lineHeight: scale(13),
                                    fontFamily: "Montserrat",
                                    maxWidth: "80%",
                                    fontWeight: '700',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textShadowColor: 'rgba(0, 0, 0, 1)',
                                    textShadowOffset: { width: 1, height: 1 },
                                    textShadowRadius: 10

                                }}>

                                    {event?.venueDescription}

                                </Text>
                            
                            </View>
                        </View>
                        <View style={{
                                flexDirection: "row",
                                gap: scale(10),
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("EventPage", { event })
                                    }}
                                    style={{
                                        paddingHorizontal: scale(10),
                                        paddingVertical: scale(6),
                                        backgroundColor: "white",
                                        borderRadius: scale(5),
                                        elevation: scale(5)
                                    }}>
                                    <Text style={{
                                        color: "black",
                                        fontWeight: "700"

                                    }}>Details</Text>


                                </TouchableOpacity>
                                <TouchableOpacity

                                    onPress={()=>{cb(event); setTempIsInterested(prev=>!prev)}}
                                    style={{
                                        paddingHorizontal: scale(10),
                                        paddingVertical: scale(6),

                                        backgroundColor: "white",
                                        borderRadius: scale(5),
                                    }}>
                                    <Text style={{
                                        color: "black",
                                        fontWeight: "700"


                                    }}>{isInterested || tempIsInterested?"Disinterested":"Interested"}</Text>


                                </TouchableOpacity>
                            </View>
                    </View>
                    :
                    <View style={{
                        width:"100%",
                        height:"100%"
                    }}>
                        <CustonPlayIcon/>
                        </View>}

            </ImageBackground>
        </TouchableOpacity>

    )
}

export default Banner

const styles = StyleSheet.create({
    overlay:{
         backgroundColor: 'rgba(0, 0, 0, .5)',
         width:"100%",
         height:"100%",
         borderRadius:scale(10),
         position:"absolute",
    },
    mainBanner: {
        position: "relative",
        gap: verticalScale(10),
        minWidth: verticalScale(250),
    },
    bannerContainer: {
        position: "relative",
        width: "100%",
        height: scale(130),
        gap: verticalScale(10),
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        borderRadius: scale(10),
    },
    // bannerTextContainer: {
    //     // position: "absolute",
    //     backgroundColor:"red",
    //     // top: "50%",
    //     // left: "10%",
    //     // transform: [{ translateY: -25 }, { translateX: -10 }],
    // },
    bannerText: {
        color: "white",
        fontSize: scale(23),
        fontWeight: '700',
        // mixBlendMode:"differnce"

    }
})