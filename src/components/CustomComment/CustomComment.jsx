import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { memo, useState } from 'react'
import Snackbar from 'react-native-snackbar'
import { scale } from 'react-native-size-matters'
import { generateThreeDigitRandomNumber } from '../../../utils'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
import Lightbox from 'react-native-lightbox';
import NestedComment from '../NestedComment/NestedComment'
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal'

const CustomComment = ({
    uri = "",
    profileUri = "",
    showImages = false,
}) => {
    const [commentStatus, setCommentStatus] = useState(false)
    const [LightBox, setLightBox] = useState(false)
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
    const [showMoreComments, setShowMoreComments] = useState(false)
    const nestedComments= [1,2] 
    return (
        <View style={{

            alignItems: "center",
            gap: scale(20),
            borderBottomColor: "#FFA100",
            borderBottomWidth: 1,
            paddingBottom: scale(40),
            marginBottom: scale(40)
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
                            source={profileUri}

                        />
                    </View>
                    <View style={{
                        flexShrink: 1
                    }}>
                        <TouchableOpacity onPress={()=>{
                            setOpenUserDetailsModal(true)
                        }}>

                        <Text style={{
                            color: "#FFA100",
                            fontWeight: 700,
                            fontSize: scale(14),
                            lineHeight: scale(17),
                            paddingVertical:scale(10)
                        }}>
                            Mike Smith
                        </Text>
                        </TouchableOpacity>
                        <Text
                            numberOfLines={3}
                            ellipsizeMode='tail'

                            style={
                                { maxWidth: "90%", color: "white" }
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
                                    textColor: '#FFA100',
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
                                color: "white"
                            }}>
                                {generateThreeDigitRandomNumber()}
                            </Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View>

                </View>
            </View>

            {showImages &&
                <View style={{
                    flexDirection: "row",
                    gap: scale(20),
                    flexWrap: "wrap",
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
                            // source={{ uri: url }}
                            source={uri}

                        />
                    </Lightbox>


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
                            // source={{ uri: url }}
                            source={uri}

                        />
                    </Lightbox>

                    {/* <Image 
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
        }} /> */}
                </View>}
            <View style={{
                flexDirection: "row",
                gap: scale(20),
                alignSelf:showMoreComments?"flex-start":"",
                paddingLeft:showMoreComments?scale(70):0
            }}>
                <TouchableOpacity onPress={() => {
                    Vibration.vibrate(10)
                }}>

                    <Text style={{
                        textDecorationLine: "underline",
                        color: "white",
                        fontSize: scale(12)
                    }}>
                        Reply
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    Vibration.vibrate(10)
                    setShowMoreComments(true)

                }}>


                    <Text style={{
                        textDecorationLine: "underline",
                        color: "white",
                        fontSize: scale(12)
                    }}>
                        {
                            !showMoreComments ? "View 2 More Replies" : ""
                        }
                    </Text>

                </TouchableOpacity>
            </View>
            {
                showMoreComments ?
                    <View style={{
                        alignItems: "flex-start",
                        width:"100%",
                        gap: scale(20),
                        paddingLeft: scale(70)

                    }}>
                        <View>
                            {
                                nestedComments?.map((item, index)=>{
                                 return   <NestedComment key={index} profileUri={profileUri}/>                        

                                })
                            }
                        </View>
                        <TouchableOpacity onPress={() => {
                            setShowMoreComments(false)
                        }}>
                            <Text style={{
                                color: "white"
                            }}> {showMoreComments ? "Hide Replies" : ""}</Text>
                        </TouchableOpacity>

                    </View>
                    : null
            }

<UserDetailsModal
          name= 'Mike Smith'
          email='MikeSmith@gmail.com'
          prfilePicture= {profileUri}
        modalVisible={openUserDetailsModal}
        setModalVisible={setOpenUserDetailsModal}
      />
        </View>
    )
}

export default memo(CustomComment)

const styles = StyleSheet.create({})