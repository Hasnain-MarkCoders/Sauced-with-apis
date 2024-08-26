import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SingleSauce from '../SingleSauce/SingleSauce';
import useAxios from '../../../Axios/useAxios';

const ProductSearchList = ({
    title = "",
    setProductDetails = () => { },
    setAlertModal = () => { },
    style = {},
    type = "",
    searchTerm = "",
}) => {
    const axiosInstance = useAxios()
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);

    // const fetchSuaces = async () => {
    //  const tempEndPoint = searchTerm?"/search-sauces":"/get-sauces"
    //     if (!hasMore || loading) return;
    //      setLoading(true);

    //      try {
    //          const res = await axiosInstance.get(tempEndPoint, {
    //              params: {
    //                  type,
    //                  page,
    //                  searchTerm
    //              }
    //          });

    //              setHasMore(res.data.pagination.hasNextPage);
    //              setData(prev=>[...prev, ...res.data.sauces]);

    //      } catch (error) {
    //          console.error('Failed to fetch photos:', error);
    //      } finally {
    //          setLoading(false);
    //  }
    // };

    // useEffect(() => {
    //     fetchSuaces();
    //     if(searchTerm){
    //         setData([])
    //         setHasMore(true)
    //         setPage(1)
    //     }
    // }, [page, type, searchTerm]);






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
                    setProductDetails={setProductDetails}
                    setAlertModal={setAlertModal}
                    showPopup={false}
                    customStyles={

                        {
                            width: "31%",
                            marginHorizontal: "auto",
                            marginBottom: -20
                        }
                    }
                    index={index} customWidth={"30%"}
                    item={item}

                    // url={item?.urls?.small}
                    //  title={item?.user?.username}  
                    //  url={item?.url}
                    url={item?.image}
                    title={item?.name}

                />}
                contentContainerStyle={{
                    justifyContent: 'space-between',
                    paddingBottom: scale(120)
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
