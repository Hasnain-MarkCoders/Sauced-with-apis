import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, Vibration, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { getFormattedName, handleText, topRatedSauces } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import ExternalUserCard from '../../components/ExternalUserCard/ExternalUserCard.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import arrow from "./../../../assets/images/arrow.png";
import useAxios from '../../../Axios/useAxios.js';
import Snackbar from 'react-native-snackbar';
// import { handleRemoveUserFromUsers } from '../../../android/app/Redux/users.js';
// import { handleRemoveUserFromFollowings } from '../../../android/app/Redux/followings.js';
// import { handleStatsChange } from '../../../android/app/Redux/userStats.js';
import { useDispatch, useSelector } from 'react-redux';
import { handleRemoveUserFromUsers } from '../../Redux/users.js';
import { handleRemoveUserFromFollowings } from '../../Redux/followings.js';
import { handleStatsChange } from '../../Redux/userStats.js';

const ExternalProfileScreen = ({
}) => {
    const route = useRoute()
    const _id = route?.params?._id||""
    const name = route?.params?.name||""
    const url = route?.params?.url||""
    const [user, setUser] = useState(null)
    const axiosInstance = useAxios()
    // const [initialLoading, setInitialLoading] = useState(true)
    const auth = useSelector(state=>state?.auth)
    const [loading, setLoading] = useState({
        blockLoading:false,
        initialLoading:true,
    });
    const dispatch = useDispatch()
    const [titles, setTitles] = useState({
        blockTitle:"Block",
        reportTitle:""
    })
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
   


    // React.useEffect(() => {
    //     const fetchUser = async () => {
    //         setLoading(prev=>({
    //             ...prev,
    //             initialLoading:true,
    //         }));
    //         try {
    //             const res = await axiosInstance.get(`/get-user`, {
    //                 params:{
    //                     _id
    //                 }
    //             });
    //             setUser(res?.data?.user)
    //         } catch (error) {
    //             console.error('Failed to fetch user:', error);
    //         } finally {
    //             setLoading(prev=>({
    //                 ...prev,
    //                 initialLoading:false,
    //             }));
    //             if (initialLoading){
    //                 setInitialLoading(false)
    //             }
    //         }
    //     };
    //     // Initial fetch
       
    //     // Setting up interval for short polling (fetch every 10 seconds, adjust as needed)
    //     const interval = setInterval(fetchUser, 10000); // 10000 milliseconds = 10 seconds
    //     // Cleanup function to clear interval when component unmounts
    //     return () => clearInterval(interval);
    // }, [_id]);


     // Function to fetch user data
  const fetchUser = useCallback(async () => {
      console.log("_id", _id)
    if (!_id) return; // Ensure _id is available
    setLoading(prev => ({
        ...prev,
        initialLoading: true,
      }));
    try {
      const res = await axiosInstance.get(`/get-user`, {
        params: {
          _id
        }
      });
      setUser(res?.data?.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Snackbar.show({
        text: 'Failed to fetch user data.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setLoading(prev => ({
        ...prev,
        initialLoading: false,
      }));
    //   if (initialLoading) {
    //     setInitialLoading(false);
    //   }
    }
  }, [_id]);

  // Fetch data on mount and when _id changes
//   useEffect(() => {
//     fetchUser();

//     // Set up interval for polling
//     const interval = setInterval(fetchUser, 10000); // 10 seconds

//     // Cleanup interval on unmount or when _id changes
//     return () => clearInterval(interval);
//   }, [fetchUser]);

  // Fetch data when the screen gains focus
  useFocusEffect(
    useCallback(() => {
        console.log("focus howa!", _id)
      fetchUser();
    }, [fetchUser])
  );

    const handleUser =  useCallback(async(user)=>{
        if(user){
            dispatch(handleRemoveUserFromUsers(user?._id))
            if(user?.isFollowing){
                dispatch(handleRemoveUserFromFollowings(user?._id))
                dispatch(handleStatsChange({
                    followings:-1,
                    }))
                    await axiosInstance.post("/follow", {_id:user?._id});
            }
        }

        
          },[])

    const handleBlock = async()=>{
        setLoading(prev=>({
            ...prev,
            blockLoading:true
        }))
        try{
            
            const res = await axiosInstance.post(`/block`, {_id});
            await handleUser(user)

            if(res?.data?.message){
                setTitles(prev=>({...prev, blockTitle:"Blocked"}))
                Snackbar.show({
                    text: `${user?.name } is blocked.`,
                    duration: Snackbar.LENGTH_SHORT,
                });

            }
        }catch(error){


        }finally{
            setLoading(prev=>({
                ...prev,
                blockLoading:false
            }))

        }
      

    }


    if (loading.initialLoading) {
        return (
            <ImageBackground source={home} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFA100" />
            </ImageBackground>
        );
    }
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>

                <Header
                    cb={() => navigation.goBack()} showMenu={false} showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} showText={false} />

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={[1, 1, 1]}
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

                                        <View style={{
                                            flexDirection: "row",
                                            gap: scale(10)
                                        }}>

                                            <Text
                                                // numberOfLines={1} ellipsizeMode="tail"
                                                style={{
                                                    color: "white",
                                                    fontWeight: 600,
                                                    fontSize: scale(35),
                                                    lineHeight: scale(50),
                                                    marginBottom: scale(20),
                                                    // maxWidth: scale(200)

                                                }}>
                                                {/* {getFormattedName(user?.name?user?.name:"")} */}
                                                {user?.name}

                                            </Text>
                                        </View>
                                        <ExternalUserCard
                                        _id={_id}
                                          totalCheckIns ={user?.checkinsCount||0}
                                          totalFollowersCount={user?.followers||0}
                                          totalFollowingCount={user?.following||0}
                                          url={user?.image||""}
                                          name={getFormattedName(user?.name?user?.name:"")}
                                          date={user?.date||""}
                                          reviewsCount={user?.reviewsCount}

                                           />


                                    </View>
                                }
                                {
                                    index == 1 && <View>
                                        <View style={{
                                            marginBottom: scale(10)
                                        }}>

                                            {/* <CustomInput

                                                imageStyles={{ top: "50%", transform: [{ translateY: -0.5 * scale(25) }], width: scale(25), resizeMode: 'contain', height: scale(25), aspectRatio: "1/1" }}
                                                isURL={false}
                                                showImage={true}
                                                uri={search}

                                                cb={() => setPage(1)}
                                                name="search"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.search}
                                                showTitle={false}
                                                placeholder="Search Favourite..."
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,
                                                    paddingLeft: scale(45)

                                                }} /> */}
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            Vibration.vibrate(10)
                                            navigation.navigate("AllUserReviews", {_id})

                                        }}>

                                            <Text style={{
                                                textDecorationLine: "underline", color: "white",
                                                fontSize: scale(10),
                                                fontWeight: 700,
                                                lineHeight: scale(13),
                                                fontFamily: "Montserrat"
                                            }}>
                                                All hot sauce reviews
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                }
                                {
                                    index == 2 && <View style={{
                                        marginTop: scale(30),
                                        gap:scale(30)
                                    }}>

                                        <SauceList _id={_id} type={"favourite"} data={topRatedSauces} name={name} title='Favorites' searchTerm={query.search} />
                                        <SauceList _id={_id} type={"checkedin"} data={topRatedSauces} title='Checked in Sauces' searchTerm={query.search} />
                                        <SauceList _id={_id} type={"reviewed"} title='Reviewed Sauces' data={topRatedSauces} />



                                        <View style={{
                                            marginTop: scale(60),
                                            marginBottom: scale(20),
                                            gap: scale(20)
                                        }}>
                                            {
                                                auth._id!==_id&&

                                                <CustomButtom
                                                disabled={loading?.initialLoading}
                                                loading={loading?.blockLoading}
                                                    Icon={() => <Image source={arrow} />}
                                                    showIcon={true}
                                                    buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                    buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                    onPress={() => {
                                                        Vibration.vibrate(10);
                                                        handleBlock()
                                                        // Alert.alert("Blocked")
    
                                                    }}
                                                    title={titles.blockTitle}
    
                                                />
                                            }
                                       


                                            {/* <CustomButtom
                                            disabled={loading}

                                                Icon={() => <Image source={arrow} />}
                                                showIcon={true}
                                                buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                // onPress={() => {
                                                //     Vibration.vibrate(10);
                                                //     Alert.alert("reported")

                                                // }}
                                                title={`Report`}

                                            /> */}


                                            {/* <CustomButtom
                                             disabled={loading?.initialLoading}


                                                Icon={() => <Image source={arrow} />}
                                                showIcon={true}
                                                buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                // onPress={() => {
                                                //     Vibration.vibrate(10);
                                                //     // navigation.navigate("SauceDetails")
                                                //     Alert.alert("shared")
                                                // }}
                                                title={`Share`}

                                            /> */}
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

export default ExternalProfileScreen

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})