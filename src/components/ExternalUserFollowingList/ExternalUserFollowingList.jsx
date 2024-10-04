import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleUsers } from '../../../android/app/Redux/users';
import { handleFollowingSearch, handleFollowings, handleRemoveUserFromFollowings } from '../../../android/app/Redux/followings';
import { handleStatsChange } from '../../../android/app/Redux/userStats';
import { debounce } from 'lodash';
import NotFound from '../NotFound/NotFound';

const ExternalUserFollowingList = ({
  numColumns = 2,
  searchTerm = "",
  _id = "",
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  // Fetch followings without search term
  const fetchFollowings = useCallback(async () => {
    if (!hasMore) return;
    if (searchTerm) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get("/get-following", {
        params: {
          page: page,
          _id
        }
      });
      setHasMore(res.data.pagination.hasNextPage);
      // Append new data if not first page, else replace
      setData(prev => page === 1 ? res?.data?.data : [...prev, ...res?.data?.data]);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, _id, searchTerm]);

  // Fetch followings with search term
  const fetchFollowingWithSearchTerm = useCallback(debounce(async () => {
    if (!searchTerm) return;
    if (!hasMore) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/search-following`, {
        params: {
          page: page,
          searchTerm,
          _id
        }
      });
      setHasMore(res.data.pagination.hasNextPage);
      // Replace data on search or append if it's a paginated search
      setData(prev => page === 1 ? res?.data?.data : [...prev, ...res?.data?.data]);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, 1000), [page, searchTerm, _id, hasMore, loading]);

  // Effect to handle data fetching based on search term
  useEffect(() => {
    setHasMore(true);
    setPage(1); // Reset to first page on search term change
    if (searchTerm) {
      fetchFollowingWithSearchTerm();
    } else {
      fetchFollowings();
    }
  }, [searchTerm]);

  // Handle pagination (load more when page changes)
  useEffect(() => {
    if (page > 1) {
      if (searchTerm) {
        fetchFollowingWithSearchTerm();
      } else {
        fetchFollowings();
      }
    }
  }, [page]);

  // Handle user follow/unfollow action
  const handleUser = useCallback(async (user) => {
    // dispatch(handleUsers([user])); // Update user state optimistically
    // dispatch(handleRemoveUserFromFollowings(user?._id)); // Remove user from followings
    // dispatch(handleStatsChange({ followings: -1 })); // Update stats
    const updatedUser = { ...user, isFollowing: !user.isFollowing };
    if (user.isFollowing){
      dispatch(handleRemoveUserFromFollowings(user._id))
      dispatch(handleUsers([updatedUser])); // Update user state optimistically
      dispatch(handleStatsChange({ followings: -1 }))
    }
    setData(prev => prev.map(item => item._id === user._id ? updatedUser : item))
    dispatch(handleStatsChange({ followings: +1 }))

    await axiosInstance.post("/follow", { _id: user?._id });
  }, [dispatch, axiosInstance]);

  return (
    <View style={{ gap: scale(20), flex: 1 }}>
      {loading && data.length<1
              ?<ActivityIndicator size="small" style={{ marginBottom: scale(100) }} color="#FFA100" />
              :data.length<1
              ?
              <NotFound
              title='No users found'
              />
              :
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        data={data}
        extraData={data}
        onEndReachedThreshold={0.5} // Adjusted threshold for smoother pagination
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1); // Fetch next page
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <UserCard
            showButton={auth?._id !== item?._id} // Show button only if it's not the current user
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
}
    </View>
  );
};

export default memo(ExternalUserFollowingList);

const styles = StyleSheet.create({});
