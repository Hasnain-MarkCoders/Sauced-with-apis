import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import Snackbar from 'react-native-snackbar'
import { scale } from 'react-native-size-matters'
import { generateThreeDigitRandomNumber, messagesData } from '../../../utils'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
import Lightbox from 'react-native-lightbox';
import NestedComment from '../NestedComment/NestedComment'
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal'

const CustomComment = ({
    getId=()=>{},
    uri = "",
    text = "",
    title = "",
    profileUri = "",
    showImages = false,
    handleSubmitMessage = () => { },
    assets = [],
    replies,
    showBorder = true,
    isReply = false,
    count=0,
    index=0,
    cb=()=>{},
    _id=""
}) => {
    const [commentStatus, setCommentStatus] = useState(false)
    const [LightBox, setLightBox] = useState(false)
    const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
    const [showReplies, setShowReplies]  = useState(false)

    return (
        <View style={{
            alignItems: (isReply || assets.length<1)?"flex-start":"center",
            gap: scale(20),
            borderBottomColor: "#FFA100",
            borderBottomWidth: (showBorder && count >1) ? 1 : 0,
            marginBottom:isReply?scale(0):scale(30),
            paddingBottom:isReply?scale(0):scale(30)
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <View style={{
                    flexDirection: "row",
                    gap: scale(20),
                    flexShrink: 1,
                    flexGrow:1

                }}>

                    <View >
                        <Image
                            style={{
                                width: isReply ? scale(30) : scale(60),
                                height: isReply ? scale(30) : scale(60),
                                borderRadius: scale(50),
                                borderColor: "#FFA100",
                                borderWidth: scale(1)
                            }}
                            source={{ uri: profileUri }}

                        />
                    </View>
                    <View style={{
                        flexShrink: 1,
                        flexGrow:1
                    }}>
                        <TouchableOpacity onPress={() => {
                            setOpenUserDetailsModal(true)
                            cb({profileUri,name:"Thomas", email:"example@gmail.com",number:"+1234567890"})
                        }}>

                            <Text style={{
                                color: isReply ? "white" : "#FFA100",
                                fontWeight: 700,
                                fontSize: isReply ? scale(12) : scale(14),
                                lineHeight: scale(17),
                                paddingVertical: scale(10),
                            }}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            numberOfLines={3}
                            ellipsizeMode='tail'

                            style={
                                { maxWidth: "90%", color: "white" }
                            }>
                            {text}
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
                        <View style={{
                            display:isReply?"none":"flex"
                        }}>
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


            {assets.length > 0 && <View style={{
                flexDirection: "row",
                gap: scale(20),
                flexWrap: "wrap",
            }}>

                {
                    assets.map(uri => <Lightbox
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
                            source={{ uri }}
                        />
                    </Lightbox>)
                }




            </View>}
            <TouchableOpacity
                style={{
                    alignSelf: "flex-start",
                    paddingLeft: isReply ? scale(55) : scale(60)

                }}
                onPress={() => {
                    handleSubmitMessage()
                    getId(_id)
                }}>

                <Text style={{
                    color: "white",
                    display:isReply?"none":"flex",
                    fontSize:scale(12),
                }}>Reply</Text>
            </TouchableOpacity>

       {  showReplies?  <View style={{
                alignSelf: "flex-start",
                paddingLeft:scale(50)
            }}>
              
                {replies?.map(item => <CustomComment
                cb={cb}
                
                    isReply={true}
                    showBorder={false}
                    handleSubmitMessage={handleSubmitMessage}
                    profileUri={item?.user?.image}
                    title={item?.user?.name}
                    text={item.text}
                />)}

            </View>:null
            }
               { replies?.length>0 && <TouchableOpacity
            onPress={()=>{
                setShowReplies(prev=>!prev)
            }}
            style={{
                alignSelf: "flex-start",
                paddingLeft:scale(50),
            }}
            >

               { <Text 
    
                 style={{
                   
                    color:"white"
                }}>{showReplies ? "Hide Replies":"Show replies"}</Text>}
            </TouchableOpacity>}
           
        </View>

    )
}

export default memo(CustomComment)

const styles = StyleSheet.create({})