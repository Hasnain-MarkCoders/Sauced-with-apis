import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { scale } from 'react-native-size-matters'
import { formatDate, getFormattedName } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import redFlameIndicator from "./../../../assets/images/redFlameIndicator.png"
import { useSelector } from 'react-redux'

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
    const circles = [1, 1, 1, 1, 1]
    return (
        <View style={{
            width: "100%",
            paddingVertical: scale(20),
            paddingHorizontal: scale(20),
            borderRadius: scale(12),
            borderColor: "#FFA100",
            borderWidth: scale(1),
            gap: scale(10),
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: scale(5),
                overflow:"hidden",
                alignItems:"center",


            }}>
                <View style={{
                    width:scale(100),
                    height:scale(100),
                    position:"relative"
                }}>

                <Image
                    style={{
                        width: scale(90),
                        height: scale(90),
                        resizeMode:"contain",
                        top:0,
                        left:0,
                        position:"absolute",
                        objectFit:"cover",
                        borderRadius: scale(50),
                        borderColor: "#FFA100",
                        borderWidth: scale(1)
                    }}
                    source={{ uri: url }}
                    // source={url}

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
                    // source={url}

                />
                </View>
                <View style={{
                    flexGrow: 1,
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
                                navigation.navigate("AllCheckinsScreen", {routerNumber:1, _id})

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
                    <View style={{
                        width: scale(10),
                        height: scale(10),
                        borderRadius: scale(50),
                        backgroundColor: "#FFA100"
                    }}>

                    </View>
                    {circles.map((item, index) => <View key={index} style={{
                        width: scale(10),
                        height: scale(10),
                        borderRadius: scale(50),
                        backgroundColor: "#774d06"
                    }}>

                    </View>)}

                </View>
            </View>
        </View>
    )
}

export default memo(ProfileCard)

const styles = StyleSheet.create({})