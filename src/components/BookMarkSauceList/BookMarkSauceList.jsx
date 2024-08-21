import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import moreIcon from "./../../../assets/images/more.png"
import useAxios from '../../../Axios/useAxios';
import { useSelector } from 'react-redux';

const BookMarkSauceList = ({ title = "", _id="", name = "",endpoint="/bookmarks", showMoreIcon = false, cb = () => { }, type="" }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const axiosInstance = useAxios()
    const refetch = useSelector(state=>state.refetch)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0)

    const fetchSuaces = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
    
        try {
            const res = await axiosInstance.get(endpoint, {
                params: {
                    type,
                    _id,
                    page
                }
            });

                setHasMore(res.data.pagination.hasNextPage);
                setData(prevData => [...prevData, ...res?.data?.items]);
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuaces();
    }, [page, type, _id, refetch]);



    return (
        <>

                    <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 1,1]}
                    renderItem={({ item, index }) => {

                        return(<View style={{
                            flex:1
                        }}>
                            {
                                index==0&& data.length>0&& <View style={styles.container}>
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
                                            <TouchableOpacity onPress={fetchSuaces}><Text>refresh</Text></TouchableOpacity>
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

                        </View>)
                    }}
                    />
        </>
    );
};

export default BookMarkSauceList;

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
