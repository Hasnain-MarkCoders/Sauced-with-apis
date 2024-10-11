import {
    ImageBackground,
    SafeAreaView,
    Text,
    View,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
  } from 'react-native';
  import React, {useCallback, useEffect, useState} from 'react';
  import Header from '../../components/Header/Header.jsx';
  import getStartedbackground from './../../../assets/images/ProductDescription.jpg';
  import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
  import {useFocusEffect, useNavigation} from '@react-navigation/native';
  import {FlatList} from 'react-native-gesture-handler';
  import SauceList from '../../components/SauceList/SauceList.jsx';
  import {handleText, messagesData, topRatedSauces} from '../../../utils.js';
  import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
  import ProductCard from '../../components/ProductCard/ProductCard.jsx';
  import {useRoute} from '@react-navigation/native';
  import CustomSelectListModal from '../../components/CustomSelectListModal/CustomSelectListModal.jsx';
  import Snackbar from 'react-native-snackbar';
  import CommentsList from '../../components/CommentsList/CommentsList.jsx';
  import CustomInput from '../../components/CustomInput/CustomInput.jsx';
  import user1 from './../../../assets/images/user1.png';
  import UserDetailsModal from '../../components/UserDetailsModal/UserDetailsModal.jsx';
  import useAxios from '../../../Axios/useAxios.js';
  import {useDispatch, useSelector} from 'react-redux';
  import {
    handleRemoveSauceFromListOne,
    handleSaucesListOne,
  } from '../../../android/app/Redux/saucesListOne.js';
  import {
    handleRemoveSauceFromListThree,
    handleSaucesListThree,
  } from '../../../android/app/Redux/saucesListThree.js';
  import {
    handleRemoveSauceFromListTwo,
    handleSaucesListTwo,
  } from '../../../android/app/Redux/saucesListTwo.js';
import ProductScreenCard from '../../components/ProductScreenCard/ProductScreenCard.jsx';
  
  const ProductScreen = ({

  }) => {
  
  
  
  
    const route = useRoute();
    const auth = useSelector(state=>state?.auth)
    const title = route?.params?.title;
    const url= route?.params?.url;
    const product = route?.params?.item;
    const setCount = route?.params?.setCount||function(){};
    
  
    const mycb = route?.params?.mycb|| function(){}
    const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount|| function(){}
    const handleLike = route?.params?.handleLike|| function(){}
    const setSelected = route?.params?.setSelected|| function(){}
    const sauceType = route?.params?.sauceType||"";
    const _id = route?.params?._id||"";

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isKeyBoard, setIsKeyBoard] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [id, setId] = useState(0);
    const [query, setQuery] = useState({search: ''});
    const [sauce, setSauce] = useState(null)
    const [userData, setUserData] = useState({
      image: "",
      name: "",
      email:"",
      phone:""
    });
    const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
    const [isEnabled, setisEnabled] = useState(true);
    const navigation = useNavigation();
    
    const [isAlreadyInList, setAlreadyInList] = useState({
      list1: false,
      list2: false,
      list3: false,
    });
    const dispatch = useDispatch();
    const axiosInstance = useAxios();
    const list1 = useSelector(state => state?.saucesListOne);
    const list2 = useSelector(state => state?.saucesListTwo);
    const list3 = useSelector(state => state?.saucesListThree);
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyBoard(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyBoard(false);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);
  
  
    const handleSubmitMessage = data => {
      setIsKeyBoard(true);
    };
  
    const getId = (id = 0) => {
      return setId(id);
    };
 
  
    const handleAddMessage = async () => {
      const existingMessage = data.find(item => item?._id == id)
      console.log(existingMessage)
      if (existingMessage) {
          existingMessage?.comments?.push({
              user: { image: auth?.url, name: auth?.name }, text: query.search
          })
          setQuery({ search: "" })
          const res = await axiosInstance.post(`/create-comment`, {
              "checkinId": id,
              "text": query.search
          });
      }
  
  
  
  }
  
  
  useEffect(()=>{
console.log("_id================================================>",_id)
  },[_id])
  
    useEffect(() => {
      if (list1.find(item => item?._id == sauce?._id)) {
        setAlreadyInList(prev => ({...prev, list1: true}));
      }
      if (list2.find(item => item?._id == sauce?._id)) {
        setAlreadyInList(prev => ({...prev, list2: true}));
      }
      if (list3.find(item => item?._id == sauce?._id)) {
        setAlreadyInList(prev => ({...prev, list3: true}));
      }
  
      return () => {
        setAlreadyInList(prev => ({list1: false, list2: false, list3: false}));
      };
    }, [route?.params?.item]);
  
    // useEffect(() => {
      const fetchCheckings = useCallback(async () => {
          if (!hasMore || loading) return;
          // setLoading(true);
          try {
              const res = await axiosInstance.get(`/get-checkins`, {
                  params: {
                      page: page,
                      _id
                  }
              });
              setHasMore(res?.data?.pagination?.hasNextPage);
              console.log("res.data?.checkins====================================================================>", res?.data?.checkins)
              if (res?.data?.checkins?.length){
  
                setData(prev => [...prev, ...res?.data?.checkins]);
              }
          } catch (error) {
              console.error('Failed to fetch photos:', error);
          } finally {
              // setLoading(false);
            //   setInitialLoading(false);
          }
      },[page]);
  
  

  const fetchProduct =useCallback( async () => {
    // if (!hasMore || loading) return;
    // setLoading(true);
    // setInitialLoading(true)
    try {
        const res = await axiosInstance.post(`/view-sauce`, {
            // params: {
             "sauceId":_id
            // }
        });

        setSauce(res.data.sauce)
      
    } catch (error) {
        console.error('Failed to fetch photos:', error);
    } finally {
        // setLoading(false);
        setInitialLoading(false);
    }
},[_id]);

