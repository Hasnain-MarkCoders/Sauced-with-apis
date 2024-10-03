import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleFollowingSearch, handleFollowings, clearFollowingsState, handleRemoveUserFromFollowings, handleToggleIsFollowing } from '../../../android/app/Redux/followings';
import { handleStats, handleStatsChange } from '../../../android/app/Redux/userStats';
import { debounce } from 'lodash';

const FollowingList = ({
  numColumns = 2,
  searchTerm = "",
  _id = "",
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const followings = useSelector(state => state?.followings);
  const userStats = useSelector(state=>state?.userStats)

  const dispatch = useDispatch();

  // Fetch followings with or without a search term
  const fetchFollowings = useCallback(debounce(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const endpoint = searchTerm ? "/search-following" : "/get-following";
      const params = searchTerm ? { page, searchTerm } : { page, _id };

      const res = await axiosInstance.get(endpoint, { params });
      setHasMore(res?.data?.pagination?.hasNextPage);

      // If it's the first page, clear previous data
      const isFirstPage = page === 1;

      if (searchTerm) {
        dispatch(handleFollowingSearch(res?.data?.data));
      } else {
        dispatch(handleFollowings(res?.data?.data, { meta: { isFirstPage } })); // Pass meta for first page
      }
    } catch (error) {
      console.error('Failed to fetch followings:', error);
    } finally {
      setLoading(false);
    }
  }, 1000), [page, searchTerm, hasMore, loading]);

  // Effect for resetting state and fetching followings whenever searchTerm changes
  useEffect(() => {
    dispatch(clearFollowingsState()); // Clear previous data when search term or page changes
    setHasMore(true);
    setPage(1); // Reset page when search term changes
    fetchFollowings();
  }, [searchTerm]);

  // Fetch more pages when page increments
  useEffect(() => {
    if (page > 1) {
      fetchFollowings();
    }
  }, [page]);

  // Handle follow/unfollow actions
  const handleUser = useCallback(async (user) => {
    // dispatch(handleUsers([{ ...user, isFollowing: false }]));
    // dispatch(handleRemoveUserFromFollowings(user?._id));
    // dispatch(handleStatsChange({
    //   followings: -1,
    // }));
    if(user?.isFollowing){
      dispatch(handleStatsChange({
        followings:-1,
    }))

    }else{
      dispatch(handleStatsChange({
        followings:+1,
    }))
    }
    dispatch(handleToggleIsFollowing(user?._id))
    await axiosInstance.post("/follow", { _id: user?._id });
  }, []);

  return (
    <View style={{ gap: scale(20), flex: 1 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        data={followings}
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
            title={item?.isFollowing ? "Unfollow" : item?.isFollower?"Follow back":"Follow"}
            _id={item?._id}
            item={item}
            url={item.image}
            name={item?.name}
            showText={false}
          />
        }
      />
      {loading && <ActivityIndicator size="small" color="#FFA100" />}
    </View>
  );
};

export default memo(FollowingList);

const styles = StyleSheet.create({});
