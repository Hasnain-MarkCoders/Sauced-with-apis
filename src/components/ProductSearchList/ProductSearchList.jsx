import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import SingleSauce from '../SingleSauce/SingleSauce';
import axios from 'axios';
import CustomAlertModal from '../CustomAlertModal/CustomAlertModal';

const ProductSearchList = ({
    title = "" , 
    setPage =()=>{},
    data=[],
    loading=false,
    hasMore=true,
    setProductDetails=()=>{},
    setAlertModal=()=>{},
    style={}
}) => {

    return (
        <View style={{
            flex: 1,
            ...style
        }}>
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
                setProductDetails={setProductDetails}
                setAlertModal={setAlertModal}
                showPopup={true}
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
                contentContainerStyle={{
                    justifyContent: 'space-between',
                    paddingBottom:scale(120)
                }}
            />
            {loading && (
                <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
            )}
              
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      
    },

});

export default ProductSearchList;
