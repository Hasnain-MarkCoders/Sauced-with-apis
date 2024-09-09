import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import search from './../../../assets/images/search_icon.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import {  handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList } from 'react-native-gesture-handler';
import FollowingList from '../../components/FollowingList/FollowingList.jsx';
const FollowingScreen = ({
}) => {
    const route = useRoute()
    const _id = route?.params?._id
    const [query, setQuery] = useState({
        search: "",
    });
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
            <SafeAreaView style={{ flex: 1, paddingBottom: verticalScale(0) }}>

                <Header cb={() => navigation.goBack()} showMenu={true} showProfilePic={false} headerContainerStyle={{
                    paddingBottom: scale(20)
                }} title={"Followers"} showText={false} />


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
                                {index == 0 &&

                                    <View style={{
                                        marginBottom: scale(20)
                                    }}>

                                        <Text style={{
                                            color: "white",
                                            fontWeight: 600,
                                            fontSize: scale(35),
                                            lineHeight: scale(50),
                                            marginBottom: scale(20)

                                        }}>
                                            Following 

                                        </Text>

                                        <CustomInput
                                          imageStyles={{top:"50%", transform: [{ translateY: -0.5 * scale(25) }], resizeMode: 'contain',width:scale(25), height:scale(25), aspectRatio:"1/1"}}
                                          isURL={false}
                                          showImage={true}
                                          uri={search}
                                            // cb={() => setPage(1)}
                                            name="search"
                                            onChange={handleText}
                                            updaterFn={setQuery}
                                            value={query.search}
                                            showTitle={false}
                                            placeholder="Search Followers..."
                                            containterStyle={{
                                                flexGrow: 1,
                                            }}
                                            inputStyle={{
                                                borderColor: "#FFA100",
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                padding: 15,
                                                paddingLeft:scale(45)

                                            }} />
                                    </View>}
                                {
                                    index == 1 &&  <View style={{
                                        alignItems:"center"
                                    }}>
                                        
                                        <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(24),
                                        lineHeight: scale(28),
                                        marginBottom: scale(20),
                                        alignSelf:"flex-start"
                                    }}>
                                        All Following
                                    </Text>
                                    <FollowingList
                                    _id={_id}
                                    searchTerm={query?.search}
                                    endpoint="/get-following"/>
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

export default FollowingScreen

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})