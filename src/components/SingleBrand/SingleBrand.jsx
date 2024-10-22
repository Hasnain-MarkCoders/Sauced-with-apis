import { useNavigation } from '@react-navigation/native';
import React, {  useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'


const SingleBrand = ({
    url = "",
    title="",
    item=null
}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true);

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
              {isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item              width={"100%"}
            height={"100%"}
            borderRadius={scale(8)}

            />
        </SkeletonPlaceholder>
      )}
            <Image
              onLoad={() => setIsLoading(false)}

                source={{uri:url}}
                style={{
                    opacity:isLoading?0:1,
                    position:isLoading?"absolute":"relative",
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
