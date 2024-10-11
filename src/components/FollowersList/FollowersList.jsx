import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleFollowers, handleFollowersSearch, clearFollowersState } from '../../../android/app/Redux/followers';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import NotFound from '../NotFound/NotFound';

const FollowersList = ({
  numColumns = 2,
  searchTerm = "",
  _id = ""
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();
  const followers = useSelector(state => state?.followers);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Unified function for fetching followers (with or without search term)
  const fetchFollowers = useCallback(debounce(async () => {
    if ( !hasMore) return;

    setLoading(true);
    try {
      const endpoint = searchTerm ? "/search-followers" : "/get-followers";
      const params = searchTerm ? { page, searchTerm } : { page, _id };

      const res = await axiosInstance.get(endpoint, { params });
      setHasMore(res?.data?.pagination?.hasNextPage);

      const isFirstPage = page === 1;

      if (searchTerm) {
        dispatch(handleFollowersSearch(res?.data?.data)); // Search-based followers
      } else {
        dispatch(handleFollowers(res?.data?.data, { meta: { isFirstPage } })); // Regular followers with pagination
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setLoading(false);
    }
  }, 1000), [page, searchTerm, hasMore, loading]);

  // Effect to clear state and fetch followers when searchTerm changes
  useEffect(() => {
    dispatch(clearFollowersState()); // Clear previous data on new search
    setHasMore(true);
    setPage(1); // Reset page when search term changes
    fetchFollowers();
  }, [searchTerm]);

  // Fetch more pages when page increments
  useEffect(() => {
    if (page > 1) {
      fetchFollowers();
    }
  }, [page]);

  // Handle user follow/unfollow action
  const handleUser = useCallback(async (user) => {
    dispatch(handleFollowers([{ ...user, isFollowing: !user.isFollowing }])); // Optimistic update
    const res = await axiosInstance.post("/follow", { _id: user?._id });
    dispatch(handleFollowers([{ ...user, isFollowing: res?.data?.isFollowing }])); // Actual update
  }, []);

  return (
    <View style={{ gap: scale(20), flex: 1 ,  width:"100%"}}>
      
        
        {
          followers?.length > 0
          ?
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          data={followers}
          extraData={followers}
          onEndReachedThreshold={0.5} // Adjusted threshold
          onEndReached={() => {
            if (!loading && hasMore) {
              setPage(currentPage => currentPage + 1); // Fetch next page
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <UserCard
              cb={handleUser}
              title={item?.isFollowing ? "Unfollow" : item?.isFollower?"Follow Back":"Follow"}
              _id={item?._id}
              item={item}
              url={item.image}
              name={item?.name}
              showText={false}
            />
          }
          ListFooterComponent={loading && <ActivityIndicator size="small" color="#FFA100" />}
        />
        :
        loading && followers.length<1
        ?<ActivityIndicator size="small" style={{ marginBottom: scale(100) }} color="#FFA100" />
        :followers.length<1
        ?
        <NotFound
        title='No users found'
        />
        :null
        

      }
    </View>
  );
};

export default memo(FollowersList);

const styles = StyleSheet.create({});
