import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { scale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'
import { generateThreeDigitRandomNumber, getRandomDate } from '../../../utils'
import { useNavigation } from '@react-navigation/native'

const ExternalUserCard = ({
    url = "",
    name = ""
}) => {
    const auth = useSelector(state => state.auth)
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
                alignItems: "center"
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
                    source={url}

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
                                navigation.navigate("Followers")
                            }}
                            >

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(20),
                                    lineHeight: scale(36),
                                }}>{generateThreeDigitRandomNumber()}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(10),
                                    lineHeight: scale(15),
                                }}>Followers</Text>
                            </View>
                            </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={()=>{
                                    navigation.navigate("Following")
                                }}>

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(20),
                                    lineHeight: scale(36),
                                }}>{generateThreeDigitRandomNumber()}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(10),
                                    lineHeight: scale(15),
                                }}>Following</Text>
                            </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                 onPress={()=>{
                                    navigation.navigate("AllCheckinsScreen", {routerNumber:1})
                                }}
                                >

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(20),
                                    lineHeight: scale(36),
                                }}>{generateThreeDigitRandomNumber()}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(10),
                                    lineHeight: scale(15),
                                }}>Check-ins</Text>
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
                        {getRandomDate()}
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