import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import SingleSauce from '../SingleSauce/SingleSauce';
import axios from 'axios';
import moreIcon from "./../../../assets/images/more.png"
import useAxios from '../../../Axios/useAxios';

const SauceList = ({ title = "",  name = "",isCheckedIn=false, searchTerm = "", showMoreIcon = false, cb = () => { }, type="toprated" }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
  const axiosInstance = useAxios()

    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0)

    const [isEndReached, setIsEndReached] = useState(false);
    const flatListRef = useRef(); // Reference to the FlatList

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const flatListWidth = event.nativeEvent.layoutMeasurement.width;
        const contentWidth = event.nativeEvent.contentSize.width;

        // Check if the end of the flat list is reached
        if (scrollPosition + flatListWidth >= contentWidth - 100) { // 100 can be adjusted based on when you want to trigger the end
            setIsEndReached(true);
        } else {
            setIsEndReached(false);
        }
    };




    // useEffect(() => {
    //     const fetchPhotos = async () => {
    //         if (!searchTerm?.trim()) {
    //             return
    //         }
    //         if (loading) return;
    //         setLoading(true);
    //         try {
    //             const res = await axios.get(`${UNSPLASH_URL}/search/photos`, {
    //                 params: {
    //                     client_id: VITE_UNSPLASH_ACCESSKEY,
    //                     page: page,
    //                     query: searchTerm
    //                 }
    //             });

    //             setData(prev => [ ...res.data.results,...prev]);

    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchPhotos();
    // }, [searchTerm, page]);

    // useEffect(() => {
    //     const fetchPhotos = async () => {
    //         if (!hasMore || loading) return;

    //         setLoading(true);
    //         try {
    //             const res = await axios.get(`${UNSPLASH_URL}/photos`, {
    //                 params: {
    //                     client_id: VITE_UNSPLASH_ACCESSKEY,
    //                     page: page
    //                 }
    //             });
    //             if (res.data.length === 0) {
    //                 setHasMore(false);
    //             } else {
    //                 setData(prevData => [...prevData, ...res.data]);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchPhotos();
    // }, [page]);

    const fetchPhotos = async () => {
        if (!hasMore || loading) return;
        console.log(type)

        setLoading(true);
        try {
            const res = await axiosInstance.get(`/get-sauces`, {
                params: {
                    type,
                    page: page
                }
            });
            console.log("res?.data?.sauces=====>", res?.data?.sauces)

            if (res?.data?.length === 0) {
                setHasMore(false);
            } else {
                if(res?.data && res?.data?.sauces&& res?.data?.sauces?.length){
                    setData(prevData => [...prevData, ...res?.data?.sauces]);;
                }
            }
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, [page]);



    return (
        <>
        {

data?.length>0&&<View style={styles.container}>
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
                    onScroll={handleScroll}
                    onViewableItemsChanged={({ viewableItems }) => {

                        if (viewableItems.length > 0) {
                            setSelected(viewableItems[viewableItems.length - 1]["index"]);  // Cycle through 0 to 7
                        }

                    }}
                    data={data}
                    scrollEventThrottle={16}
                    onEndReachedThreshold={0.5}

                    onEndReached={() => {
                        if (!loading && hasMore) {
                            setPage(currentPage => currentPage + 1);
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleSauce
                    item={item}

                        // url={item?.urls?.small} 
                        // url={item.url}
                        url={item?.image}

                        // title={item?.user?.username}
                        title={item?.name}


                    />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                {(showMoreIcon && selected == data?.length - 1) && <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: "0%",
                        zIndex: 111
                    }}
                    onPress={() => { cb() }}>
                        <TouchableOpacity onPress={fetchPhotos}><Text>refresh</Text></TouchableOpacity>
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

export default SauceList;

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
