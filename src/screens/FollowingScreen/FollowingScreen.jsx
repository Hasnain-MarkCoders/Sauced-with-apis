import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import search from './../../../assets/images/search_icon.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import FollowersList from '../../components/FollowersList/FollowersList.jsx';
import { useNavigation } from '@react-navigation/native';
import { FriendListImages, handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList } from 'react-native-gesture-handler';
const FollowingScreen = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isKeyBoard, setIsKeyBoard]= useState(false)
    const [query, setQuery] = useState({
        search: "",
    });
    const navigation = useNavigation()
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyBoard(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyBoard(false)
        });
    
        // Cleanup function
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []);
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!query?.search?.trim()) {
                return
            }
            if (loading) return;
            setLoading(true);
            try {
                const res = await axios.get(`${UNSPLASH_URL}/search/photos`, {
                    params: {
                        client_id: VITE_UNSPLASH_ACCESSKEY,
                        page: page,
                        query: query?.search
                    }
                });

                setData(prev=>[...res?.data?.results,...prev ]);

            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        // fetchPhotos();
    }, [query.search, page]);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (query?.search.trim()) {
                return
            }
            if (!hasMore || loading) return;

            setLoading(true);
            try {
                const res = await axios.get(`${UNSPLASH_URL}/photos`, {
                    params: {
                        client_id: VITE_UNSPLASH_ACCESSKEY,
                        page: page
                    }
                });
                if (res.data.length === 0) {
                    setHasMore(false);
                } else {
                    setData(prevData => [ ...res?.data,...prevData,]);
                }
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        // fetchPhotos();
    }, [page]);
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom:isKeyBoard ? 0 : verticalScale(0) }}>

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
                                            cb={() => setPage(1)}
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
                                    </Text><FollowersList title="Unfollow"  loading={loading} hasMore={hasMore} setPage={setPage} 
                                    data={FriendListImages}
                                    // data={data}
                                     /></View>
                                   
                                    
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