import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useState } from 'react'
import Snackbar from 'react-native-snackbar'
import { generateThreeDigitRandomNumber,  } from '../../../utils'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
import { scale } from 'react-native-size-matters'
const NestedComment = ({
    profileUri="",
}) => {
    const [commentStatus, setCommentStatus] = useState(false)
  return (
    <View style={{
        flexDirection: "row",
        width:"100%",
        justifyContent: "space-between"
    }}>
        <View style={{
            flexDirection: "row",
            gap: scale(20),
            flexShrink: 1,
        }}>

            <View>
                <Image
                    style={{
                        width: scale(30),
                        height: scale(30),
                        borderRadius: scale(50),
                        borderColor: "#FFA100",
                        borderWidth: scale(1)
                    }}
                    // source={{ uri: profileUri }}
                    source={profileUri}

                />
            </View>
            <View style={{
                flexShrink: 1,
            }}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: scale(10),
                        marginBottom:scale(5),
                        lineHeight: scale(17)
                    }}>
                    Mike Smith
                </Text>
                <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'

                    style={
                        { maxWidth: "100%", color: "white" , fontSize:scale(10)}
                    }>
                    Maecenas id metus efficitur.
                </Text>
                <Text style={{
        color:"white",
        fontSize:scale(10),
        marginTop:scale(10)
    }}>reply</Text>

            </View>
        </View>
        <View style={{
        }}>
            <TouchableOpacity
                onPress={() => {
                    Vibration.vibrate(10)
                    setCommentStatus(prev => !prev);
                    Snackbar.show({
                        text: !commentStatus ? 'Like' : "Unlike",
                        duration: Snackbar.LENGTH_SHORT,
                        // action: {
                        //     text: 'UNDO',
                        //     textColor: '#FFA100',
                        //     onPress: () => {
                        //         setCommentStatus(prev => !prev)
                        //     },
                        // },
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
                        color: "white"
                    }}>
                        {generateThreeDigitRandomNumber()}
                    </Text>

                </View>
            </TouchableOpacity>
        </View>
        
    </View>
  )
}

export default NestedComment

const styles = StyleSheet.create({})