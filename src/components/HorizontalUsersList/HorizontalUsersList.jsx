import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../UserCard/UserCard';
import { scale } from 'react-native-size-matters';
const HorizontalUsersList = ({
    data=[],
    hasMore=true,
    setPage=()=>{},
    loading=false,
}) => {
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
          url={item.url}
          name={item?.title}
           title={"Follow"}
             showText={false} />}
    
       />{

       loading &&   <ActivityIndicator size="small" color="#FFA100" />
       }
    </View>
  )
}

export default HorizontalUsersList
