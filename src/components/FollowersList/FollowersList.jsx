import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleFollowers, handleFollowersSearch, handleRemoveUserFromFollowers } from '../../../android/app/Redux/followers';
import {debounce} from 'lodash'
import { useNavigation } from '@react-navigation/native';
const FollowersList = ({
    numColumns = 2,
    searchTerm="",
    _id=""
}) => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    const followers = useSelector(state=>state?.followers)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const fetchFollowers = useCallback(async () => {
        if(searchTerm) return
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get("/get-followers", {
                params: {
                    page: page,
                    _id
                }
            });
            setHasMore(res.data.pagination.hasNextPage)
            dispatch(handleFollowers(res?.data?.data))
            console.log("res?.data?.data==========================================>", res?.data?.data)

            
        } catch (error) {
            console.error('Failed to fetch followers:', error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, page]); // Include all relevant dependencies here



    const fetchFollowersWithSearchTerm = useCallback(debounce(async () => {
        if(!searchTerm) return

        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/search-followers`, {
                params: {
                    page: page,
                    searchTerm
                }
            });
            setHasMore(res?.data?.pagination?.hasNextPage);
            console.log("res?.data?.data==========================================>", res?.data?.data)
            dispatch(handleFollowersSearch(res?.data?.data));
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
      }, 1000, { trailing: true }), [page, searchTerm]); // Include all dependencies here
      
      useEffect(() => {
          setHasMore(true);
          setPage(1);
          fetchFollowersWithSearchTerm();
      }, [fetchFollowersWithSearchTerm]);


    useEffect(() => {
                fetchFollowers();
    }, [fetchFollowers]);

    const handleUser =  useCallback(async(user)=>{
        // dispatch(handleUsers([user]))
        // dispatch(handleRemoveUserFromFollowers(user?._id))
            // dispatch(handleFollowers([{...user, isFollowing:!user.isFollowing}]))
      const res=  await axiosInstance.post("/follow", {_id:user?._id});
      dispatch(handleFollowers([{...user, isFollowing:res?.data?.isFollowing}]))
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
                data={followers}
                extraData={followers}
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

export default memo(FollowersList)

const styles = StyleSheet.create({})