import { ImageBackground, SafeAreaView, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import FollowersList from '../../components/FollowersList/FollowersList.jsx';
import BlockedUsersList from '../../components/BlockedUsersList/BlockedUsersList.jsx';
const BlockedUsersScreen = () => {
    const route = useRoute()
    const _id = route?.params?._id
    const navigation = useNavigation()
    const [initialLoading, setInitialLoading] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{
        setInitialLoading(false)
        },1000)
        },[])
        if (initialLoading) {
            return (
                <ImageBackground source={home} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FFA100" />
                </ImageBackground>
            );
        }
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom:verticalScale(0) }}>
                <Header cb={() => navigation.goBack()} showMenu={true} showProfilePic={false} headerContainerStyle={{
                    paddingBottom: scale(20)
                }} showText={false} />
                <FlatList 
                 showsVerticalScrollIndicator={false}
                 showsHorizontalScrollIndicator={false}
                data={[1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                flex: 1,

                                paddingHorizontal: scale(20)

                            }}>
                                {index == 0 && <View style={{
                                    marginBottom: scale(20)
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(35),
                                        lineHeight: scale(50),
                                        marginBottom: scale(20)
                                    }}>
                                        Blocked Users
                                    </Text>
                                
                                </View>}
                                {
                                    index == 1 && <View style={{
                                        alignItems:"center"
                                    }}>
                                        
                                       
                                    
                                      <BlockedUsersList
                                      />
                                      
                                      </View>
                                   
                                }
                            </View>

                        )
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default BlockedUsersScreen
