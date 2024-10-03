import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleRemoveUserFromFollowers } from '../../../android/app/Redux/followers';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { handleRemoveUserFromFollowings } from '../../../android/app/Redux/followings';
import { handleStatsChange } from '../../../android/app/Redux/userStats';

const ExternalUserFollowersList = ({
  numColumns = 2,
  searchTerm = "",
  _id = ""
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector(state => state?.auth);

  // Fetch followers without search term
  const fetchFollowers = useCallback(async () => {
    if (searchTerm) return;
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get("/get-followers", {
        params: { page, _id }
      });
      setHasMore(res.data.pagination.hasNextPage);
      // Append new data if not first page, else replace
      setData(prev => page === 1 ? res?.data?.data : [...prev, ...res?.data?.data]);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setLoading(false);
    }
  }, [page, _id, hasMore, loading, searchTerm]);

  // Fetch followers with search term
  const fetchFollowersWithSearchTerm = useCallback(debounce(async () => {
    if (!searchTerm) return;
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/search-followers`, {
        params: { page, searchTerm, _id }
      });
      setHasMore(res?.data?.pagination?.hasNextPage);
      setData(res?.data?.data); // Replace data on search
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, 1000), [page, searchTerm, _id, hasMore, loading]);

  // Effect to handle fetching followers when search term changes
  useEffect(() => {
    setHasMore(true);
    setPage(1);
    if (searchTerm) {
      fetchFollowersWithSearchTerm();
    } else {
      fetchFollowers();
    }
  }, [searchTerm]);

  // Effect to handle pagination when page changes
  useEffect(() => {
    if (page > 1) {
      if (searchTerm) {
        fetchFollowersWithSearchTerm();
      } else {
        fetchFollowers();
      }
    }
  }, [page]);

  // Handle follow/unfollow actions
  const handleUser = useCallback(async (user) => {
    const updatedUser = { ...user, isFollowing: !user.isFollowing };
    if (user.isFollowing){
      dispatch(handleRemoveUserFromFollowings(user._id))
      dispatch(handleUsers([updatedUser])); // Update user state optimistically
      dispatch(handleStatsChange({ followings: -1 }))
    }
    setData(prev => prev.map(item => item._id === user._id ? updatedUser : item))
    // dispatch(handleRemoveUserFromFollowers(user?._id)); // Remove user from followers
    dispatch(handleStatsChange({ followings: +1 }))

    await axiosInstance.post("/follow", { _id: user?._id });
  }, [dispatch, axiosInstance]);

  return (
    <View style={{ gap: scale(20), flex: 1 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        data={data}
        extraData={data}
        onEndReachedThreshold={0.5} // Adjusted threshold for better pagination
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
          }
        }}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({ item }) =>
          <UserCard
            showButton={auth?._id !== item?._id} // Only show button if not current user
            cb={handleUser}
            title={item?.isFollowing ? "Unfollow" :(!item?.isFollowing&& item?.isFollower)?"Follow back":"Follow"}
            _id={item?._id}
            item={item}
            url={item.image}
            name={item?.name}
            showText={false}
          />
        }
        ListFooterComponent={loading && <ActivityIndicator size="small" color="#FFA100" />}
      />
    </View>
  );
};

export default memo(ExternalUserFollowersList);

const styles = StyleSheet.create({});
