import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
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

const SingleSauce = ({
    url = "",
    title="",
    customStyles={},
    showPopup=false,
    setProductDetails=()=>{},
    setAlertModal=()=>{},
    item={},
    sauceType="",
}) => {

const axiosInstance = useAxios()
const navigation = useNavigation()
const dispatch = useDispatch()
const [selected, setSelected] = useState(item["hasLiked"])
const handleOnPress = ()=>{
    if(showPopup){
    setProductDetails({url, title})
    setAlertModal(true)
}else{
    navigation.navigate("ProductDetail", {url, title, item, sauceType, setSelected})
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
    } catch (error) {
        console.error('Failed to like / dislike:', error);
    } finally {
    }
}


    return (
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
            <Image
         
              source={{uri:url}}
                style={[styles.image, {objectFit:"contain"}]}

            />
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
            style={styles.text}>
              {title}
            </Text>
        {item["hasLiked"]?<Image
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
            }} source={emptyheart}/>
            }
        </TouchableOpacity>
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
