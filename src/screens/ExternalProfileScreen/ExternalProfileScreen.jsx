import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, Vibration, Image, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { getFormattedName, handleText, topRatedSauces } from '../../../utils.js';
import ExternalUserCard from '../../components/ExternalUserCard/ExternalUserCard.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import arrow from "./../../../assets/images/arrow.png";
import useAxios from '../../../Axios/useAxios.js';
import Snackbar from 'react-native-snackbar';
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
        initialLoading:false,
    });
    const dispatch = useDispatch()
    const [titles, setTitles] = useState({
        blockTitle:user?.isBlocked ? 'Unblock' : 'Block',
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
   
     // Function to fetch user data
  const fetchUser = useCallback(async () => {
    if (!_id || loading.initialLoading) return; // Ensure _id is available
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
    }
  }, [_id]);

  useFocusEffect(
    useCallback(() => {
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
            console.log("res=================>", res.data)
            await handleUser(user)

            if(res?.data?.message){
                setTitles(prev=>({...prev, blockTitle:res.data.isBlocked?"Unblock":"Block"}))
                Snackbar.show({
                    text: `${user?.name } is ${res.data.isBlocked?"Blocked":"Unblocked"}.`,
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
                                                        // Vibration.vibrate(10);
                                                        handleBlock()
                                                        // Alert.alert("Blocked")
    
                                                    }}
                                                    title={titles.blockTitle}
    
                                                />
                                            }
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