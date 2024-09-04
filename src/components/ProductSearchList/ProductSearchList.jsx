import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import useAxios from '../../../Axios/useAxios';
const windowWidth = Dimensions.get('window').width;
const ProductSearchList = ({
    title = "",
    setProductDetails = () => { },
    setAlertModal = () => { },
    style = {},
    type = "",
    showHeart=false,
    searchTerm = "",
}) => {
    const axiosInstance = useAxios()
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);

    const fetchSauces = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        const endpoint = searchTerm ? "/search-sauces" : "/get-sauces";

        try {
            const res = await axiosInstance.get(endpoint, {
                params: { type, page, searchTerm }
            });
            setHasMore(res.data.pagination.hasNextPage);
            setData(prev => [...prev, ...res.data.sauces]);
        } catch (error) {
            console.error('Failed to fetch sauces:', error);
            setAlertModal({
                open: true,
                message: "Failed to fetch sauces, please try again."
            });
        } finally {
            setLoading(false);
        }
    }, [hasMore, page, searchTerm, type]);


    useEffect(() => {
        fetchSauces();
    }, [fetchSauces]);

    useEffect(() => {
        if (searchTerm) {
            setData([]);
            setHasMore(true);
            setPage(1);
        }
    }, [searchTerm]);

    return (
        <View style={{
            flex: 1,
            ...style,
        }}>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:scale(150), gap:scale(10)}}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!loading && hasMore) {
                        setPage(currentPage => currentPage + 1);
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <SingleSauce
                fullWidthText={true}
                searchPageStyle={true}
                showHeart={showHeart}
                    setProductDetails={setProductDetails}
                    setAlertModal={setAlertModal}
                    showPopup={false}
                    customStyles={

                        {
                            width: scale((windowWidth))/4.3,
                            marginBottom:scale(-20),
                            marginHorizontal: "auto",
                        }
                    }
                    index={index}
                    item={item}
                    url={item?.image}
                    title={item?.name}

                />}
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
