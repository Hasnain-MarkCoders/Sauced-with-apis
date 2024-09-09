import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import filledHeart from "./../../../assets/images/filledHeart.png"
import emptyheart from "./../../../assets/images/heart.png"
import Snackbar from 'react-native-snackbar';
import useAxios from '../../../Axios/useAxios';
import { useDispatch } from 'react-redux';
import { handleToggleTopRatedSauce } from '../../../android/app/Redux/topRatedSauces';
import { handleToggleFeaturedSauce } from '../../../android/app/Redux/featuredSauces';
import { handleToggleFavoriteSauce } from '../../../android/app/Redux/favoriteSauces';
import { handleToggleCheckedInSauce } from '../../../android/app/Redux/checkedInSauces';
import { handleToggleSauceListOne } from '../../../android/app/Redux/saucesListOne';
import { handleToggleSauceListTwo } from '../../../android/app/Redux/saucesListTwo';
import { handleToggleSauceListThree } from '../../../android/app/Redux/saucesListThree';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SingleSauce = ({
    url = "",
    title="",
    customStyles={},
    showPopup=false,
    setProductDetails=()=>{},
    setAlertModal=()=>{},
    item={},
    sauceType="",
    showHeart=true,
    searchPageStyle=false,
    fullWidthText= false,
}) => {
 const [isLoading, setIsLoading] = useState(true);
const axiosInstance = useAxios()
const navigation = useNavigation()
const dispatch = useDispatch()
const [selected, setSelected] = useState(item["hasLiked"])
const handleOnPress = ()=>{
    if(showPopup){
    setProductDetails({url, title})
    setAlertModal(true)
}else{
    navigation.navigate("ProductDetail", {url, title, item, sauceType, setSelected, })
}
}


const handleToggleLike=async()=>{
    try {
        const res = await axiosInstance.post(`/like-sauce`, {sauceId:item?._id});


        if (sauceType=="toprated"){
            dispatch(handleToggleTopRatedSauce(item?._id))
            setSelected(prev=>!prev)
        }


        if (sauceType=="featured"){
            dispatch(handleToggleFeaturedSauce(item?._id))
            setSelected(prev=>!prev)
        }

        if (sauceType=="favourite"){
            dispatch(handleToggleFavoriteSauce(item?._id))
        }
        
        if (sauceType=="checkedin"){
            dispatch(handleToggleCheckedInSauce(item?._id))
        }
        if (sauceType==1){
            dispatch(handleToggleSauceListOne(item?._id))
        }

        if (sauceType==2){
            dispatch(handleToggleSauceListTwo(item?._id))
        }
        if (sauceType==3){
            dispatch(handleToggleSauceListThree(item?._id))
        }
    } catch (error) {
        console.error('Failed to like / dislike:', error);
    } finally {
    }
}


    return (
        <>
        {
        url?
        <TouchableOpacity
        
        activeOpacity={.8}
        onPress={()=>{handleOnPress()}}
        onLongPress={()=>{
            handleToggleLike()
            setSelected(prev=>!prev)
            Snackbar.show({
                text: !selected? 'You love this Sauce.' : "You unlove this Sauce.",
                duration: Snackbar.LENGTH_SHORT,
                action: {
                    text: 'UNDO',
                    textColor: '#FFA100',
                    onPress: () => {
                        handleToggleLike()
                        setSelected(prev => !prev)
                    },
                },
            });
        
        }}
        style={[styles.container,
            {width:scale(110), ...customStyles},
        ]}>

{isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item  width="100%" height={searchPageStyle?scale(140):"100%"} marginTop={searchPageStyle?20:0} borderRadius={10}  />
        </SkeletonPlaceholder>
      )}
      <Image
        source={{ uri: url }}
        style={[styles.image, { objectFit: "contain" }]}
        onLoad={() => setIsLoading(false)}
      />
            <Text
            style={[styles.text, {width:fullWidthText?"90%":"60%"}]}>
              {title}
            </Text>
        {   showHeart&& (item["hasLiked"]?<Image
        style={{
                width:scale(17),
                height:scale(15),
                position:"absolute",
                bottom:scale(20),
                right:scale(10),
            }} source={filledHeart}/>
            : <Image
            style={{
                width:scale(17),
                height:scale(15),
                position:"absolute",
                bottom:scale(20),
                right:scale(10),
            }} source={emptyheart}/>)
            }
        </TouchableOpacity>
        :null
        }
        </>
    );
};

export default SingleSauce;

const styles = StyleSheet.create({
    container: {
        borderRadius: scale(7),
        height: scale(160),
        position:"relative",
        borderRadius:scale(10),
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit:"contain",
        borderRadius:scale(10)

    },
    text:{
      position:"absolute",
      bottom:scale(20),
      left:10,
      color:"white",
      width:"60%",
    }
});
