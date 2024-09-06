import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, Image, ActivityIndicator, Vibration } from 'react-native'
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
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../../Axios/useAxios.js';
import BookMarkSauceList from '../../components/BookMarkSauceList/BookMarkSauceList.jsx';
import FavoriteSaucesList from '../../components/FavoriteSaucesList/FavoriteSaucesList.jsx';
import CheckedInSaucesList from '../../components/CheckedInSaucesList/CheckedInSaucesList.jsx';
import SaucesListOne from '../../components/SaucesListOne/SaucesListOne.jsx';
import SaucesListTwo from '../../components/SaucesListTwo/SaucesListTwo.jsx';
import SaucesListThree from '../../components/SaucesListThree/SaucesListThree.jsx';
import InterestedEvents from '../../components/InterestedEvents/InterestedEvents.jsx';
import { handleStats } from '../../../android/app/Redux/userStats.js';
import InterestedEventsCarousel from '../../components/InterestedEventsCarousel/InterestedEventsCarousel.jsx';
const ProfileScreen = () => {
    const auth = useSelector(state => state.auth)
    const [initialLoading, setInitialLoading] = useState(true)
    const axiosInstance = useAxios()
    const saucesListOne = useSelector(state=>state.saucesListOne)
    const [data, setData] = useState([])
    const [checkedInSauces, setCheckedInSauces] = useState([])
    const [user, setUser] = useState(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const users = useSelector(state=>state?.users)
    const followings = useSelector(state=>state?.followings)
    const followers = useSelector(state=>state?.followers)
    const userStats = useSelector(state=>state?.userStats)
    const interestedEvents = useSelector(state=>state?.interestedEvents)
    const dispatch = useDispatch()
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
    React.useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-user`);
                dispatch(handleStats({
                    followers:res?.data?.user?.followers,
                    followings:res?.data?.user?.following,
                    checkins:res?.data?.user?.checkins?.length,
                    uri:res?.data?.user?.image,
                    name:res?.data?.user?.name,
                    date:res?.data?.user?.date,
                    reviewsCount:res?.data?.user?.reviewsCount
                }))
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


    // useEffect(() => {
    //     const fetchPhotos = async () => {
    //         if (!hasMore || loading) return;
    
    //         setLoading(true);
    //         try {
    //             const res = await axiosInstance.get(`/get-sauces`, {
    //                 params: {
    //                     type:"checkedin",
    //                     page: page
    //                 }
    //             });
    //                 setHasMore(res.data.pagination.hasNextPage);
    //                 setCheckedInSauces(prev=>[...prev,...res.data.sauces]);
    //         } catch (error) {
    //             console.error('Failed to fetch photos:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
       
    //     fetchPhotos();
    // }, [page]);
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
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(90) }}>

                <Header showMenu={true} cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
                    paddingBottom: scale(20)
                }} showText={false} />

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom:scale(60)
                    }}
                    data={[1, 1, 1, 1,1, 1]}
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
                                        _id={auth?._id}
                                        totalCheckIns ={userStats?.checkins}
                                        totalFollowersCount={userStats?.followers}
                                        totalFollowingCount={userStats?.followings}
                                        url={userStats?.uri}
                                        name={userStats?.name}
                                        date={userStats?.date}
                                        reviewsCount={userStats?.reviewsCount}
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
                                            {
                                                users?.length>0 &&  <Text style={{
                                                    color: "white",
                                                    fontWeight: 600,
                                                    fontSize: scale(24),
                                                    lineHeight: scale(28),
    
                                                }}>
                                                    Add Friends
                                                </Text>
                                            }
                                           
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate("AllUserReviews", {_id:auth?._id})
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

                                                }}>My Reviews</Text>


                                            </TouchableOpacity>
                                        </View>
                                        <View style={{
                                                marginBottom: (users?.length>0 ||  SaucesListThree.length>0 || SaucesListTwo?.length>0 || SaucesListOne.length>0 ) && scale(30)
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
                                        gap: scale(40)
                                    }}>

                                        <FavoriteSaucesList
                                            title='My Favorites'
                                        />


                                        <CheckedInSaucesList
                                            title='Checked-in Sauces'
                                        />
                                        <SauceList
                                            type="reviewed"
                                            cb={() => { navigation.navigate("AllReviews", { route: "review" }) }} showMoreIcon={true} title='Reviewed Sauces' data={topRatedSauces} />

                                    </View>

                                }

                                {
                                    index == 3 && <View style={{
                                        marginTop: (users?.length>0 ||  SaucesListThree.length>0 || SaucesListTwo?.length>0 || SaucesListOne.length>0 ) && scale(50),
                                        marginBottom: (users?.length>0 ||  SaucesListThree.length>0 || SaucesListTwo?.length>0 || SaucesListOne.length>0 ) && scale(30),

                                        gap:scale(50)
                                    }}>
                                        <SaucesListOne
                                        title='My List 1'
                                        />
                                         <SaucesListTwo
                                        title='My List 2'
                                        />
                                         <SaucesListThree
                                        title='My List 3'
                                        />
                                    </View>

                                }
                                {/* {
                                    index==4 &&<InterestedEvents/>
                                } */}
                                {
                                    index==5&& 
                                    <View style={{
                                        gap:scale(20)
                                    }}>
                                        <Text style={{
                                                    color: "white",
                                                    fontWeight: 600,
                                                    fontSize: scale(24),
                                                    lineHeight: scale(28),
    
                                                }}>Events I'm Interested In</Text>
                                                <View>
                                                {/* {interestedEvents.length0
                                                ? */}
                                                <InterestedEventsCarousel
                                                showText={true}
                                                />
                                                {/* :
                                                <>
                                                    <TouchableOpacity onPress={() => {
                            Vibration.vibrate(10)
                            navigation.navigate("Home")
                        }}>

                            <Text style={{
                                    
                                            textDecorationLine: "underline", fontWeight: 700,
                                            marginLeft:scale(2),
                                            textDecorationLine: "underline", fontWeight: 700,
                                            marginLeft:scale(2),
                                            color:"white"
                            }}>
                                Find an event you're interested in
                            </Text>
                        </TouchableOpacity>
                                                </>
                                            } */}
                                                        
                                                </View>
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