import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import filledHeart from './../../../assets/images/filledHeart.png';
import emptyheart from './../../../assets/images/heart.png';
import Snackbar from 'react-native-snackbar';
import useAxios from '../../../Axios/useAxios';
import {useDispatch} from 'react-redux';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {handleFavoriteSauces} from '../../Redux/favoriteSauces';

const SingleSauce = ({
  url = '',
  title = '',
  customStyles = {},
  showPopup = false,
  setProductDetails = () => {},
  setAlertModal = () => {},
  item = {},
  sauceType = '',
  showHeart = true,
  searchPageStyle = false,
  fullWidthText = false,
  searchPageSauceStyles = {},
  showOverlay = false,
  disabled = false,
  mycb = () => {},
  handleIncreaseReviewCount = () => {},
  handleLike = () => {},
  _id = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({
    isChecked: item?.hasLiked,
  });
  const handleOnPress = () => {
    if (showPopup) {
      setProductDetails({url, title});
      setAlertModal(true);
    } else {
      navigation.navigate('ProductScreen', {
        _id,
        url,
        title,
        item,
        sauceType,
        setSelected,
        handleIncreaseReviewCount,
        mycb,
        hasnain: 'hanain',
        handleLike,
      });
    }
  };

  const handleToggleLike = async () => {
    console.log('_id===============>', _id);
    handleLike(item?._id, setSelected);
    try {
      const res = await axiosInstance.post(`/like-sauce`, {sauceId: _id});
    } catch (error) {
      console.error('Failed to like / dislike:', error);
      dispatch(handleFavoriteSauces([item]));
    } finally {
    }
  };

  return (
    <>
      {url ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={!disabled ? handleOnPress : null}
          style={[styles.container, {width: scale(110), ...customStyles}]}>
          {isLoading && (
            <View style={[styles.skeletonContainer, styles.imageContainer]}>
              <SkeletonPlaceholder
                speed={1600}
                backgroundColor="#2E210A"
                highlightColor="#fff">
                <SkeletonPlaceholder.Item
                  width={searchPageSauceStyles.width || '100%'}
                  height={searchPageSauceStyles.height || '100%'}
                  borderRadius={scale(10)}
                />
              </SkeletonPlaceholder>
            </View>
          )}

          <View style={styles.imageContainer}>
            <ImageBackground
              source={{uri: url}}
              style={[
                styles.image,
                {
                  opacity: isLoading ? 0 : 1,
                  position: isLoading ? 'absolute' : 'relative',
                },
                searchPageSauceStyles,
              ]}
              imageStyle={{borderRadius: scale(10)}}
              onLoad={() => setIsLoading(false)}>
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 1)']}
                locations={[0, 0.8]}
                style={[styles.gradient, {borderRadius: scale(10)}]}
              />

              {/* Marquee Text */}
              <View style={styles.textContainer}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  {title}
                </Text>
              </View>

              {showHeart && (
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => {
                    if (sauceType) {
                      setSelected(prev => ({
                        ...prev,
                        isChecked: !prev.isChecked,
                      }));
                    }
                    handleToggleLike();
                    Snackbar.show({
                      text: !selected.isChecked ? 'Liked' : 'Unliked',
                      duration: Snackbar.LENGTH_SHORT,
                    });
                  }}>
                  <Image
                    style={styles.heartImage}
                    source={selected.isChecked ? filledHeart : emptyheart}
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
