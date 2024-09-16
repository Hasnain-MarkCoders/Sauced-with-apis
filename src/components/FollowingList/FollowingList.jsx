import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleFollowingSearch, handleFollowings, handleRemoveUserFromFollowings } from '../../../android/app/Redux/followings';
import { handleStats, handleStatsChange } from '../../../android/app/Redux/userStats';
import {debounce} from 'lodash'
const FollowingList = ({
    numColumns = 2,
    searchTerm="",
    _id="",
}) => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    const followings = useSelector(state=>state?.followings)
    const dispatch = useDispatch()

    const fetchFollowings = useCallback(async () => {
        if (!hasMore || loading) return;
        if(searchTerm) return

        setLoading(true);
        try {
            const res = await axiosInstance.get("/get-following", {
                params: {
                    page: page,
                    _id
                }
            });
            setHasMore(res.data.pagination.hasNextPage)
            dispatch(handleFollowings(res?.data?.data))
            console.log("res?.data?.data=====================================================================================>", res?.data?.data)
            
        } catch (error) {
            console.error('Failed to fetch followers:', error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, page]); // Include all relevant dependencies here



    const fetchFollowingWithSearchTerm = useCallback(debounce(async () => {
        if(!searchTerm) return
        if (!hasMore || loading) return;
        
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/search-following`, {
                params: {
                    page: page,
                    searchTerm
                }
            });
      
            setHasMore(res?.data?.pagination?.hasNextPage);
            dispatch(handleFollowingSearch(res?.data?.data));
            console.log(res?.data?.data)
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
            console.log(searchTerm)
        }
      }, 1000, {  trailing: true }), [page, searchTerm, hasMore]); // Include all dependencies here
      
      useEffect(() => {
          setHasMore(true);
          setPage(1);
          fetchFollowingWithSearchTerm();
      }, [fetchFollowingWithSearchTerm]);

    useEffect(() => {
        fetchFollowings();
    }, [fetchFollowings]);



    const handleUser =  useCallback(async(user)=>{
        dispatch(handleUsers([{...user, isFollowing:false}]))
        dispatch(handleRemoveUserFromFollowings(user?._id))
        dispatch(handleStatsChange({
            followings:-1,
            }))
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
                title={item?.isFollowing?"Unfollow":"Follow back"}
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

export default memo(FollowingList)

const styles = StyleSheet.create({})