import { ActivityIndicator, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { handleRemoveSearchedUsers, handleSearchedUsers, appendSearchedUsers, handleToggleSearchedUserIsFollowing } from '../../../android/app/Redux/searchedUsers';
import { handleStats } from '../../../android/app/Redux/userStats';
import NotFound from '../NotFound/NotFound';

const VerticalUserSearchList = ({
  numColumns = 1,
  horizontal = true,
  searchTerm = ""
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();
  const users = useSelector(state => state?.searchedUsers);
  const dispatch = useDispatch();
  const auth = useSelector(state => state?.auth);
  const userStats = useSelector(state=>state?.userStats)

  const fetchUsersWithSearchTerm = useCallback(debounce(async () => {
    // Only block fetch if it's already loading or no more data
    if ( !hasMore) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/search`, {
        params: {
          page: page,
          searchTerm: searchTerm.trim() || null,  // Allow fetching without searchTerm
        }
      });

      setHasMore(res?.data?.pagination?.hasNextPage);
      // If it's the first page, replace the state; otherwise, append the data
      if (page === 1) {
        dispatch(handleSearchedUsers(res?.data?.results));
        console.log("res?.data?.results=============================>", res?.data?.results)
      } else {
        dispatch(appendSearchedUsers(res?.data?.results));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, 1000), [page, searchTerm, hasMore, loading]);

  // Reset the page and state when searchTerm changes, including empty search term
  useEffect(() => {
    setHasMore(true);
    setPage(1);
    fetchUsersWithSearchTerm();
  }, [searchTerm]);

  // Fetch more pages when page increments
  useEffect(() => {
    if (page > 1) {
      fetchUsersWithSearchTerm();
    }
  }, [page]);

  const handleUser = useCallback(async (user) => {
    // dispatch(handleRemoveSearchedUsers(user?._id));
    if(user?.isFollowing){
      dispatch(handleStats({
        followings:userStats.followings-1,
    }))

    }else{
      dispatch(handleStats({
        followings:userStats.followings+1,
    }))
    }
    dispatch(handleToggleSearchedUserIsFollowing(user?._id))
    await axiosInstance.post("/follow", { _id: user?._id });
  }, []);

  return (
    <View style={{ gap: scale(20), flex: 1 }}>
      {
        users.length>0
        ?
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
          renderItem={({ item }) => (
            <UserCard
            showButton={auth._id==item._id?false:true}
              cb={handleUser}
              _id={item?._id}
              title={item?.isFollowing ? "Unfollow" : item?.isFollower?"Follow back":"Follow"}
              item={item}
              url={item.image}
              name={item?.name}
              showText={false}
            />
          )}
        />
        :
        !loading && users.length==0 
        ?
        <NotFound
        title='No results found'
        />
        :null

      }
      {loading && <ActivityIndicator size="small" color="#FFA100" />}
    </View>
  );
};

export default VerticalUserSearchList;
