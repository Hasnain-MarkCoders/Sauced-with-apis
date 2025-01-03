import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
import NotFound from '../NotFound/NotFound';
const BlockedUsersList = ({ numColumns = 2 }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlockedUsers = useCallback(async () => {
    if (!hasMore || loading) return; // Prevent concurrent requests
    setLoading(true);
    try {
      const res = await axiosInstance.get('/get-all-blocks', {
        params: { page },
      });

      if(res?.data?.blockList){
          setHasMore(res?.data?.pagination?.hasNextPage);
          setData(prevData => {
            // Avoid adding duplicates by filtering existing items
            const newData = res?.data?.blockList?.filter(newItem => !prevData?.some(item => item?._id === newItem?._id));
            return [...prevData, ...newData];
          });
      }else{
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to fetch blocked users:', error);
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false);
    }
  }, [ hasMore, page]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers, page]); // Update useEffect dependencies to include 'page'

  const handleBlock = useCallback(async user => {
    const updatedData = data.map(item =>
      item?._id === user?._id ? { ...item, isBlocked: !item?.isBlocked } : item
    );
    setData(updatedData);
    try {
      await axiosInstance.post('/block', { _id: user._id });
      // Call API to update block status
    } catch (error) {
      console.error('Failed to update block status:', error);
      // Handle error (e.g., show error message)
    }
  }, [axiosInstance, data]);

  const renderItem = useCallback(({ item }) => (
    <UserCard
      cb={handleBlock}
      title={item.isBlocked ? 'Unblock' : 'Block'}
      _id={item._id}
      item={item}
      url={item.image}
      name={item.name}
      showText={false}
    />
  ), [handleBlock]);
  return (
    <View style={{ flex: 1, gap: scale(20) }}>
      {
        data?.length>0
        ?
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          data={data}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          onEndReachedThreshold={2} // Adjusted for early loading
          onEndReached={() => {
          //   if (!loading && hasMore) {
          //     setPage(page + 1);
          //   }
          }}
          ListFooterComponent={() => loading && <ActivityIndicator size="small" color="#FFA100" />}
        />
        :
        !loading
        ?
        <NotFound
        title='No Users found.'
        />
        :
        null

      }
    </View>
  );
};

export default memo(BlockedUsersList);
