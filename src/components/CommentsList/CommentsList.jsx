import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import CustomComment from '../CustomComment/CustomComment';
import { scale } from 'react-native-size-matters';
import foodImage from "./../../../assets/images/sauce1.png"
import { messagesData } from '../../../utils';

const CommentsList = ({ data = [],product={}, cb=()=>{},setNewMsg=()=>{},getId=getId, loading, hasMore, setPage = () => { }, handleSubmitMessage = () => { } }) => {





useEffect(()=>{

  console.log("<========&&&&&&&&&&&&&&&&===============product===================&&&&&&&&&&&&&======>", product)
},[])

  return (
    <>
     <TouchableOpacity style={{
        paddingVertical:scale(20),
        alignSelf:"flex-end"
      }} onPress={()=>{handleSubmitMessage(); getId(data?.length), setNewMsg(true)}} >
        <Text style={{
          color:"white"
        }}>Add Comment</Text>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // data={data}
        data={data}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =><CustomComment
        getId={getId}
        index={index}
        cb={cb}
          handleSubmitMessage={handleSubmitMessage}
          //  showImages={index%2!==0}
          //  showImages={index==1}
          // profileUri={item?.urls?.small} 
          // uri={item.urls.small} 
          profileUri={item?.url}
          assets={item?.assets}
          // // uri={foodImage} 
          title={item?.title}
          text={item?.text}
          replies={item?.replies}
          count = {data?.length}

          />
          
        }
      />
      {/* <TouchableOpacity style={{
        paddingVertical:scale(20)
      }} onPress={()=>{handleSubmitMessage(); getId(data?.length), setNewMsg(true)}} >
        <Text style={{
          color:"white"
        }}>Add Comment</Text>
      </TouchableOpacity> */}
     
      {

        loading && <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
      }
    </>
  )
}

export default CommentsList

const styles = StyleSheet.create({})