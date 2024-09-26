import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import useAxios from '../../../Axios/useAxios';
import { handleFavoriteSauces, handleRemoveSauceFromFavouriteSauces } from '../../../android/app/Redux/favoriteSauces';
import { useDispatch } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const ProductSearchList = ({
    setProductDetails = () => { },
    setAlertModal = () => { },
    style = {},
    type = "",
    showHeart = false,
    searchTerm = "",
    getQueryData = () => { }
}) => {
    const axiosInstance = useAxios()
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

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

            getQueryData(res?.data?.sauces)

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
    const handleIncreaseReviewCount = useCallback((id, setReviewCount) => {
        setData(prev => {
            return prev.map(item => {
                if (item._id == id) {
                    setReviewCount(item?.reviewCount + 1)
                    console.log(item)
                    return { ...item, reviewCount: item?.reviewCount + 1 }
                } else {
                    return item
                }
            })
        })

    }, [])

    const handleLike = useCallback((id, setproductStatus) => {
       
        setData(prev => {
            return prev.map(item => {
                if (item._id == id) {
                  
                    setproductStatus(
                        {
                            ...prev,
                            isChecked: !item?.hasLiked
                        }
                    )
                    if(item?.hasLiked){
                                    dispatch(handleRemoveSauceFromFavouriteSauces(id))
                                }else{
                                    dispatch(handleFavoriteSauces([{...item, hasLiked:true}]))
                                }

                    return { ...item, hasLiked: !item?.hasLiked }
                } else {
                    return item
                }
            })
        })

    }, [])


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
                contentContainerStyle={{ paddingBottom: scale(150), gap: scale(10) }}
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
                    handleLike={handleLike}
                    handleIncreaseReviewCount={handleIncreaseReviewCount}
                    mycb={setData}
                    searchPageSauceStyles={{
                        objectFit: "cover", width: scale(90), height: scale(130)
                    }}
                    fullWidthText={true}
                    searchPageStyle={true}
                    showHeart={showHeart}
                    setProductDetails={setProductDetails}
                    setAlertModal={setAlertModal}
                    showPopup={false}
                    customStyles={

                        {
                            width: (windowWidth) / 3.8,
                            marginBottom: scale(-30),
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
                <ActivityIndicator size="small" style={{ marginBottom: scale(100) }} color="#FFA100" />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {

    },

});

export default ProductSearchList;
