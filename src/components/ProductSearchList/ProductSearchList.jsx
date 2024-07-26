import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import SingleSauce from '../SingleSauce/SingleSauce';
import axios from 'axios';

const ProductSearchList = ({
    
    title = "" , 
    setPage =()=>{},
    data=[],
    loading=false,
    hasMore=true
}) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!loading && hasMore) {
                        setPage(currentPage => currentPage + 1);
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item , index}) => <SingleSauce
                customStyles={
                    
            {
                width: "31%",  // Each item takes up 30% of the grid width
                marginHorizontal: "auto",  // Consistent spacing between items
                // marginBottom: scale(10)  // Vertical spacing
                marginBottom:-20
            }
                }
                index={index} customWidth={"30%"} 
                // url={item?.urls?.small}
                //  title={item?.user?.username}  
                 url={item?.url}
                 title={item?.title} 
                 
                 />}
                contentContainerStyle={styles.listContent}
            />
            {loading && (
                <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
 
    listContent: {
        justifyContent: 'space-between',
        paddingBottom:scale(120)
    },
    separator: {
        // marginRight:scale(20)
    }
});

export default ProductSearchList;
