import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import { formatDate, formatEventDate, generateRandomText } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import Lightbox from 'react-native-lightbox-v2';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
// import { handleFavoriteSauces, handleRemoveSauceFromFavouriteSauces } from '../../../android/app/Redux/favoriteSauces'

import ImageView from "react-native-image-viewing";
import { handleFavoriteSauces, handleRemoveSauceFromFavouriteSauces  } from '../../Redux/favoriteSauces'

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
  images = []
}) => {
  const navigation = useNavigation()
  const [readMore, setReadMore] = useState(textLength > 130)
  const [loading, setLoading] = useState(true)
  const [visible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const openImageView = (index) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  const closeImageView = () => {
    setIsVisible(false);
  };

  return (
    <View style={{
      gap: scale(20),
      marginBottom: scale(40)
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
          onPress={() => {
            if (isNavigate) {
              // navigate
              // if (auth?._id!==_id){
              navigation.navigate("ExternalProfileScreen", {
                url,
                _id,
                name
              })

              // }
              // else{
              //   navigation.navigate("Profile")
              // }
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
            , textDecorationColor: "black",
            marginBottom: scale(10)
          }}>
            {userName}
          </Text>
          <TouchableOpacity
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
              , textDecorationColor: "black"
            }}>
              {sauceName}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <CustomRating
          initialRating={item?.star}

          ratingContainerStyle={{
            pointerEvents: "none"
          }} size={10} />

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
        {date && <Text style={{
          position: "absolute",
          top: scale(10),
          right: scale(10),
          fontSize: scale(11),
          color: "white"
        }}>
          {
            formatEventDate(new Date(date), true)
          }
        </Text>}
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
              {/* <Lightbox
                // springConfig={{ tension: 30, friction: 7 }}
                activeProps={{
                  style: {
                    width: '100%',
                    height: scale(400),
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 0,
                    opacity: loading ? 0 : 1,
                  },
                }}
              > */}
              <TouchableOpacity onPress={() => {
                openImageView(index)
                //                           setCurrentIndex(index)
                // setIsVisible(true)

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

              {/* </Lightbox> */}
            </>
          ))}
        </View>

        <ImageView
          imageIndex={currentIndex}
          images={images.map(uri => ({ uri: uri }))}
          visible={visible}
          onRequestClose={closeImageView}
        />
      </View>
    </View>
  )
}

export default SingleReview

const styles = StyleSheet.create({})