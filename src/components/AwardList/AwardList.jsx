import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler';
import Award from '../Award/Award';
import { scale } from 'react-native-size-matters';

const AwardList = ({
    data=[],
    hasMore=true,
    setPage=()=>{},
    loading=false
}) => {
  return (
    
   <View style={{
    gap:scale(20)
}}>
    <FlatList
    showsHorizontalScrollIndicator={false} 
    showsVerticalScrollIndicator={false}
    numColumns={2}
       data={data}
       onEndReachedThreshold={0.5}
       onEndReached={() => {
        if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
        }
      }}
      keyExtractor={(item, index) => index.toString()}
       renderItem={({ item }) => <Award 
       
       url={item?.urls?.small} 
       name={item?.title}
       percentage={item?.percentage}
       infoText={""}
       
       showText={false} />}
   />

   {

    loading &&   <ActivityIndicator size="small" color="#FFA100" />
    }
</View>
  )
}

export default AwardList

const styles = StyleSheet.create({})