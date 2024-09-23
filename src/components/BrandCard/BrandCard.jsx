import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import Lightbox from 'react-native-lightbox';
import CustomRating from '../CustomRating/CustomRating'
import { useNavigation } from '@react-navigation/native'
const BrandCard = ({
    url = "",
    title = "",
    product={}
}) => {
    useEffect(()=>{
console.log("product==============>", product)
    },[])

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

                    <Lightbox
                        activeProps={{ resizeMode: LightBox ? 'contain' : "cover" }}
                        springConfig={{ tension: 30, friction: 7 }}
                        onOpen={() => setLightBox(true)}
                        willClose={() => setLightBox(false)}
                    >
                        <Image
                            style={{
                                width: LightBox ? "100%" : scale(120),
                                height: LightBox ? "100%" : scale(100),
                                minWidth: scale(120),
                                minHeight: scale(100),
                                borderRadius: LightBox ? 0 : scale(10),
                                borderColor: LightBox ? 0 : "#FFA100",
                                borderWidth: LightBox ? 0 : scale(1)
                            }}
                            source={{ uri: url }}
                            // source={url}

                        />
                    </Lightbox>
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
                        flexBasis: "50%"
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

                    <View style={
                        {

                        }
                    }>
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
                        </View>
                    </View>
                </View>
              
            </View>
            <View style={{
                flexDirection:"row",
                gap:scale(20)
            }}>

<View>
<Text style={{
    color:"white"
}}>
    Website Link:
</Text>
<TouchableOpacity onPress={() => {
    Linking.openURL(product?.brand?.websiteLink)
}}>
    <Text 
     numberOfLines={1}
    ellipsizeMode='tail'
    style={{
        maxWidth:scale(155),
        color: "#FFA100",
        fontWeight: 600,
        fontSize: scale(12),
        lineHeight: scale(25),
    }}>{product?.brand?.websiteLink}</Text>
</TouchableOpacity>
</View>

<View>
<Text style={{
    color:"white"
}}>
    Amazon Link:
</Text>
<TouchableOpacity onPress={() => {
    Linking.openURL(product?.brand?.amazonLink)
}}>
    <Text 
     numberOfLines={1}
    ellipsizeMode='tail'
    style={{
        maxWidth:scale(155),
        color: "#FFA100",
        fontWeight: 600,
        fontSize: scale(12),
        lineHeight: scale(25),
    }}>{product?.brand?.amazonLink}</Text>
</TouchableOpacity>
</View>
</View>
        </View>
    )
}

export default BrandCard
