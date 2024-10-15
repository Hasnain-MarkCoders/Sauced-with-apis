import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Easing, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import filledHeart from "./../../../assets/images/filledHeart.png"
import emptyheart from "./../../../assets/images/heart.png"
import Snackbar from 'react-native-snackbar';
import useAxios from '../../../Axios/useAxios';
import { useDispatch } from 'react-redux';


// import { handleToggleTopRatedSauce } from '../../../android/app/Redux/topRatedSauces';
// import { handleToggleFeaturedSauce } from '../../../android/app/Redux/featuredSauces';
// import { handleFavoriteSauces, handleRemoveSauceFromFavouriteSauces, handleToggleFavoriteSauce } from '../../../android/app/Redux/favoriteSauces';
// import { handleToggleCheckedInSauce } from '../../../android/app/Redux/checkedInSauces';
// import { handleToggleSauceListOne } from '../../../android/app/Redux/saucesListOne';
// import { handleToggleSauceListTwo } from '../../../android/app/Redux/saucesListTwo';
// import { handleToggleSauceListThree } from '../../../android/app/Redux/saucesListThree';
// import { handleToggleReviewedSauce } from '../../../android/app/Redux/reviewedSauces';
// import { handleToggleLikeWishlistSauce } from '../../../android/app/Redux/wishlist';



