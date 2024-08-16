import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';
const HorizontalUsersList = ({
    // data=[],
    // hasMore=true,
    // setPage=()=>{},
    // loading=false,
}) => {
  const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()


    const fetchPhotos = async () => {
      if (!hasMore || loading) return;
 
      setLoading(true);
      try {
          const res = await axiosInstance.get(`/get-random-users`, {
              params: {
                  page: page
              }
          });

          if (res?.data?.length === 0) {
              setHasMore(false);
          } else {
              if(res?.data && res?.data?.randomUsers && res?.data?.randomUsers?.length>0){
                  setData(prevData => [...prevData, ...res?.data?.randomUsers]);;
              }
          }
      } catch (error) {
          console.error('Failed to fetch photos:', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchPhotos();
  }, [page]);

  return (
    <View style={{
        gap:scale(20),
        flex:1
    }}>

        <FlatList
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        horizontal={true}
           data={data}
           onEndReachedThreshold={0.5}
           onEndReached={() => {
            if (!loading && hasMore) {
                setPage(currentPage => currentPage + 1);
            }
          }}
           keyExtractor={(item, index) => index.toString()}
           renderItem={({ item }) => <UserCard 
          //  url={item?.urls?.small} 
            // name={item?.user?.username}
            item={item}
          url={item.image}
          name={item?.name}
           title={"Follow"}
             showText={false} />}
    
       />{

       loading &&   <ActivityIndicator size="small" color="#FFA100" />
       }
    </View>
  )
}

export default HorizontalUsersList
