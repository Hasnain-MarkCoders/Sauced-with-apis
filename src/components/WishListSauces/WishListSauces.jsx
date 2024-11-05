import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { scale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';

import NotFound from '../NotFound/NotFound';
import { handleIncreaseReviewCountOfWishListSauce, handleWishList  } from '../../Redux/wishlist';

const WishListSauces = ({ title = "", name = "", show = false, cb = () => { }, refresh=false }) => {
    const [page, setPage] = useState(1)
    const axiosInstance = useAxios()
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const wishListSlices = useSelector(state=>state.wishlist)
    const handleIncreaseReviewCount = useCallback((_id , setReviewCount, reviewCount)=>{
        setReviewCount(reviewCount+1)
        dispatch(handleIncreaseReviewCountOfWishListSauce({_id, setReviewCount}))
    },[])

    const fetchSauces = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get("/wishlist", {
                params: {
                    page
                }
            });
                 setHasMore(res.data.pagination.hasNextPage);
                 dispatch(handleWishList(res?.data?.items))
                 setLoading(false);

        } catch (error) {
            console.error('Failed to fetch sauces:', error);
        } finally {
            setLoading(false);
        }
    },[page,hasMore , wishListSlices, refresh]);
    
    useEffect(() => {
        fetchSauces();
    }, [fetchSauces]);
  
useEffect(()=>{
console.log("from wishlist loading==================================>", loading)
},[loading])



    return (
        <>
        {

<View style={[styles.container, {marginBottom:scale(30)}]}>
            <View style={{
                flexDirection: "row", gap: scale(10)
            }}>
                {name && <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.title, { maxWidth: scale(100) }]}>{name}</Text>}
                {title && <Text style={[styles.title]}>{title}</Text>}
            </View>
            {
                wishListSlices?.length>0?

                <View style={{
                    gap: scale(20),
                    flexDirection: "row", alignItems: "center",
                }}>

                    <FlashList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={wishListSlices}
                        scrollEventThrottle={16}
                        onEndReachedThreshold={0.5}

                        onEndReached={() => {
                            if (!loading && hasMore) {
                                setPage(currentPage => currentPage + 1);
                            }
                        }}
                        extraData={loading||refresh}

                        keyExtractor={(item, index) => `${item?._id} ${index.toString()}`}
                        estimatedItemSize={200}
                        renderItem={({ item }) => <SingleSauce
                        hasLiked={item?.hasLiked}
                        _id={item?._id}
                        isDisabled={loading}
                        handleIncreaseReviewCount={handleIncreaseReviewCount}
                        sauceType={"wishlist"}
                        item={item}
                            url={item?.image}
                            title={item?.name}
                        />}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                
                </View>
                :
                !loading
                ?
                <NotFound
                title='No sauces added yet.'
                />
                :null
            }
            {

                loading && <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
            }
        </View>
        }
        </>
    );
};

export default WishListSauces;

const styles = StyleSheet.create({
    container: {
        gap: scale(20), // This property might not work as expected in all RN versions. If it doesn't, consider adding margins manually in child components.
    },
    title: {
        color: "white",
        lineHeight: scale(29),
        fontSize: scale(24),
        fontWeight: "600",
    },
    separator: {
        marginRight: scale(20),
    }
});
