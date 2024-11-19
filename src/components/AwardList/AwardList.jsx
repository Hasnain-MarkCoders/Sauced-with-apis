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
  console.log(data[0])
  return (

   <View style={{
    gap:scale(20)
}}>
    <FlatList
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom:scale(100)
    }}
    numColumns={2}
       data={data}
       extraData={data}
       onEndReachedThreshold={0.5}
       onEndReached={() => {
        if (!loading && hasMore) {
            setPage(currentPage => currentPage + 1);
        }
      }}
      keyExtractor={(item, index) => index.toString()}
       renderItem={({ item }) => <Award
       description={item?.badge?.description}
       url={item?.badge?.icon}
       name={item?.badge?.name}
       percentage={item?.progress}
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