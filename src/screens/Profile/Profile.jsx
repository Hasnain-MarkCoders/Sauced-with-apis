import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import search from './../../../assets/images/search_icon.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import HorizontalUsersList from '../../components/HorizontalUsersList/HorizontalUsersList.jsx';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { FriendListImages, handleText, topRatedSauces } from '../../../utils.js';
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import moreIcon from "./../../../assets/images/more.png"
import { useSelector } from 'react-redux';
import useAxios from '../../../Axios/useAxios.js';
import BookMarkSauceList from '../../components/BookMarkSauceList/BookMarkSauceList.jsx';
const ProfileScreen = () => {
    const auth = useSelector(state => state.auth)
  const axiosInstance = useAxios()

    const [data, setData] = useState([])
    const [checkedInSauces, setCheckedInSauces] = useState([])
    const [user, setUser] = useState(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isKeyBoard, setIsKeyBoard] = useState(false)
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
    // useEffect(() => {
    //     const fetchPhotos = async () => {
    //         if (!query?.search?.trim()) {
    //             return
    //         }
    //         console.log("query.search", query.search)
    //         if (loading) return;
    //         setLoading(true);
    //         try {
    //             const res = await axios.get(`${UNSPLASH_URL}/search/photos`, {
    //                 params: {
    //                     client_id: VITE_UNSPLASH_ACCESSKEY,
    //                     page: page,
    //                     query: query?.search
    //                 }
    //             });

    //             setData(prev => [...res.data.results, ...prev]);

    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     // fetchPhotos();
    // }, [query.search, page]);

    // useEffect(() => {
    //     const fetchPhotos = async () => {
    //         if (query?.search.trim()) {
    //             return
    //         }
    //         if (!hasMore || loading) return;
    //         setLoading(true);
    //         try {
    //             const res = await axios.get(`${UNSPLASH_URL}/photos`, {
    //                 params: {
    //                     client_id: VITE_UNSPLASH_ACCESSKEY,
    //                     page: page
    //                 }
    //             });
    //             if (res.data.length === 0) {
    //                 setHasMore(false);
    //             } else {
    //                 setData(prevData => [...res.data, ...prevData]);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     // fetchPhotos();
    // }, [page]);
    // useEffect(() => {
    //     console.log(auth.token)
    // }, [])

    React.useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-user`);
                setUser(res?.data?.user)
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };
    
        // Initial fetch
        fetchUser();
    
        // Setting up interval for short polling (fetch every 10 seconds, adjust as needed)
        const interval = setInterval(fetchUser, 10000); // 10000 milliseconds = 10 seconds
    
        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchPhotos = async () => {
            if (!hasMore || loading) return;
    
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-sauces`, {
                    params: {
                        type:"checkedin",
                        page: page
                    }
                });
                    setHasMore(res.data.pagination.hasNextPage);
                    setCheckedInSauces(prev=>[...prev,...res.data.sauces]);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };
       
        fetchPhotos();
    }, [page]);



    // useEffect(() => {
    //     const fetchBookMarkSauces = async () => {
    //         if (!hasMore || loading) return;
    
    //         setLoading(true);
    //         try {
    //             const res = await axiosInstance.get(`/bookmarks`, {
    //                 params: {
    //                     // type:"checkedin",
    //                     page: page
    //                 }
    //             });
    //                 setHasMore(res.data.pagination.hasNextPage);
    //                 // setCheckedInSauces(prev=>[...prev,...res.data.sauces]);
    //                 console.log(res.data.sauces)
    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
       
    //     fetchBookMarkSauces();
    // }, [page]);




    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(90) }}>

                <Header showMenu={true} cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
                    paddingBottom: scale(20)
                }} showText={false} />

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={[1, 1, 1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                width: "100%",
                                flex: 1,
                                paddingHorizontal: scale(20)

                            }}>

                                {
                                    index == 0 && <View style={{
                                        marginBottom: scale(20)
                                    }}>

                                        <Text style={{
                                            color: "white",
                                            fontWeight: 600,
                                            fontSize: scale(35),
                                            lineHeight: scale(50),
                                            marginBottom: scale(20)

                                        }}>
                                            My Profile

                                        </Text>
                                        <ProfileCard
                                        totalCheckIns ={user?.checkinsCount||0}
                                        totalFollowersCount={user?.followers||0}
                                        totalFollowingCount={user?.following||0}
                                        url={user?.image||""}
                                        name={user?.name||""}
                                        date={user?.date||""}
                                            />


                                    </View>
                                }
                                {
                                    index == 1 && <View>
                                        <View style={{
                                            marginVertical: scale(30)
                                        }}>
                                            <TouchableOpacity style={{
                                                width:"100%"
                                            }} onPress={()=>{
                                                navigation.navigate("UserSearchScreen")
                                            }}>
                                            <CustomInput
                                            readOnly={true}
                                                imageStyles={{ top: "50%", resizeMode: 'contain', transform: [{ translateY: -0.5 * scale(25) }], width: scale(25), height: scale(25), aspectRatio: "1/1" }}
                                                isURL={false}
                                                showImage={true}
                                                uri={search}
                                                cb={() => setPage(1)}
                                                name="search"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.search}
                                                showTitle={false}
                                                placeholder="Search Friends..."
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,
                                                    paddingLeft: scale(45)

                                                }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: scale(20)

                                        }}>
                                            <Text style={{
                                                color: "white",
                                                fontWeight: 600,
                                                fontSize: scale(24),
                                                lineHeight: scale(28),

                                            }}>
                                                Add Friends
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // Linking.openURL(url)
                                                    // navigation.navigate("MyReviewedSauces", { route: "check-ins" }, {data: checkedInSauces, setData:setCheckedInSauces})
                                                    navigation.navigate("MyReviewedSauces")

                                                }}
                                                style={{
                                                    paddingHorizontal: scale(10),
                                                    paddingVertical: scale(6),
                                                    backgroundColor: "#FFA100",
                                                    borderRadius: scale(5),
                                                    elevation: scale(5),
                                                    alignSelf: "flex-end",

                                                }}>
                                                <Text style={{
                                                    color: "black",
                                                    fontWeight: "700"

                                                }}>All Reviews</Text>


                                            </TouchableOpacity>
                                        </View>
                                        <View style={{
                                                marginBottom:scale(30)
                                        }}>

                                        <HorizontalUsersList 
                                        horizontal={true}
                                        loading={loading}
                                        hasMore={hasMore}
                                        setPage={setPage}
                                        />
                                        </View>
                                    </View>
                                }
                                {
                                    index == 2 && <View style={{
                                        // marginTop: scale(50),
                                        gap: scale(40)
                                    }}>

                                        <SauceList
                                            type="favourite"
                                            title='My Favorites' data={topRatedSauces}
                                        />
                                        <SauceList
                                        type="checkedin"
                                        title='Checked-in Sauces' data={topRatedSauces} />
                                        <SauceList
                                            type="reviewed"
                                            cb={() => { navigation.navigate("MyReviewedSauces", { route: "review" }) }} showMoreIcon={true} title='Reviewed Sauces' data={topRatedSauces} />

                                    </View>

                                }

                                {
                                    index == 3 && <View style={{
                                        marginTop: scale(50),
                                        gap:scale(50)
                                    }}>

                                        <BookMarkSauceList type={1} title='My List 1' />
                                        <BookMarkSauceList type={2} title='My List 2' />
                                        <BookMarkSauceList type={3} title='My List 3' />

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

export default ProfileScreen

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})