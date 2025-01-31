import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import moreIcon from "./../../../assets/images/more.png"
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleIncreaseReviewCountOfListTwoSauce, handleSaucesListTwo } from '../../Redux/saucesListTwo';
// import { handleIncreaseReviewCountOfListTwoSauce, handleSaucesListTwo } from '../../../android/app/Redux/saucesListTwo';


const SaucesListTwo = ({ title = "", name = "", showMoreIcon = false, cb = () => { }, refresh=false }) => {
    const [page, setPage] = useState(1)
    const axiosInstance = useAxios()
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0)
    const dispatch = useDispatch()
    const saucesListTwo = useSelector(state=>state.saucesListTwo)
    const handleIncreaseReviewCount = useCallback((_id , setReviewCount, reviewCount)=>{
        setReviewCount(reviewCount+1)
        dispatch(handleIncreaseReviewCountOfListTwoSauce({_id, setReviewCount}))
    },[])

    const fetchSauces = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get("/bookmarks", {
                params: {
                    type:2,
                    page
                }
            });

                 setHasMore(res.data.pagination.hasNextPage);
                 dispatch(handleSaucesListTwo(res?.data?.items))
        } catch (error) {
            console.error('Failed to fetch sauces:', error);
        } finally {
            setLoading(false);
        }
    },[page,hasMore , saucesListTwo, refresh]);
    
    useEffect(() => {
        fetchSauces();
    }, [fetchSauces]);
  




    return (
        <>
        {

saucesListTwo?.length>0&&<View style={styles.container}>
            <View style={{
                flexDirection: "row", gap: scale(10)
            }}>
                {name && <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.title, { maxWidth: scale(100) }]}>{name}</Text>}
                {title && <Text style={[styles.title]}>{title}</Text>}
            </View>
            <View style={{
                gap: scale(20),
                flexDirection: "row", alignItems: "center",
            }}>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingRight: selected ? scale(60) : scale(0)
                    }}
                    horizontal
                    onViewableItemsChanged={({ viewableItems }) => {

                        if (viewableItems.length > 0) {
                            setSelected(viewableItems[viewableItems.length - 1]["index"]);  // Cycle through 0 to 7
                        }

                    }}
                    data={saucesListTwo}
                    extraData={saucesListTwo}
                    scrollEventThrottle={16}
                    onEndReachedThreshold={0.5}

                    onEndReached={() => {
                        if (!loading && hasMore) {
                            setPage(currentPage => currentPage + 1);
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleSauce
                    _id={item?._id}
                    hasLiked={item?.hasLiked}
                    handleIncreaseReviewCount={handleIncreaseReviewCount}
                    sauceType={2}
                    item={item}
                        url={item?.image}
                        title={item?.name}
                    />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                {(showMoreIcon && selected == saucesListTwo?.length - 1) && <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: "0%",
                        zIndex: 111
                    }}
                    onPress={() => { cb() }}>
                        <TouchableOpacity onPress={fetchSauces}><Text>refresh</Text></TouchableOpacity>
                    <Image style={{

                        resizeMode: "contain",
                        width: scale(40),
                        height: scale(40)
                    }} source={moreIcon} />

                </TouchableOpacity>}
            </View>
            {

                loading && <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
            }
        </View>
        }
        </>
    );
};

export default SaucesListTwo;

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
