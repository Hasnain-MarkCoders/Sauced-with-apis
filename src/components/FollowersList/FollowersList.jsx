import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleFollowers, handleRemoveUserFromFollowers } from '../../../android/app/Redux/followers';

const FollowersList = ({
    numColumns = 2,
}) => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    const followings = useSelector(state=>state?.followings)
    const dispatch = useDispatch()
 
    const fetchFollowers = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get("/get-followers", {
                params: {
                    page: page
                }
            });
            setHasMore(res.data.pagination.hasNextPage)
            dispatch(handleFollowers(res?.data?.data))
            
        } catch (error) {
            console.error('Failed to fetch followers:', error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, page]); // Include all relevant dependencies here


    useEffect(() => {
        fetchFollowers();
    }, [fetchFollowers]);

    const handleUser =  useCallback(async(user)=>{
        dispatch(handleUsers([user]))
        dispatch(handleRemoveUserFromFollowers(user?._id))
        await axiosInstance.post("/follow", {_id:user?._id});
          },[])

    return (

        <View style={{
            gap: scale(20),
            flex: 1
        }}>

            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={numColumns}
                data={followings}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    if (!loading && hasMore) {
                        setPage(currentPage => currentPage + 1);
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => 
                <UserCard
                cb={handleUser}
                title={"Follow"}
                _id={item?._id}
                item={item}
                url={item.image}
                name={item?.name}
                showText={false}
                     />
                    }

            />
            {

                loading && <ActivityIndicator size="small" color="#FFA100" />
            }
        </View>

    )
}

export default memo(FollowersList)

const styles = StyleSheet.create({})