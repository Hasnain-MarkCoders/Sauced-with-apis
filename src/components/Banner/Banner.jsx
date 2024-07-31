import { Linking, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import banner from "./../../../assets/images/banner.png";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
const Banner = ({
    url = "",
    infoText = "",
    showText = true,
    title = "",
    cb = () => { }
}) => {

  
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={{
            
            width:scale(screenWidth - 90),
            borderRadius:scale(10),
            borderWidth:.5,
            borderColor:"#FFA100",
            marginRight:scale(20)
        }} activeOpacity={.8} onPress={() => { !showText && navigation.navigate("Youtube", { url, title }) }}>

            <ImageBackground
            borderRadius={10}
            style={{
            minHeight:scale(130),

            }}
                // imageStyle={{ borderRadius: 15, width:"100%", height:scale(130) }}
                // source={{ uri: url }}
                source={  url }

                
                
                >
                {
                    showText && <View style={{ paddingVertical: scale(5), paddingHorizontal: scale(20), gap: scale(5) }}>
                        <Text style={styles.bannerText}>Hot Sauce Event</Text>
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
                               
                            }}>

                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ad

                            </Text>
                            <View style={{
                                flexDirection: "row",
                                gap: scale(10)
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        // Linking.openURL(url)
                                       navigation.navigate("EventPage")
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

                                    onPress={() => {
                                        // Linking.openURL(url)
                                    //    navigation.navigate("EventPage")

                                    }}
                                    style={{
                                        paddingHorizontal: scale(10),
                                        paddingVertical: scale(6),

                                        backgroundColor: "white",
                                        borderRadius: scale(5),
                                    }}>
                                    <Text style={{
                                        color: "black",
                                        fontWeight: "700"


                                    }}>Interested</Text>


                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>}

            </ImageBackground>
        </TouchableOpacity>

    )
}

export default Banner

const styles = StyleSheet.create({
    // infoText: {
    //     color: "white",
    //     fontSize: moderateScale(10),
    //     lineHeight: verticalScale(13),
    //     fontFamily: "Montserrat",
    // },
    mainBanner: {
        position: "relative",
        gap: verticalScale(10),
        minWidth: verticalScale(250)

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