import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import TextTicker from 'react-native-text-ticker'
import LinearGradient from 'react-native-linear-gradient';
import { handleFavoriteSauces, handleRemoveSauceFromFavouriteSauces, handleToggleFavoriteSauce } from '../../Redux/favoriteSauces';
import { handleToggleFeaturedSauce } from '../../Redux/featuredSauces';
import { handleToggleTopRatedSauce } from '../../Redux/topRatedSauces';
import { handleToggleCheckedInSauce } from '../../Redux/checkedInSauces';
import { handleToggleSauceListOne } from '../../Redux/saucesListOne';
import { handleToggleSauceListTwo } from '../../Redux/saucesListTwo';
import { handleToggleSauceListThree } from '../../Redux/saucesListThree';
import { handleToggleReviewedSauce } from '../../Redux/reviewedSauces';
import { handleToggleLikeWishlistSauce } from '../../Redux/wishlist';
const SingleSauce = ({
  url = "",
  title = "",
  customStyles = {},
  showPopup = false,
  setProductDetails = () => { },
  setAlertModal = () => { },
  item = {},
  sauceType = "",
  showHeart = true,
  searchPageStyle = false,
  fullWidthText = false,
  searchPageSauceStyles = {},
  showOverlay = false,
  mycb = () => { },
  handleIncreaseReviewCount = () => { },
  handleLike = () => { },
  _id=""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [selected, setSelected] = useState({
    isChecked: item["hasLiked"]
  })
  useEffect(() => {
    console.log("selected================================================================>", selected)
  }, [selected.isChecked])

  const handleOnPress = () => {
    if (showPopup) {
      setProductDetails({ url, title })
      setAlertModal(true)
    } else {
      // navigation.navigate("ProductDetail", { url, title, item, sauceType, setSelected, handleIncreaseReviewCount, mycb, hasnain: "hanain", handleLike })
      navigation.navigate("ProductScreen", { _id,url, title, item, sauceType, setSelected, handleIncreaseReviewCount, mycb, hasnain: "hanain", handleLike })

    }
  }

  const handleToggleLike = async () => {
    console.log("_id===============>", _id)
    handleLike(item?._id, setSelected)
    try {
    //   if (sauceType == "toprated") {
    //     dispatch(handleToggleTopRatedSauce(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }
    //   }


    //   if (sauceType == "featured") {
    //     console.log("sauceType==================>", sauceType)
    //     dispatch(handleToggleFeaturedSauce(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }
    //   }
    //   if (sauceType == "favourite") {
    //     dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //   }

    //   if (sauceType == "checkedin") {
    //     dispatch(handleToggleCheckedInSauce(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }

    //   }
    //   if (sauceType == 1) {
    //     dispatch(handleToggleSauceListOne(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }


    //     if (sauceType == "reviewed") {
    //       dispatch(handleToggleReviewedSauce(item?._id))
    //       if (selected) {
    //         dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //       } else {
    //         dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //       }
    //     }

    //     if (sauceType == "wishlist") {
    //       dispatch(handleToggleLikeWishlistSauce(item?._id))
    //       if (selected) {
    //         dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //       } else {
    //         dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //       }
    //     }

    //     // console.log("hello g")

    //   }

    //   if (sauceType == 2) {
    //     dispatch(handleToggleSauceListTwo(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }

    //     // console.log("hello g")

    //   }
    //   if (sauceType == 3) {
    //     dispatch(handleToggleSauceListThree(item?._id))
    //     if (selected) {
    //       dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
    //     } else {
    //       dispatch(handleFavoriteSauces([{ ...item, hasLiked: true }]))
    //     }

    //     // console.log("hello g")

    //   }
      const res = await axiosInstance.post(`/like-sauce`, { sauceId: _id });

    } catch (error) {
      console.error('Failed to like / dislike:', error);
      dispatch(handleFavoriteSauces([item]))

    } finally {
    }
  }
  return (
    <>
      {url ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOnPress}
          style={[
            styles.container,
            { width: scale(110), ...customStyles },
          ]}
        >
          
          {isLoading && (
            <View style={[styles.skeletonContainer, styles.imageContainer]}>
              <SkeletonPlaceholder
                speed={1600}
                backgroundColor="#2E210A"
                highlightColor="#fff"
              >
                <SkeletonPlaceholder.Item
                  width={searchPageSauceStyles.width || "100%"}
                  height={searchPageSauceStyles.height || "100%"}

                  borderRadius={scale(10)}
                />
              </SkeletonPlaceholder>
            </View>
          )}

          <View style={styles.imageContainer}>
        
            <ImageBackground
              source={{ uri: url }}
              style={[styles.image, searchPageSauceStyles]}
              imageStyle={{ borderRadius: scale(10) }}
              onLoad={() => setIsLoading(false)}
            >
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 1)']}
                locations={[0, 1]}
                style={[styles.gradient, { borderRadius: scale(10) }]}
              />

              {/* Marquee Text */}
              <View style={styles.textContainer}>
                <TextTicker
                  duration={7000}
                  loop
                  bounce={false}
                  repeatSpacer={0}
                  marqueeDelay={0}
                  easing={Easing.linear}
                  isInteraction={false}
                  animationType="scroll"
                  style={styles.text}
                >
                  {title+". "}
                </TextTicker>
              </View>

              {showHeart && (
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => {
                    if (sauceType) {
                      setSelected(prev => ({
                        ...prev,
                        isChecked: !prev.isChecked
                      }));
                    }
                    handleToggleLike();
                    Snackbar.show({
                      text: !selected.isChecked
                        ? 'Liked'
                        : 'Unliked',
                      duration: Snackbar.LENGTH_SHORT,
                      // action: {
                      //   text: 'UNDO',
                      //   textColor: '#FFA100',
                      //   onPress: () => {
                      //     if (sauceType) {
                      //       setSelected(prev => ({
                      //         ...prev,
                      //         isChecked: !prev.isChecked
                      //       }));
                      //     }
                      //     handleToggleLike();
                      //   },
                      // },
                    });
                  }}
                >
                  <Image
                    style={styles.heartImage}
                    source={selected['isChecked'] ? filledHeart : emptyheart}
                  />
                </TouchableOpacity>
              )}
            </ImageBackground>
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default SingleSauce;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(10),
    height: scale(160),
  },
  skeletonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  textContainer: {
    position: 'absolute',
    bottom: scale(10),
    left: 10,
    right: 10,
    overflow: 'hidden',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  heartIcon: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    zIndex: 2,
  },
  heartImage: {
    width: scale(20),
    height: scale(18),
  },
});