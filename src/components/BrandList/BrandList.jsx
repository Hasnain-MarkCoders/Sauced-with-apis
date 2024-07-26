import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SingleBrand from '../SingleBrand/SingleBrand';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const BrandList = ({ data = [], title = "" }) => {
    const data1 = data.slice(0, data.length / 2)
    const data2 = data.slice(data.length / 2, data.length)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={{
                gap: scale(7)
            }}>

                <FlatList 
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}

                    horizontal
                    data={data1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleBrand url={item.url} title={item.title} />}
                />
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={data2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleBrand url={item.url} title={item.title} />}
                />
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: verticalScale(20)
    },
    title: {
        color: "white",
        lineHeight: verticalScale(28.8),
        fontSize: moderateScale(24),
        fontWeight: "600",
    },
    separator: {
        marginRight: scale(10)
    }
});

export default BrandList;
