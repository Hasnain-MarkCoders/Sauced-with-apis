import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { scale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'
import { generateThreeDigitRandomNumber, getRandomDate } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import user from "./../../../assets/images/userWithFlames.png"

const ProfileCard = () => {
    const auth = useSelector(state => state.auth)
    const navigation = useNavigation()
    const url = auth?.url || ""
    // const url = user
    const name = auth?.user?.user?.displayName || auth?.name
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
                gap: scale(0),
                alignItems:"center"

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
                </View>
                <View style={{
                    flexGrow: 1,
                    display:"flex"
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
                    }}>{name}</Text>
                    <View style={{
                        maxWidth:"80%",
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>

                            <TouchableOpacity onPress={() => {

                                navigation.navigate("Followers")
                            }}>

                                <View style={{
                                    alignItems: "center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(20),
                                        lineHeight: scale(30),
                                    }}>{generateThreeDigitRandomNumber()}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(10),
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
                                        fontSize: scale(20),
                                        lineHeight: scale(30),
                                    }}>{generateThreeDigitRandomNumber()}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(10),
                                        lineHeight: scale(15),
                                    }}>Following</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate("AllCheckinsScreen", {routerNumber:1})

                            }}>

                                <View  style={{
                                    alignItems: "center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(20),
                                        lineHeight: scale(30),
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

export default memo(ProfileCard)

const styles = StyleSheet.create({})