import { Linking, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import banner from "./../../../assets/images/banner.png";
import youtubeIcon from "./../../../assets/images/youtubeIcon.png";
import {  scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import CustonPlayIcon from '../CustonPlayIcon/CustonPlayIcon';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
const Banner = ({
    url = "",
    infoText = "",
    showText = true,
    title = "",
    cb = () => { },
    videoId = "",
    event = {},
    showOverlay=false,
    isInterested=false,
    loading=false,
    item
}) => {
    const interestedEvents = useSelector(state=>state?.interestedEvents)
    // const [tempIsInterested, setTempIsInterested] = useState(!!interestedEvents?.find(item=>item?._id==event?._id))
    const isInterestedEvent = !!interestedEvents?.find(item => item?._id === event?._id);
    const navigation = useNavigation()
    return (
        <>{
            loading
            ?
             <SkeletonPlaceholder speed={1600} backgroundColor='#2E210A' style={{height:"100%"}} highlightColor={"#fff"} borderRadius={4}>
                
                <View style={{
                    gap:scale(10)
                }}>
                        <View style={{width:"70%", height: scale(20) }}>
                        </View>
                <View style={{width:"90%", height: scale(20) }}>
                </View>
                <View style={{ width:"80%", height: scale(20) }}>
                </View>
                <View style={{width:"50%", height: scale(20) }}>
                </View>
                </View>
      </SkeletonPlaceholder> 
      :<TouchableOpacity style={{
        width: "100%",
        borderRadius:scale(10),

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
                            width:"70%"
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
                                    elevation: scale(5),
                                    minWidth:scale(80),
                                    flexGrow:1,
                                    flexShrink:0,
                                    minWidth:scale(100)
                                }}>
                                <Text style={{
                                    color: "black",
                                    fontWeight: "700",
                                    textAlign:"center"


                                }}>Details</Text>


                            </TouchableOpacity>
                            <TouchableOpacity

                                onPress={()=>{cb(event);
                                    //  setTempIsInterested(prev=>!prev)
                                    }}
                                style={{
                                    paddingHorizontal: scale(10),
                                    paddingVertical: scale(6),
                                    backgroundColor: isInterestedEvent?"#FFA100":"white",
                                    borderRadius: scale(5),
                                    flexGrow:1,
                                    flexShrink:0,
                                    minWidth:scale(100)

                                }}>
                                <Text style={{
                                    color: "black",
                                    fontWeight: "700",
                                    textAlign:"center",
                                    



                                }}>
                                    {/* {isInterested || tempIsInterested?"Not-Interested":"Interested"}
                                     */}
                                    { isInterestedEvent?"Not-Interested":"Interested"}
                                    
                                    </Text>


                            </TouchableOpacity>
                        </View>
                </View>
                :
                <View style={{
                    width:"100%",
                    height:"100%",
                    position:"relative",

                }}>
                        <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{
                            color: "white",
                            fontSize: scale(15),
                            fontFamily: "Montserrat",
                            maxWidth: "80%",
                            fontWeight: '700',
                            color: 'white',
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0, 0, 0, 1)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 10,
                            top:scale(15),
                            left:scale(20),
                            position:"absolute"
                        }} 
                        
                        >{item?.videoTitle}</Text>
                        <View style={{
                            width:scale(80),
                            height:scale(70),
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [{ translateX: -45 }, { translateY: -45 }], 
                        }}>

                        <Image 
                        style={{
                            width:"100%",
                            height:"100%",
                            resizeMode:"contain"
                        }}
                        source={youtubeIcon}/>
                        </View>
                    </View>}

        </ImageBackground>
    </TouchableOpacity>
        }
        
        </>

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