import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import CustomComment from '../CustomComment/CustomComment';
import { scale } from 'react-native-size-matters';
const CommentsList = ({ data = [],commentsData=[], cb=()=>{},getId=()=>{}, loading, hasMore, setPage = () => { }, handleSubmitMessage = () => { } }) => {

  return (
    <>
     
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // data={data}
        data={commentsData}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
        <CustomComment
        getId={getId}
        // index={index}
        cb={cb}
          handleSubmitMessage={handleSubmitMessage}
        _id={item?._id}
          profileUri={item?.owner?.image}
          assets={item?.images}
          title={item?.owner?.name}
          text={item?.text}
          replies={item?.comments}
          count = {data?.length}

          />
          
        }
      />
      {

        loading && <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
      }
    </>
  )
}

export default CommentsList

const styles = StyleSheet.create({})