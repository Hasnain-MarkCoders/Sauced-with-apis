import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import SingleSauce from '../SingleSauce/SingleSauce';
import axios from 'axios';
import CustomAlertModal from '../CustomAlertModal/CustomAlertModal';
import useAxios from '../../../Axios/useAxios';

const ProductSearchList = ({
    title = "" , 
    setProductDetails=()=>{},
    setAlertModal=()=>{},
    style={},
    type=""
}) => {
    const axiosInstance = useAxios()
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);


    const fetchSuaces = async () => {
        // Return early if there is no more data to fetch or if it's currently loading.
        if (!hasMore || loading) return;
    
        // Set loading state to true at the beginning of the operation.
        setLoading(true);
    
        try {
            const res = await axiosInstance.get(`/get-sauces`, {
                params: {
                    type,
                    page
                }
            });
                setHasMore(res.data.pagination.hasNextPage);
                setData(prevData => [...prevData, ...res.data.sauces]);
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            // Set loading state to false after the operation is complete.
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuaces();
    }, [page, type]);

    return (
        <View style={{
            flex: 1,
            ...style,
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
                width: "31%", 
                marginHorizontal: "auto",  
                marginBottom:-20
            }
                }
                index={index} customWidth={"30%"} 
                // url={item?.urls?.small}
                //  title={item?.user?.username}  
                //  url={item?.url}
                url={item?.image}
                 title={item?.name} 
                 
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
