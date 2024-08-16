import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal';
import useAxios from '../../../Axios/useAxios';

const FollowersList = ({
    // data=[],
    // hasMore=true,
    // setPage=()=>{},
    // loading=false,
    numColumns=2,
    title="",
}) => {
const [modalVisible, setModalVisible] = useState(false)
const [modalLoading, setModalLoading] = useState(false)
const [modalTitle, setModalTitle]=useState("")
const [data, setData] = useState([])
const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)
const [loading, setLoading] = useState(false);
const axiosInstance = useAxios()
  const handleOpenModal =  (item)=>{
    setModalTitle(`${title}  ${item.user.username}`)
    setModalVisible(true)
  }
  const handleFollow =  ()=>{
    setModalLoading(true)
    setTimeout(()=>{
      setModalLoading(false)
     },2000)
  }
 

  const fetchPhotos = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
        const res = await axiosInstance.get(`/get-followers`, {
            params: {
                page: page
            }
        });

        if (res?.data?.length === 0) {
            setHasMore(false);
        } else {
            if(res?.data && res?.data?.followers && res?.data?.followers?.length>0){
                setData(prevData => [...prevData, ...res?.data?.followers]);;
            }
        }
        console.log(res?.data?.followers)
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
    numColumns={numColumns}
       data={data}
       onEndReachedThreshold={0.5}
       onEndReached={() => {
        if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
        }
      }}
       keyExtractor={(item, index) => index.toString()}
       renderItem={({ item }) => <UserCard
        cb={handleOpenModal}
         item={item?.followGiverDetails}
       title={title}
       url={item?.followGiverDetails?.image}
       name={item?.followGiverDetails?.name} 
      //  url={item?.urls?.small}
      //  name={item?.user?.username} 
         showText={false} />}

   />
   {

    loading &&   <ActivityIndicator size="small" color="#FFA100" />
    }
    <CustomConfirmModal cb={handleFollow} loading={modalLoading} title={modalTitle} modalVisible={modalVisible} setModalVisible={()=>{setModalVisible(false)}} />

</View>

  )
}

export default FollowersList

const styles = StyleSheet.create({})