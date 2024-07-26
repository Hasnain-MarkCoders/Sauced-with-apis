import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal';

const FollowersList = ({
    data=[],
    hasMore=true,
    setPage=()=>{},
    loading=false,
    numColumns=2,
    title="",
}) => {
const [modalVisible, setModalVisible] = useState(false)
const [modalLoading, setModalLoading] = useState(false)
const [modalTitle, setModalTitle]=useState("")
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
        // cb={handleOpenModal}
         item={item}
       title={title}
       url={item?.url}
       name={item?.title} 
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