//   useEffect(() => {
  
//     navigation.addListener("focus", ()=>{

//         fetchProduct();
//     })
  
      
//     // return()=>{
//     //     setInitialLoading(true)
//     // }
// }, [_id]);
useEffect(()=>{
return ()=>{
  setData([])
}
},[])

useFocusEffect(
    useCallback(() => {
      fetchProduct();
      fetchCheckings();

    }, [_id, page]) // Ensure _id is included if it can change
  );
  
    const handleLoading = (listNumber, action) => {
      if (listNumber == 1) {
        return setLoading1(action);
      }
      if (listNumber == 2) {
        return setLoading2(action);
      }
      if (listNumber == 3) {
        return setLoading3(action);
      }
    };
    addToList = async listNumber => {
      try {
        handleLoading(listNumber, true);
        Snackbar.show({
          text: `sauce adding in List ${listNumber}`,
          duration: Snackbar.LENGTH_SHORT,
          // action: {
          //   text: 'UNDO',
          //   textColor: '#FFA100',
  
          //   onPress: () => {
          //     Snackbar.show({
          //       text: `sauce remove from List ${listNumber}`,
          //       duration: Snackbar.LENGTH_SHORT,
          //     });
          //   },
          // },
        });
  
        const type =
          listNumber == 1
            ? 'triedSauces'
            : listNumber == 2
            ? 'toTrySauces'
            : 'favoriteSauces';
        //adding sauces
        if (listNumber == 1 && !isAlreadyInList?.list1) {
          dispatch(handleSaucesListOne([sauce]));
        }
  
        if (listNumber == 2 && !isAlreadyInList?.list2) {
          dispatch(handleSaucesListTwo([sauce]));
        }
  
        if (listNumber == 3 && !isAlreadyInList?.list3) {
          dispatch(handleSaucesListThree([sauce]));
        }
  
        // removeing sauces
        if (listNumber == 1 && isAlreadyInList?.list1) {
          dispatch(handleRemoveSauceFromListOne(_id));
        }
  
        if (listNumber == 2 && isAlreadyInList?.list2) {
          dispatch(handleRemoveSauceFromListTwo(_id));
        }
  
        if (listNumber == 3 && isAlreadyInList?.list3) {
          dispatch(handleRemoveSauceFromListThree(_id));
        }
  
        const res = await axiosInstance.post(`/bookmark`, {
          sauceId: product?._id,
          listType: type,
        });
    //     // setAlreadyInList(prev=>({...prev, [`list${listNumber}`]:!isAlreadyInList[`list${listNumber}`]}))
  
  
      
      } catch (error) {
        console.error('Failed to like / dislike:', error);
      } finally {
        handleLoading(listNumber, false);
        setModalVisible(false);
        setisEnabled(true);
      }
    };
    const handleUserProfileView = data => {
      console.log(data.item._id)
      setOpenUserDetailsModal(true)
      setUserData({
        image: data.item?.owner?.image,
        name: data.item?.owner?.name,
        email:data.item?.owner?.email,
        phone:data.item?.owner?.phone||"N/A"
      })
      // navigation.navigate('ExternalProfileScreen', {
      //   url: data.item.image,
      //   name: data.item.name,
      //    _id:data.item._id
      // });
    };
  
  
    if (initialLoading) {
      return (
        <ImageBackground
          source={getStartedbackground}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#FFA100" />
        </ImageBackground>
      );
    }
  
    return (
      <ImageBackground
        style={{flex: 1, width: '100%', height: '100%'}}
        source={getStartedbackground}>
        <SafeAreaView
          style={{flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0)}}>
          <Header
            showMenu={false}
            cb={() =>{
                
                navigation.navigate("Main")
                
                // navigation.goBack()


            }}
            showProfilePic={false}
            headerContainerStyle={{
              paddingBottom: scale(20),
            }}
            title={''}
            showText={false}
          />
  
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={[1, 1, 1, 1]}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: '100%',
                    flex: 1,
                    paddingHorizontal: scale(20),
                  }}>
                  {index == 0 && (
                    <View
                      style={{
                        marginBottom: scale(20),
                      }}>
                        
                      <ProductScreenCard
                      hasUserLiked = {sauce?.hasLiked}
                      _id={sauce?._id}
                      url={sauce?.image}
                      name={sauce?.name}
                      averageRating={sauce?.averageRating}
                      totalReviews={sauce?.reviewCount}
                      totalcheckIn={sauce?.checkIn}
                      amazonLink={sauce?.amazonLink}
                      productLink={sauce?.productLink}
                      websiteLink={sauce?.websiteLink}
                      sauce={sauce}
                      setSelected={setSelected}
                      handleLike={handleLike}
                      handleIncreaseReviewCount={handleIncreaseReviewCount}
                      mycb={mycb}
                        sauceType={sauceType}
                        product={product}
                        setshowListModal={setModalVisible}
                        title={title}
                      />
                         
                    </View>
                  )}
  
                  {index == 1 && (
                    <View
                      style={{
                        marginBottom: scale(20),
                        gap: scale(20),
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          lineHeight: verticalScale(29),
                          fontSize: moderateScale(24),
                          fontWeight: 600,
                        }}>
                        { sauce?.name?"About "+ sauce?.name:"N/A"}
                      </Text>
  
                      <Text
                        style={{
                          color: 'white',
                          // fontFamily: 'Montserrat',
                          fontSize: scale(13),
                          fontWeight: 400,
                          lineHeight: 20,
                        }}>
                        {sauce?.description? sauce?.description:"N/A"}
                      </Text>
  
                      <Text
                        style={{
                          color: 'white',
                          lineHeight: verticalScale(29),
                          fontSize: moderateScale(24),
                          fontWeight: '600',
                          marginTop: scale(20),
                        }}>
                        Chili Peppers
                      </Text>
  
                      <ProductsBulletsList
                        data={sauce?.chilli}
                        bulletStyle={{
                          backgroundColor: '#FFA100',
                        }}
                        textStyles={{
                          fontWeight: 700,
                        }}
                      />
  
                      <Text
                        style={{
                          color: 'white',
                          lineHeight: verticalScale(29),
                          fontSize: moderateScale(24),
                          fontWeight: 600,
                          marginTop: scale(20),
                        }}>
                        Ingredients
                      </Text>
  
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Montserrat',
                          fontSize: scale(12),
                          fontWeight: 700,
                          lineHeight: 18,
                        }}>
                        {sauce?.ingredients?sauce?.ingredients:"N/A"}
                      </Text>
                    </View>
                  )}
                  {index == 2 && (
                    <View
                      style={{
                        marginTop: scale(20),
                        marginBottom: scale(20),
                      }}>
                      <View
                        style={{
                          gap: scale(30),
                        }}>
                        {/* <SauceList title="Shared Images" data={topRatedSauces} /> */}
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              lineHeight: scale(29),
                              fontSize: scale(24),
                              fontWeight: '600',
                              marginTop: scale(20),
                            }}>
                            Check-ins
                          </Text>
                        </View>
  
                              <CommentsList
                              commentsData={data}
                              cb={handleUserProfileView}  getId={getId} handleSubmitMessage={handleSubmitMessage} setPage={setPage}
                              loading={loading} hasMore={hasMore}
                              />
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />
         { sauce &&<CustomSelectListModal
         _id={_id}
         sauce={sauce}
            modalVisible={modalVisible}
            setModalVisible={() => {
              setModalVisible(false);
            }}
            cb={addToList}
            isEnabled={isEnabled}
            loading1={loading1}
            loading2={loading2}
            loading3={loading3}
            title1={
              isAlreadyInList.list1 ? 'Remove from list 1' : 'Add in List 1'
            }
            title2={
              isAlreadyInList.list2 ? 'Remove from list 2' : 'Add in List 2'
            }
            title3={
              isAlreadyInList.list3 ? 'Remove from list 3' : 'Add in List 3'
            }
          />}
        </SafeAreaView>
        {isKeyBoard && (
          <View
            style={{
              marginBottom: scale(10),
            }}>
            <CustomInput
              autoFocus={isKeyBoard}
              imageStyles={{
                top: '50%',
                transform: [{translateY: -0.5 * scale(25)}],
                resizeMode: 'contain',
                width: scale(25),
                height: scale(25),
                aspectRatio: '1/1',
              }}
              isURL={false}
              showImage={true}
              uri={''}
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
                background: 'red',
                width: '95%',
                margin: 'auto',
                marginBottom: scale(10),
              }}
              inputStyle={{
                borderColor: '#FFA100',
                borderWidth: 1,
                borderRadius: 10,
                padding: 15,
                paddingLeft: scale(10),
                textAlignVertical: 'top',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                handleAddMessage();
                // Linking.openURL(url)
                setIsKeyBoard(false);
              }}
              style={{
                paddingHorizontal: scale(10),
                paddingVertical: scale(10),
                backgroundColor: '#FFA100',
                borderRadius: scale(5),
                elevation: scale(5),
                alignSelf: 'flex-end',
                width: '95%',
                margin: 'auto',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <UserDetailsModal
          name={userData.name}
          email={userData.email}
          number={userData.phone}
          profilePicture={userData.image}
          modalVisible={openUserDetailsModal}
          setModalVisible={setOpenUserDetailsModal}
        />
      </ImageBackground>
    );
  };
  
  export default ProductScreen;
  