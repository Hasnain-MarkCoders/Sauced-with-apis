import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SingleBrand = ({
    url = "",
}) => {
    return (
        <View style={styles.container}>
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
