import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Banner from '../Banner/Banner';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const BannerList = ({
    data = [],
    hasMore = true,
    setPage = () => {},
    loading = false,
    showText= true,
    
}) => {
    const memoData = useMemo(() => data);
    const flatListRef = useRef(null);
    const [key, setKey] = useState(0);
  
    const navigation = useNavigation()
    useEffect(() => {
        // Scroll to top when data length changes
        if (memoData.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: true, index: 0 });
        }
    }, [memoData]);

    return (
        <View style={{  }}>
            <View style={{
                // flexDirection: "row",
                gap: scale(10),
                borderWidth:.5,
                borderColor:"transparent",
                position:"relative",
            }}>
                <FlatList
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onViewableItemsChanged={({ viewableItems }) => {
                        if (viewableItems.length > 0) {
                            const visibleIndex = viewableItems[0].index;
                            setKey(visibleIndex % 8);  // Cycle through 0 to 7
                        }
                    }}
                    style={{ maxHeight: scale(130) ,position:"relative",width:"100%", border:5,
                        borderColor:"#FFA100", zIndex:9999999999}}
                    data={memoData}
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        if (!loading && hasMore) setPage(currentPage => currentPage + 1);
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Banner
                     showText={showText}
                    //   title={item?.user?.username}
                    //    url={item?.urls?.small}
                    // title={item?.user?.username}
                    url={item?.url}
                        infoText={""}/>}
                />
                <View style={{
                    flexDirection:"row",
                    justifyContent:showText ? "space-between":"flex-end"
                }}>
               {showText&& 
               <TouchableOpacity onPress={()=>navigation.navigate("EventPage")}>

               <Text style={{
                                marginTop: scale(4), fontWeight: 700,
                                textDecorationLine: "underline",
                                color: "white",
                                fontSize: scale(10),
                                lineHeight: scale(13),
                                fontFamily: "Montserrat",
                            }}>
                                Don't see your event, suggest it to us
                            </Text>
               </TouchableOpacity>}
                <View style={{
                    flexDirection:"row",
                    paddingVertical: scale(10),
                    justifyContent: "flex-start",
                    gap: scale(3),
                }}>
                    {Array.from({ length: 8 }).map((_, index) => (  // Only create 8 dots
                        <View
                            key={index}
                            style={{
                                backgroundColor: key === index ? "#FFA100" : "#D9D9D9",
                                width: scale(key === index ?5 : 5),
                                height: scale(key === index ? 5 : 5),
                                borderRadius: scale(10)
                            }}
                        />
                    ))}
                </View>
                </View>
            </View>
            {loading && <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />}
        </View>
    );
};

export default memo(BannerList);
