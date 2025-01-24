import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useState } from 'react'
import { scale } from 'react-native-size-matters'
import { formatDate, getFormattedName } from '../../../utils'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import redFlameIndicator from "./../../../assets/images/redFlameIndicator.png"
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { Pencil } from 'lucide-react-native'
import ImageView from "react-native-image-viewing";
import useAxios from '../../../Axios/useAxios'

const ProfileCard = ({
totalCheckIns=0,
totalFollowersCount=0,
totalFollowingCount=0,
url="",
name="",
date="",
_id,
reviewsCount=0
}) => {
    const auth = useSelector(state=>state.auth)
    const navigation = useNavigation()
    const [circles, setCircles] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setIsVisible] = useState(false)
    const axiosInstance = useAxios()
      const fetchBadges = useCallback(
           async () => {
            const endpoint = "/get-user-badge";
            try {
                const res = await axiosInstance.get(endpoint, {
                    params: {
                        _id: auth?._id
                    }
                });
                setCircles(res?.data?.userBadges?.badges||[])
                console.log(res.data)
            } catch (error) {
        }
        
     }, []);

useFocusEffect(
    useCallback(() => {
        fetchBadges();
    }, []))

    return (
        <View style={{
            width: "100%",
            paddingVertical: scale(20),
            paddingHorizontal: scale(10),
            borderRadius: scale(12),
            borderColor: "#FFA100",
            borderWidth: scale(1),
            gap: scale(10),
            position:"relative"
        }}>
            <View
                style={{
            position:"absolute",
            top:scale(20),
            right:scale(20),
            zIndex:1

                }}

>


    <TouchableOpacity

    onPress={
        ()=>{
            navigation.navigate("Edit Profile")
        }
    }>
            <Pencil
            color={"#FFA500"}
            fill={"#FFA500"}
            size={20}
            />
    </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: scale(5),
                overflow:"hidden",
                alignItems:"center",


            }}>
                <TouchableOpacity onPress={()=>{
    setIsVisible(true)

}}>
                <View style={{
                    width:scale(100),
                    height:scale(100),
                    position:"relative"
                }}>

{isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item              width={scale(90)}
            height={scale(90)}
            borderRadius={scale(45)}

            />
        </SkeletonPlaceholder>
      )}

<ImageView
  images={[{ uri: url }]}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => setIsVisible(false)}
/>


    <Image
        style={{
              opacity:isLoading?0:1,
        position:isLoading?"absolute":"relative",
            width: scale(90),
            height: scale(90),
            top: 0,
            left: 0,
            position: 'absolute',
            borderRadius: scale(50),
            borderColor: '#FFA100',
            borderWidth: scale(1),
        }}
        resizeMode="cover"
        source={{ uri: url }}
        onLoad={() => setIsLoading(false)}
    />


                 <Image
                    style={{
                        bottom:10,
                        right:10,
                        position:"absolute",
                        zIndex:1,
                        width:scale(30),
                        height:scale(30)
                    }}
                    source={redFlameIndicator}
                />
                </View>
</TouchableOpacity>

                <View style={{
                    display:"flex",
                    gap:scale(10)
                }}>

                    <Text

                        ellipsizeMode='tail'
                        numberOfLines={1}
                    style={{
                        color: "white",
                        fontWeight: 600,
                        maxWidth:"80%",
                        flexBasis:"80%",
                        fontSize: scale(20),
                        lineHeight: scale(24),
                    }}>{getFormattedName(name)}</Text>
                    <View style={{
                        maxWidth:"80%",
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap:scale(13)

                        }}>

                            <TouchableOpacity onPress={() => {

                                navigation.navigate("Followers")
                            }}>

                                <View style={{
                                    alignItems: "center",
                                    justifyContent:"center",
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(13),
                                        lineHeight: scale(30),
                                    }}>{totalFollowersCount}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(7),
                                        lineHeight: scale(15),
                                    }}>Followers</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={
                                () => {
                                    navigation.navigate("Following")

                                }
                            }>

                                <View  style={{
                                    alignItems: "center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(13),
                                        lineHeight: scale(30),
                                    }}>{totalFollowingCount}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(7),
                                        lineHeight: scale(15),
                                    }}>Following</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate("AllCheckinsScreen", {routerNumber:1, _id, isBack:true})

                            }}>

                                <View  style={{
                                    alignItems: "center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(13),
                                        lineHeight: scale(30),
                                    }}>{totalCheckIns}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(7),
                                        lineHeight: scale(15),
                                    }}>Check-ins</Text>
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => {
                                navigation.navigate("AllUserReviews", {_id:auth?._id})

                            }}>

                                <View  style={{
                                    alignItems: "center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(13),
                                        lineHeight: scale(30),
                                    }}>{reviewsCount}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(7),
                                        lineHeight: scale(15),
                                    }}>Reviews</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <View style={{
                    flexDirection: "row",
                    gap: scale(5)
                }}>
                    <Text style={{
                        color: "#fff",
                        fontSize: scale(10)
                    }}>
                        Joined Date:
                    </Text>
                    <Text style={{
                        color: "#FFA100",
                        fontSize: scale(10)
                    }}>
                        {date &&formatDate(new Date(date))}
                    </Text>
                </View>
                <View style={{
                    gap: scale(10),
                    alignItems: "center",
                    flexDirection: "row",

                }}>
                  
                    {circles.map((item, index) => <View key={index} style={{
                        width: scale(15),
                        height: scale(15),
                        borderRadius: scale(50),
                        backgroundColor: "#774d06"
                    }}>
                        <Image
                        source={{uri:item?.badgeId?.icon}}
                            style={{
                                width:"100%",
                                height:"100%",
                                resizeMode:"contain",
                                borderRadius:scale(50)
                            }}
                        />

                    </View>)}

                </View>
            </View>
        </View>
    )
}

export default memo(ProfileCard)

const styles = StyleSheet.create({})