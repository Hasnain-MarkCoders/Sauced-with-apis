import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import filledHeart from "./../../../assets/images/filledHeart.png"
import emptyheart from "./../../../assets/images/heart.png"
import Snackbar from 'react-native-snackbar';
import useAxios from '../../../Axios/useAxios';

const SingleSauce = ({
    url = "",
    title="",
    customStyles={},
    showPopup=false,
    setProductDetails=()=>{},
    setAlertModal=()=>{},
    endpoint="",
    item={},
    refetch=false,
    fetchSuaces=()=>{},
    setSaucesData=()=>{}
}) => {
const axiosInstance = useAxios()
const navigation = useNavigation()
const [selected, setSelected] = useState(item["hasLiked"])
const handleOnPress = ()=>{
    if(showPopup){
    setProductDetails({url, title})
    setAlertModal(true)
}else{
    navigation.navigate("ProductDetail", {url, title, item, fetchSuaces, setSaucesData})
}
}


const handleToggleLike=async()=>{
    try {
        const res = await axiosInstance.post(`/like-sauce`, {sauceId:item?._id});
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

        {selected?  <Image
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
