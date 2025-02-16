import {  Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import {  formatEventDate } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import ImageView from "react-native-image-viewing";
import SwipeableRating from '../SwipeableRating/SwipeableRating'
import { Pencil, Trash } from 'lucide-react-native'
import { useSelector } from 'react-redux'
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal'
import YesNoModal from '../YesNoModal/YesNoModal'
import useAxios from '../../../Axios/useAxios'
const SingleReview = ({
  item = null,
  isNavigate = false,
  url,
  _id,
  name,
  sauceId = "",
  userName = "",
  sauceName = "",
  stars = "",
  text = "",
  textLength = "",
  date = "",
  images = [],
  foodPairings=[],
  reviewId=null,
  fetchReview=()=>{}
}) => {
  const axiosInstance = useAxios()

  const navigation = useNavigation()
  const auth = useSelector(state=>state.auth)
  const authId = auth?._id
  const [readMore, setReadMore] = useState(textLength > 130)
  const [loading, setLoading] = useState(true)
  const [visible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yesNoModal, setYesNoModal] = useState({
    open: false,
    message: "",
    severity: "success",
    cb: () => { },
    isQuestion:false
  })
  const openImageView = (index) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  const closeImageView = () => {
    setIsVisible(false);
  };

  const handleDelete = ()=>{
    setYesNoModal({
      open: true,
      message: "Delete Review?",
      severity: "success",
      cb: async() => { 
        const res = await axiosInstance.delete(`/delete-review/${reviewId}`);
        fetchReview(reviewId)
      },
      isQuestion:true
    })
  }

  const handleEditReview = ()=>{
    setYesNoModal({
      open: true,
      message: "Edit Review?",
      severity: "success",
      cb: () => { 
        navigation.navigate("EditReviewScreen", {
          _id:reviewId,
        })
      },
      isQuestion:true
    })
  }

  return (
    <View style={{
      gap: scale(20),
      marginBottom: scale(10)
    }}>
      <View

        style={{
          backgroundColor: "#2e210a",
          borderColor: "#FFA100",
          borderWidth: 1,
          paddingVertical: scale(10),
          paddingHorizontal: scale(10),
          borderRadius: scale(12),
          position: "relative",
          gap: scale(5)
        }}>
        <TouchableOpacity
            style={{
              marginBottom: scale(10),
              alignSelf: "flex-start", // Ensures width matches content

            }}
          onPress={() => {
            if (isNavigate) {
              navigation.navigate("ExternalProfileScreen", {
                url,
                _id,
                name
              })
            }
          }}
        >

          <Text style={{
            color: "white",
            fontWeight: 700,
            fontSize: scale(14),
            lineHeight: scale(17),
            textDecorationLine: "underline"
            , textDecorationStyle: "solid"
            , textDecorationColor: "white",
          }}>
            {userName}
          </Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={{
            alignSelf: "flex-start", // Ensures width matches content
            marginTop:scale(7),
            maxWidth:"80%"

          }}
            onPress={() => {
              if (isNavigate) {
                navigation.navigate("ProductScreen", {
                  // url:item?.sauceId.image,
                  // item:item?.sauceId,
                  // title:item?.sauceId.name,
                  // setSelected,
                  // selected,
                  // handleLike,
                  _id: sauceId
                })
              }
            }}
          >

            <Text style={{
              color: "#FFA100",
              fontWeight: 700,
              fontSize: scale(14),
              lineHeight: scale(17),
              textDecorationLine: "underline"
              , textDecorationStyle: "solid"
              , textDecorationColor: "#FFA100"
            }}>
              {sauceName}
            </Text>
          </TouchableOpacity>
        {/* <CustomRating
          initialRating={item?.star}

          ratingContainerStyle={{
            pointerEvents: "none"
          }} size={10} /> */}
          <View style={{
            flexDirection:"row",
            justifyContent:"start",
          }}>

           <SwipeableRating
                                disabled={true}
                                gap={3}
                                size={10}
                                 initialRating={item?.star}
                                />
          </View>
          
      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(7),
      }}>
        {foodPairings?.map((foodPair, index) => <View key={index}><Text style={{
          backgroundColor: '#2e210a', // Dark box for unselected chips
          borderRadius: scale(14),
          paddingVertical: scale(6),
          paddingHorizontal: scale(10),
          borderColor: '#FFA500', // Orange border for chips to match the theme
          borderWidth: scale(1),
          alignItems: 'center',
          color: "white"
        }}>{foodPair}</Text></View>)}
      </View>

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap' }}
        >
          <Text style={{
            color: "white"
          }}>
            {!readMore ? text : `${text?.slice(0, 130)}... `}
          </Text>

          {
            textLength < 130
              ? null
              :
              <TouchableOpacity onPress={() => setReadMore(prev => !prev)}>
                <Text style={{ color: '#FFA100', textDecorationLine: "underline" }}>{!readMore ? 'See less' : 'See more'}</Text>
              </TouchableOpacity>
          }

        </View>
        {/* {date && <Text style={{
          position: "absolute",
          top: scale(10),
          right: scale(10),
          fontSize: scale(11),
        
        }}>
          {
            formatEventDate(new Date(date), true)
          }
        </Text>} */}
        {
          <View style={{
            position: "absolute",
            top: scale(10),
            right: scale(10),
          }}>
        {date&&  <Text style={{
              color: "white"
          }}>
          {
            formatEventDate(new Date(date), true)
          }
          </Text>}
       { _id==authId &&  <View style={{
            flexDirection: "row",
            gap: scale(20),
            marginTop:scale(10),
            justifyContent:"flex-end",
          }}>
          <Pencil hitSlop={20}
            onPress={()=>{
              handleEditReview()
          }}  size={14} stroke={"#FFA500"} />
          <Trash hitSlop={20} onPress={()=>{
           handleDelete()
          }}   size={14} stroke={"#FFA500"} />
          </View>}
          </View>
        }
        <View style={{
          width: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          gap: scale(20),
          marginTop: scale(10)
        }}>

          {images?.map((uri, index) => (

            <>
              {loading && <View>
                <SkeletonPlaceholder
                borderColor={'#FFA100'}
                borderWidth={1}
                  width={scale(100)}
                  height={scale(100)}
                  speed={1600}
                  backgroundColor="#2E210A"
                  highlightColor="#fff"
                >
                  <SkeletonPlaceholder.Item
                    width={scale(100)}
                    height={scale(100)}
                    borderRadius={scale(10)}
                  />
                </SkeletonPlaceholder>
              </View>}
            
              <TouchableOpacity onPress={() => {
                openImageView(index)
              }}>


                <Image
                  onLoad={() => setLoading(false)}
                  key={index}
                  source={{ uri: uri }}
                  style={{
                    width: scale(100),
                    height: scale(100),
                    borderColor: '#FFA100',
                    borderWidth: 1,
                    borderRadius: scale(12),
                    opacity: loading ? 0 : 1,
                  }}
                />
              </TouchableOpacity>
            </>
          ))}
        </View>

        <ImageView
          imageIndex={currentIndex}
          images={images.map(uri => ({ uri: uri }))}
          visible={visible}
          onRequestClose={closeImageView}
        />
     
       <YesNoModal
       
       modalVisible = {yesNoModal.open}
       setModalVisible = {(isOpen)=>{
        setYesNoModal(prev=>({...prev,open:isOpen}))
       }}
       success={true}
       title={yesNoModal.message}
       isQuestion={true}
       cb={yesNoModal.cb}
       showCancel = {true}
       ButtonText = "Continue"
       CancelText = "Cancel"
       />
      
      </View>
    
    </View>
  )
}

export default SingleReview

const styles = StyleSheet.create({})