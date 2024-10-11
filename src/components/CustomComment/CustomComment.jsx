import { Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import Snackbar from 'react-native-snackbar'
import { scale } from 'react-native-size-matters'
import { generateThreeDigitRandomNumber, messagesData } from '../../../utils'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
// import Lightbox from 'react-native-lightbox';
import Lightbox from 'react-native-lightbox-v2';
import NestedComment from '../NestedComment/NestedComment'
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal'
import useAxios from '../../../Axios/useAxios'
import ImageView from "react-native-image-viewing";

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
    _id="",
    item={},
    email="",
    likesCount=0,
    hasLikedUser=false
}) => {
    useEffect(()=>{
    },[profileUri])
    const [commentStatus, setCommentStatus] = useState(hasLikedUser)
    const [visible, setIsVisible] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)

    const [LightBox, setLightBox] = useState(false)
    const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
    const [showReplies, setShowReplies]  = useState(false)
    const [likeCount, setLikesCount ]= useState(likesCount)
    const axiosInstance = useAxios()
    const handleLike = async()=>{
        try{
            console.log(hasLikedUser)
            setLikesCount(prev=> (commentStatus&&prev>0)?prev-1:prev+1)
            setCommentStatus(prev => !prev);
            const res = await axiosInstance.post(`/like-checkin`, { checkinId: _id });
            setLikesCount(res.data?.likesCount)
            Snackbar.show({
                text: !commentStatus ? 'Liked' : "Unliked",
                duration: Snackbar.LENGTH_SHORT,
                // action: {
                //     text: 'UNDO',
                //     textColor: '#FFA100',
                //     onPress: () => {
                //         setCommentStatus(prev => !prev)
                //     },
                // },
            });
        }catch(error){

        }
    }

    useEffect(()=>{
console.log(profileUri)
    },[profileUri])

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
                            cb({profileUri,name:title, email,number:"+1234567890", item})
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
                            handleLike()
                            Vibration.vibrate(10)
                        }}
                    >
                        <View style={{
                            display:isReply?"none":"flex",
                            alignItems:"center"
                        }}>
                            <Image style={{
                                width: scale(20),
                                height: scale(20),
                                objectFit: "contain"
                            }} source={commentStatus ? filledHeart : emptyheart} />
                            <Text style={{
                                color: "white"
                            }}>
                                 {
                                    likeCount
                                    
                                 }
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
                    assets.map((uri , index)=>uri&&
                    //     <Lightbox
                    //     // springConfig={{ tension: 30, friction: 7 }}
                    //     activeProps={{
                    //         resizeMode: 'contain',
                    //         style: {
                    //             width: '100%',
                    //             height: '100%',
                    //             minWidth: scale(120),
                    //             minHeight: scale(100),
                    //             borderRadius: 0,
                    //             borderColor: 'transparent',
                    //             borderWidth: 0,
                    //         },
                    //     }}
                    // >
                        // {uri && (
                        <TouchableOpacity onPress={()=>{
                            setIsVisible(true)
                            setImageIndex(index)
                        }}>
                                        {/* <ImageView
  images={[{ uri: uri}]}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => setIsVisible(false)}
/> */}

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
                                source={{ uri }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        // )}
                    // {/* </Lightbox> */}
                    )
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
                    color: "#000",
                    display:isReply?"none":"flex",
                    fontSize:scale(12),
                    borderRadius:scale(20),
                    backgroundColor:"#FFA500",
                    paddingHorizontal:scale(10),
                    paddingVertical:scale(5)

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
                paddingLeft:scale(60),
            }}
            >

               { <Text 
    
                 style={{
                    borderRadius:scale(20),
                    backgroundColor:"#FFA500",
                    paddingHorizontal:scale(10),
                    paddingVertical:scale(5),
                    color:"#000"
                }}>{showReplies ? "Hide replies":"Show replies"}</Text>}
            </TouchableOpacity>}
            <ImageView
          imageIndex={imageIndex}
          images={assets.map(uri => ({ uri: uri }))}
          visible={visible}
          onRequestClose={()=>{setIsVisible(false)}}
        />
        </View>

    )
}

export default CustomComment

const styles = StyleSheet.create({})