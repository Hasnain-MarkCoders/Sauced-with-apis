import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import filledHeart from "./../../../assets/images/filledHeart.png"
import emptyheart from "./../../../assets/images/heart.png"
import Snackbar from 'react-native-snackbar';

const SingleSauce = ({
    url = "",
    title="",
    customStyles={}
}) => {

const navigation = useNavigation()
const [selected, setSelected] = useState(false)
    return (
        <TouchableOpacity
        activeOpacity={.8}
        onPress={()=>{navigation.navigate("ProductDetail", {url, title})}}
        onLongPress={()=>{
            setSelected(prev=>!prev)
            Snackbar.show({
                text: !selected? 'You love this Sauce.' : "You unlove this Sauce.",
                duration: Snackbar.LENGTH_SHORT,
                action: {
                    text: 'UNDO',
                    textColor: '#FFA100',
                    onPress: () => {

                        setSelected(prev => !prev)
                    },
                },
            });
        
        }}
        
        style={[styles.container,
            {width:scale(110), ...customStyles},
            
        ]}>
            <Image
            //   source={{uri:url}}
            source={url}

                style={[styles.image, {objectFit:"contain"}]}
            />
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
            style={styles.text}>
              {title}
            </Text>

        {selected?  <Image
            // onPress={()=>{
            //     setSelected(prev=> !prev)
            // }

            // }
        
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
