import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { memo, useState } from 'react'
import Snackbar from 'react-native-snackbar'
import { scale } from 'react-native-size-matters'
import { generateThreeDigitRandomNumber } from '../../../utils'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
const CustomComment = ({
    uri="",
    profileUri="",
    showImages=false,
}) => {
    const [commentStatus , setCommentStatus] = useState(false)
  return (
    <View style={{

        alignItems:"center",
        gap:scale(20),
        borderBottomColor:"#FFA100",
        borderBottomWidth:1,
        paddingBottom:scale(40),
        marginBottom:scale(40)
    }}>
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <View style={{
                flexDirection: "row",
                gap: scale(20),
                flexShrink: 1
            }}>

                <View>
                    <Image
                        style={{
                            width: scale(60),
                            height: scale(60),
                            borderRadius: scale(50),
                            borderColor: "#FFA100",
                            borderWidth: scale(1)
                        }}
                        // source={{ uri: profileUri }}
                        source={profileUri }

                    />
                </View>
                <View style={{
                    flexShrink: 1
                }}>
                    <Text style={{
                        color: "#FFA100",
                        fontWeight: 700,
                        fontSize: scale(14),
                        lineHeight: scale(17)
                    }}>
                        Mike Smith
                    </Text>
                    <Text
                        numberOfLines={3}
                        ellipsizeMode='tail'

                        style={
                            { maxWidth: "90%", color:"white"}
                        }>
                        Maecenas id metus efficitur, @William mauris in, pellentesque risus.
                    </Text>

                </View>
            </View>
            <View style={{
            }}>
                <TouchableOpacity
                    onPress={() => {
                        Vibration.vibrate(10)
                        setCommentStatus(prev => !prev);
                        Snackbar.show({
                            text: !commentStatus ? 'You loved this comment.' : "You unloved this comment.",
                            duration: Snackbar.LENGTH_SHORT,
                            action: {
                                text: 'UNDO',
                                textColor: 'green',
                                onPress: () => {
                                    setCommentStatus(prev => !prev)
                                },
                            },
                        });
                    }}
                >
                    <View>
                        <Image style={{
                            width: scale(20),
                            height: scale(20),
                            objectFit: "contain"
                        }} source={commentStatus ? filledHeart : emptyheart} />
                        <Text style={{
                            color:"white"
                        }}>
                            {generateThreeDigitRandomNumber()}
                        </Text>

                    </View>
                </TouchableOpacity>
            </View>
            <View>

            </View>
        </View>

      {showImages &&  <View style={{
            flexDirection:"row",
            gap:scale(20),
            flexWrap:"wrap",
        }}>

        <Image 
        source={uri }
        
        
        
        style={{
            width: scale(125), borderColor: "#FFA100",
            borderWidth: 1, height: scale(110), borderRadius: scale(12)
        }} />
         <Image
          source={uri } 
         
         style={{
            width: scale(125), borderColor: "#FFA100",
            borderWidth: 1, height: scale(110), borderRadius: scale(12)
        }} />
        </View>}
        <View style={{
            flexDirection:"row",
            gap:scale(20)
        }}>
            <TouchableOpacity onPress={()=>{
                Vibration.vibrate(10)
            }}>

            <Text style={{
                textDecorationLine:"underline",
                color:"white",
                fontSize:scale(12)
            }}>
                Reply
            </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{
                Vibration.vibrate(10)
            }}>

            <Text style={{
                textDecorationLine:"underline",
                color:"white",
                fontSize:scale(12)
            }}>
               View 2 More Reply
            </Text>
            </TouchableOpacity>
        </View>


    </View>
  )
}

export default memo(CustomComment)

const styles = StyleSheet.create({})