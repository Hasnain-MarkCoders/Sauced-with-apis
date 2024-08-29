import { ActivityIndicator, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleRemoveUserFromUsers, handleUsers } from '../../../android/app/Redux/users';
import { handleFollowings } from '../../../android/app/Redux/followings';
import { handleStats, handleStatsChange } from '../../../android/app/Redux/userStats';
const HorizontalUsersList = ({
 numColumns=1,
 horizontal=true

}) => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    const users = useSelector(state=>state?.users)
    const dispatch = useDispatch()
    const userStats = useSelector(state=>state?.userStats)
    
    const fetchUsers = useCallback(async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
          const res = await axiosInstance.get(`/get-random-users`, {
              params: {
                  page: page
              }
          });
                setHasMore(res.data.pagination.hasNextPage);
                dispatch(handleUsers(res?.data?.randomUsers))
      } catch (error) {
          console.error('Failed to fetch photos:', error);
      } finally {
          setLoading(false);
      }
  },[page]);

  useEffect(() => {
      fetchUsers();
  }, [fetchUsers]);


const handleUser =  useCallback(async(user)=>{
    dispatch(handleStatsChange({
followings:1,
}))

dispatch(handleFollowings([user]))
dispatch(handleRemoveUserFromUsers(user?._id))

 await axiosInstance.post("/follow", {_id:user?._id});
  },[])
  return (
    <View style={{
        gap:scale(20),
        flex:1
    }}>
        <FlatList
        showsHorizontalScrollIndicator={false} 
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        horizontal={horizontal}
           data={users}
           onEndReachedThreshold={0.5}
           onEndReached={() => {
            if (!loading && hasMore) {
                setPage(currentPage => currentPage + 1);
            }
          }}
           keyExtractor={(item, index) => index.toString()}
           renderItem={({ item }) => <UserCard 
           cb={handleUser}
           _id={item?._id}
           title={"Follow"}
        item={item}
        url={item.image}
        name={item?.name}
        // title={"Follow"}
        showText={false}
         />}
    
       />{

       loading &&   <ActivityIndicator size="small" color="#FFA100" />
       }
    </View>
  )
}

export default HorizontalUsersList
