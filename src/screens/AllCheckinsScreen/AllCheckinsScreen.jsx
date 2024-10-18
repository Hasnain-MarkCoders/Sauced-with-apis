import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import CommentsList from '../../components/CommentsList/CommentsList.jsx';
import search from "./../../../assets/images/search_icon.png";
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { handleText } from '../../../utils.js';
import { messagesData } from '../../../utils';
import user1 from "./../../../assets/images/user1.png"
import UserDetailsModal from '../../components/UserDetailsModal/UserDetailsModal.jsx';
import useAxios from '../../../Axios/useAxios.js';

const AllCheckinsScreen = ({
}) => {
    const route = useRoute()
 
    const fn = route?.params?.fn||function(){}
    const numberOfRoutesBack = route?.params?.routerNumber||1

    
    const isBack = route?.params?.isBack||false 
    const auth = useSelector(state => state.auth)
    const url  = route?.params?.url||""
    const title = route?.params?.title||""
    const item = route?.params?.item||{}
    const  reviewCount = route?.params?.reviewCount||""
    const  setReviewCount = route?.params?.setReviewCount||function(){}
    const  handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount||function(){}
    const  mycb = route?.params?.mycb||function(){}
    const handleLike = route?.params?.handleLike|| function(){}
    const  sauceType  = route?.params?.sauceType||"" 
    const uri = auth?.url
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const _id = route?.params?._id
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [id, setId] = useState(0)
    const [query, setQuery] = useState({
        search: "",
    });
    const navigation = useNavigation()
    const axiosInstance = useAxios()
    const handleSubmitMessage = (data) => {
        setIsKeyBoard(true)
    }
    const getId = (id = 0) => {
        return setId(id)
    }
    const handleUserProfileView = (data) => {
        console.log(data?.item?.owner?._id)
        navigation.navigate("ExternalProfileScreen", { url: data?.profileUri, name: data?.name, _id:data?.item?.owner?._id })
    }
    const handleAddMessage = async () => {
        const existingMessage = data.find(item => item?._id == id)
        if (existingMessage) {
            existingMessage?.comments?.push({
                user: { image: uri, name: auth?.name }, text: query.search
            })
            setQuery({ search: "" })
            const res = await axiosInstance.post(`/create-comment`, {
                "checkinId": id,
                "text": query.search
            });
        }

    }
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyBoard(true)
            console.log('Keyboard is open');
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyBoard(false)
            console.log('Keyboard is closed');
        });

        // Cleanup function
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        const fetchCheckings = async () => {
            if (!hasMore || loading) return;
            setLoading(true);
            console.log(_id)
            try {
                const res = await axiosInstance.get(`/get-checkins`, {
                    params: {
                        page: page,
                        _id
                    }
                });
                setHasMore(res?.data?.pagination?.hasNextPage);
                setData(prev => [...prev, ...res?.data?.checkins]);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCheckings();
    }, [page]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //       const onBackPress = () => {
    //         // Optionally, you can show an alert or simply prevent going back
    //         return true; // Prevent default behavior
    //       };
    
    //       BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
    //       return () =>
    //         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [])
    //   );

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBeforeRemove = (e) => {
    //             // Prevent default behavior
    //             e.preventDefault();

    //             // Navigate to the desired screen using replace to avoid stacking
    //             navigation.replace("ProductScreen", { _id });

    //             // Alternatively, reset the navigation stack:
    //             /*
    //             navigation.dispatch(
    //                 CommonActions.reset({
    //                     index: 0,
    //                     routes: [{ name: 'ProductScreen', params: { _id } }],
    //                 })
    //             );
    //             */
    //         };

    //         // Add the beforeRemove listener
    //         navigation.addListener('beforeRemove', onBeforeRemove);

    //         // Cleanup the listener on unmount
    //         return () => {
    //             navigation.removeListener('beforeRemove', onBeforeRemove);
    //         };
    //     }, [navigation, _id])
    // );

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', e => {
          e.preventDefault(); // Prevent default action
          unsubscribe() // Unsubscribe the event on first call to prevent infinite loop
          navigation.navigate('ProductScreen', {_id}) // Navigate to your desired screen
          if(isBack){
             navigation.goBack()
           }else{
               navigation.navigate("ProductScreen", {
                   _id
                   })
           }
                      
        });
     }, [])


    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>

                <Header
                    showMenu={false}
                    // cb={() => (navigation.pop(numberOfRoutesBack), fn())} 
                    cb={() => {
                        // if(!isBack){
                        //   return  navigation.navigate("ProductDetail", {
                        //          url,
                        //          title,
                        //          item,
                        //          reviewCount,
                        //          setReviewCount,
                        //          handleIncreaseReviewCount,
                        //          sauceType,
                        //          mycb,
                        //          handleLike
                        //         })
                        // }
                       if(isBack){
                        return navigation.goBack()
                       }
                                  
                          return  navigation.navigate("ProductScreen", {
                                _id
                                })
                        // }


                    }} 

                    
                    showProfilePic={false} headerContainerStyle={{
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
                                    index == 0 &&

                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(35),
                                        lineHeight: scale(50),
                                        marginBottom: scale(20)

                                    }}>
                                        Check-ins

                                    </Text>
                                }
                                {
                                    index == 1 && <View style={{
                                    }}>

                                        <CommentsList
                                            commentsData={data}
                                            cb={handleUserProfileView} 
                                           getId={getId} handleSubmitMessage={handleSubmitMessage} setPage={setPage}
                                            data={messagesData}
                                            loading={loading} hasMore={hasMore} />
                                    </View>
                                }
                            </View>
                        )
                    }}
                />
                {isKeyBoard &&
                    <View style={{
                        marginBottom: scale(10)
                    }}>
                        <CustomInput
                            autoFocus={isKeyBoard}
                            imageStyles={{ top: "50%", transform: [{ translateY: -0.5 * scale(25) }], resizeMode: 'contain', width: scale(25), height: scale(25), aspectRatio: "1/1" }}
                            isURL={false}
                            showImage={true}
                            uri={""}
                            name="search"
                            multiline={true}
                            numberOfLines={3}
                            onChange={handleText}
                            updaterFn={setQuery}
                            value={query.search}
                            showTitle={false}
                            placeholder="Write a comment."
                            containterStyle={{
                                flexGrow: 1,
                                background: "red",
                                width: "95%",
                                margin: "auto",
                                marginBottom: scale(10)
                            }}
                            inputStyle={{
                                borderColor: "#FFA100",
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 15,
                                paddingLeft: scale(10),
                                textAlignVertical: "top",
                                paddingVertical:scale(15)

                            }} />
                        <TouchableOpacity
                            disabled={query?.search ? false : true}

                            onPress={() => {
                                handleAddMessage()
                                // Linking.openURL(url)
                                setIsKeyBoard(false)

                            }}
                            style={{
                                paddingHorizontal: scale(10),
                                paddingVertical: scale(10),
                                backgroundColor: "#FFA100",
                                borderRadius: scale(5),
                                elevation: scale(5),
                                alignSelf: "flex-end",
                                width: "95%",
                                margin: "auto"

                            }}>
                            <Text style={{
                                color: "black",
                                fontWeight: "700",
                                textAlign: "center"

                            }}>Submit</Text>


                        </TouchableOpacity></View>}

            </SafeAreaView>
        </ImageBackground>
    )
}

export default AllCheckinsScreen

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})