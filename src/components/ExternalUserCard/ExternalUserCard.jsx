import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { scale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'
import { formatDate, generateThreeDigitRandomNumber, getRandomDate } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import flames from "./../../../assets/images/flames.png"
const ExternalUserCard = ({
    totalCheckIns=0,
    totalFollowersCount=0,
    totalFollowingCount=0,
    url="",
    name="",
    date="",
    _id,
    reviewsCount=0,
}) => {
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
                gap: scale(12),
                alignItems: "center",
                position:"relative"
            }}>
                
                <Image
                    style={{
                        width: scale(100),
                        height: scale(100),
                        borderRadius: scale(50),
                        borderColor: "#FFA100",
                        borderWidth: scale(1)
                    }}
                    // source={{ uri: url }}
                    source={{uri:url}}

                />
                <View style={{
                    // gap:scale(14)
                    flexGrow: 1
                }}>

                    <Text
                        numberOfLines={1} ellipsizeMode="tail"

                        style={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: scale(20),
                            lineHeight: scale(24),
                            maxWidth: scale(100)
                        }}>{name}</Text>
                    <View >
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: scale(15)
                        }}>
                            <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate("ExternalUserFollowers", {_id})
                            }}
                            >

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(13),
                                    lineHeight: scale(36),
                                }}>{totalFollowersCount}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(7),
                                    lineHeight: scale(15),
                                }}>Followers</Text>
                            </View>
                            </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={()=>{
                                    navigation.navigate("ExternalUserFollowing", {_id})
                                }}>

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(13),
                                    lineHeight: scale(36),
                                }}>{totalFollowingCount}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(7),
                                    lineHeight: scale(15),
                                }}>Following</Text>
                            </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                 onPress={()=>{
                                    navigation.navigate("AllCheckinsScreen", {routerNumber:1,  _id})
                                }}
                                >

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(13),
                                    lineHeight: scale(36),
                                }}>{totalCheckIns}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(7),
                                    lineHeight: scale(15),
                                }}>Check-ins</Text>
                            </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                 onPress={()=>{
                                    navigation.navigate("AllUserReviews", {_id})
                                }}
                                >

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(13),
                                    lineHeight: scale(36),
                                }}>{totalCheckIns}</Text>
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

export default memo(ExternalUserCard)

const styles = StyleSheet.create({})