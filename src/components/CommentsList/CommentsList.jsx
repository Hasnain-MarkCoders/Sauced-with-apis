import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import CustomComment from '../CustomComment/CustomComment';
import { scale } from 'react-native-size-matters';
import NotFound from '../NotFound/NotFound';
const CommentsList = ({ commentsData=[],
  title,
    cb=()=>{},
    getId=()=>{},
    loading =false,
     hasMore,
      setPage = () => { },
     handleSubmitMessage = () => { }, 
     fetchCheckings=()=>{}
    }) => {
  return (
    <>
     {
      commentsData?.length>0
      ?
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={commentsData}
        extraData={commentsData}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
          }
        }}
        keyExtractor={(item, index) => index.toString()}

        renderItem={({ item, index }) =>
        <CustomComment
        fetchCheckings={fetchCheckings}
        foodPairings={item?.foodPairings||[]}
        address = {item?.address}
        location = {item?.location}
        getId={getId}
        item={item}
        cb={cb}
          handleSubmitMessage={handleSubmitMessage}
        _id={item?._id}
          profileUri={item?.owner?.image}
          assets={item?.images}
          title={item?.owner?.name}
          email={item?.owner?.email}
          text={item?.text}
          replies={item?.comments}
          likesCount={item?.likesCount}
          hasLikedUser={item?.hasLiked}
          count = {commentsData?.length}
          sauce_id={item?.sauceId?._id}
          sauce_name={item?.sauceId?.name}
          ownerId = {item?.owner?._id}
          />

        }

        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="small"
              style={{ marginBottom: scale(20) }}
              color="#FFA100"
            />
          )
        }
      />
      :
      loading
      ?
      <ActivityIndicator size="small" style={{ marginBottom: scale(20) }} color="#FFA100" />
      :
      <NotFound

      title='No check-ins available'
      />
     }
    </>
  )
}

export default CommentsList

const styles = StyleSheet.create({})