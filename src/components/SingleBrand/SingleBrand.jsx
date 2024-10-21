import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SingleBrand = ({
    url = "",
    title="",
    item=null
}) => {
    const navigation = useNavigation()

    return (

        <TouchableOpacity
        onPress={
           ()=>{
            navigation.navigate("BrandScreen", {url, title, item})
           }
        }
        >
        <View
        
        style={styles.container}>
            <Image
                source={{uri:url}}
                style={{
                    width:"100%",
                    height:"100%",
                    borderRadius: scale(6),
                    // objectFit:"contain"

                }}
            />
           
        </View>
        </TouchableOpacity>
    );
};

export default SingleBrand;

const styles = StyleSheet.create({
    container: {
        width:scale(80),
        marginRight:scale(10),
        height:scale(50),
        borderRadius: scale(7),
      elevation:5
    },
});
