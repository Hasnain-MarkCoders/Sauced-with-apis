import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import moreIcon from "./../../../assets/images/more.png"
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleIncreaseReviewCountOfTopRatedSauce, handleTopRatedSauces  } from '../../Redux/topRatedSauces';
import NotFound from '../NotFound/NotFound';
// import { handleIncreaseReviewCountOfTopRatedSauce, handleTopRatedSauces } from '../../../android/app/Redux/topRatedSauces';

const TopRatedSaucesList = ({ title = "", name = "", showMoreIcon = false, cb = () => { }, refresh=false }) => {
    const [page, setPage] = useState(1)
    const axiosInstance = useAxios()
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0)
    const dispatch = useDispatch()
    const topRatedSauces = useSelector(state=>state.topRatedSauces)
    const handleIncreaseReviewCount = useCallback((_id , setReviewCount, reviewCount)=>{
        setReviewCount(reviewCount+1)
        dispatch(handleIncreaseReviewCountOfTopRatedSauce({_id, setReviewCount}))
    },[])

    const fetchSauces = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
    
        try {
            const res = await axiosInstance.get("/get-sauces", {
                params: {
                    type:"toprated",
                    page
                }
            });
                 setHasMore(res.data.pagination.hasNextPage);
                 dispatch(handleTopRatedSauces(res?.data?.sauces))
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            setLoading(false);
        }
    },[page,hasMore , topRatedSauces]);
    
    useEffect(() => {
        fetchSauces();
    }, [fetchSauces, refresh]);
  




    return (
        <>
        <View style={styles.container}>
            <View style={{
                flexDirection: "row", gap: scale(10)
            }}>
                {name && <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.title, { maxWidth: scale(100) }]}>{name}</Text>}
                {title && <Text style={[styles.title]}>{title}</Text>}
            </View>

            {  topRatedSauces?.length>0 ? (

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
                    data={topRatedSauces}
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
                    sauceType="toprated"
                    item={item}
                        url={item?.image}
                        title={item?.name}
                    />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                {(showMoreIcon && selected == topRatedSauces?.length - 1) && <TouchableOpacity
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

) : !loading ? (
    <View
      style={{
        marginBottom: scale(20),
      }}>
      <NotFound title="No sauces added yet." />
    </View>
  ) : null}
  {loading && (
    <ActivityIndicator
      size="small"
      style={{marginBottom: scale(20)}}
      color="#FFA100"
    />
  )}
          
        </View>
        </>
    );
};

export default TopRatedSaucesList;

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
