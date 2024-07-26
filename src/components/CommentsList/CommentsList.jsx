import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler';
import CustomComment from '../CustomComment/CustomComment';
import { scale } from 'react-native-size-matters';
import { users } from '../../../utils';
import foodImage from "./../../../assets/images/sauce1.png"
const CommentsList = ({data=[],loading, hasMore, setPage=()=>{}}) => {
  return (
    <>
    <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            // data={data}
                                            data={users}
                                            onEndReachedThreshold={0.5}
                                            onEndReached={() => {
                                                if (!loading && hasMore) {
                                                    setPage(currentPage => currentPage + 1);
                                                }
                                            }}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => <CustomComment
                                            //  showImages={index%2!==0}
                                             showImages={index==1}

                                              // profileUri={item?.urls?.small} 
                                              // uri={item.urls.small} 
                                              profileUri={item?.url}
                                              uri={foodImage} 

                                              />}
                                        />
     {

loading &&   <ActivityIndicator size="small" style={{marginBottom:scale(20)}} color="#FFA100" />
     }
    </>
  )
}

export default CommentsList

const styles = StyleSheet.create({})