import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
// import Lightbox from 'react-native-lightbox';
import Lightbox from 'react-native-lightbox-v2';
import CustomRating from '../CustomRating/CustomRating'
import { useNavigation } from '@react-navigation/native'
import ImageView from "react-native-image-viewing";

const BrandCard = ({
    url = "",
    title = "",
    product = {}
}) => {
    useEffect(() => {
        console.log("product==============>", product)
    }, [])

    const [visible, setIsVisible] = useState(false)

    const [LightBox, setLightBox] = useState(false)
    return (
        <View style={{
            width: "100%",
            paddingVertical: scale(20),
            gap: scale(20),
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: scale(20),
            }}>
                <View style={{
                }}>

                    {/* <Lightbox
//   springConfig={{ tension: 30, friction: 7 }}
  activeProps={{
    resizeMode: 'contain',
    style: {
      width: '100%',
      height: '100%',
      minWidth: scale(120),
      minHeight: scale(100),
      borderRadius: 0,
      borderColor: 'transparent',
      borderWidth: 0,
    },
  }}
> */}
                    <ImageView
                        images={[{ uri: url }]}
                        imageIndex={0}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                    />
                    <TouchableOpacity onPress={() => {
                        setIsVisible(true)
                    }}>

                        <Image
                            style={{
                                width: scale(120),
                                height: scale(100),
                                minWidth: scale(120),
                                minHeight: scale(100),
                                borderRadius: scale(10),
                                borderColor: '#FFA100',
                                borderWidth: scale(1),
                            }}
                            source={{ uri: url }}
                            resizeMode="cover"
                        />

                    </TouchableOpacity>

                    {/* </Lightbox> */}
                </View>
                <View style={{
                    gap: scale(14),
                    flexDirection: "row",
                    flexGrow: 1,
                    flexShrink: 1,
                    justifyContent: "space-between",

                }}>

                    <View style={{
                        gap: scale(10),
                        // flexBasis: "50%",
                        // justifyContent:"center"
                    }}>
                        <View>
                            <Text

                                // numberOfLines={1} ellipsizeMode="tail"
                                style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(20),
                                    lineHeight: scale(24),
                                }}>{title}</Text>
                        </View>
                    </View>


                    {/* <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                            <View style={{
                                alignItems: "center",
                                gap: scale(10)
                            }}>
                                <View style={{
                                    gap: scale(1),

                                }}>

                                    <Text style={{
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(30),
                                        lineHeight: scale(36),
                                        textAlign:"center",
                                    }}>{product?.totalCheckins}</Text>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(10),
                                        lineHeight: scale(25),
                                        marginTop: scale(-6)
                                    }}>Check-ins</Text>
                                </View>
                                
                            </View>
                        </View> */}


                </View>

            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: scale(20),
                alignItems: "flex-end"
            }}>

                <View style={{
                    flexDirection: "row",
                    gap: scale(20)
                }}>

                    <View>
                        <Text style={{
                            color: "white"
                        }}>
                            Website Link:
                        </Text>
                        <TouchableOpacity onPress={() => {
                            product?.brand?.websiteLink && Linking.openURL(product?.brand?.websiteLink)
                        }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    maxWidth: scale(155),
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(12),
                                    lineHeight: scale(25),
                                    textDecorationStyle: "solid",
                                    textDecorationLine: product?.brand?.websiteLink ? "underline" : "none"
                                }}>{product?.brand?.websiteLink ? "Visit Website" : "Not Available."}</Text>

                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={{
                            color: "white"
                        }}>
                            Amazon Link:
                        </Text>
                        <TouchableOpacity onPress={() => {
                            product?.brand?.amazonLink && Linking.openURL(product?.brand?.amazonLink)
                        }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    maxWidth: scale(155),
                                    color: "#FFA100",
                                    fontWeight: 600,
                                    fontSize: scale(12),
                                    lineHeight: scale(25),
                                    textDecorationStyle: "solid",
                                    textDecorationLine: product?.brand?.amazonLink ? "underline" : "none"
                                }}>{product?.brand?.amazonLink ? "Visit Website" : "Not Available."}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    <View style={{
                        alignItems: "center",
                        gap: scale(10)
                    }}>
                        <View style={{
                            gap: scale(1),

                        }}>

                            <Text style={{
                                color: "#FFA100",
                                fontWeight: 600,
                                fontSize: scale(30),
                                lineHeight: scale(36),
                                textAlign: "center",
                            }}>{product?.totalCheckins}</Text>
                            <Text style={{
                                color: "white",
                                fontWeight: 600,
                                fontSize: scale(10),
                                lineHeight: scale(25),
                                marginTop: scale(-6)
                            }}>Check-ins</Text>
                        </View>

                    </View>
                </View>
            </View>

        </View>
    )
}

export default BrandCard
