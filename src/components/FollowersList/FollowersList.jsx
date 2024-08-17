import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal';
import useAxios from '../../../Axios/useAxios';

const FollowersList = ({
    endpoint = "",
    numColumns = 2,
    title = "",
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    const handleOpenModal = (item) => {
        setModalTitle(`${title}  ${item.user.username}`)
        setModalVisible(true)
    }
    const handleFollow = () => {
        setModalLoading(true)
        setTimeout(() => {
            setModalLoading(false)
        }, 2000)
    }


    const fetchUsers = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(endpoint, {
                params: {
                    page: page
                }
            });
            if (endpoint?.toLocaleLowerCase().includes("followers")) {
                if (res?.data?.followers?.length === 0) {
                    setHasMore(false);
                }
                else {
                    if (res?.data && res?.data?.followers && res?.data?.followers?.length > 0) {
                        setData(prevData => [...prevData, ...res?.data?.followers]);
                    }
                }
            }
            if (endpoint?.toLocaleLowerCase().includes("following")) {
                if (res?.data?.following?.length === 0) {
                    setHasMore(false);
                }
                else {
                    if (res?.data && res?.data?.following && res?.data?.following?.length > 0) {
                        setData(prevData => [...prevData, ...res?.data?.following]);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch followers:', error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, loading, page]); // Include all relevant dependencies here


    useEffect(() => {
        fetchUsers();
    }, []);


    return (

        <View style={{
            gap: scale(20),
            flex: 1
        }}>

            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={numColumns}
                data={data}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    if (!loading && hasMore) {
                        setPage(currentPage => currentPage + 1);
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <UserCard
                    cb={handleOpenModal}
                    item={endpoint.includes("followers") ? item?.followGiverDetails : item?.followRecieverDetails}
                    // title={item?.followGiverDetails ?"Follow":"Unfollow"}
                    url={endpoint.includes("followers") ? item?.followGiverDetails?.image : item?.followRecieverDetails?.image}
                    name={endpoint.includes("followers") ? item?.followGiverDetails?.name : item?.followRecieverDetails?.name}
                    //  url={item?.urls?.small}
                    //  name={item?.user?.username} 
                    showText={false} />}

            />
            {

                loading && <ActivityIndicator size="small" color="#FFA100" />
            }
            <CustomConfirmModal cb={handleFollow} loading={modalLoading} title={modalTitle} modalVisible={modalVisible} setModalVisible={() => { setModalVisible(false) }} />

        </View>

    )
}

export default memo(FollowersList)

const styles = StyleSheet.create({})