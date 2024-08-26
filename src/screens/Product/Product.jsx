import { ImageBackground, SafeAreaView, Text, View, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { memo, useEffect, useState, useRef } from 'react'
import Header from '../../components/Header/Header.jsx'
import getStartedbackground from './../../../assets/images/ProductDescription.jpg';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { handleText, messagesData, topRatedSauces } from '../../../utils.js';
import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { useRoute } from "@react-navigation/native"
import CustomSelectListModal from '../../components/CustomSelectListModal/CustomSelectListModal.jsx';
import Snackbar from 'react-native-snackbar';
import CommentsList from '../../components/CommentsList/CommentsList.jsx';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import user1 from "./../../../assets/images/user1.png"
import UserDetailsModal from '../../components/UserDetailsModal/UserDetailsModal.jsx';
import useAxios from '../../../Axios/useAxios.js';

const Product = () => {
  const route = useRoute()
  const { url = "", title = "" } = route?.params
  const product = route?.params?.item
  const fetchSuaces = route.params.fetchSuaces
  const setSaucesData = route.params.setSaucesData
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true)
  const [isKeyBoard, setIsKeyBoard] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [id, setId] = useState(0)
  const [query, setQuery] = useState({search:""})
  const [userData, setUserData] = useState({})
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false)
  const [isEnabled, setisEnabled] = useState(true)
  const navigation = useNavigation()
  const [isNewMsg, setNewMsg] = useState(false)
  const axiosInstance = useAxios()

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoard(true)
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoard(false)
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSubmitMessage = (data)=>{
    setIsKeyBoard(true)
}



const getId = (id=0)=>{
    return setId(id)
}
const handleAddMessage = ()=>{
  if(isNewMsg){
      messagesData.unshift({
          url: user1,
          title: "Mike Smith",
          text:query.search,
          assets:[],
          replies:[]
      })
      setQuery({search:""})
      setNewMsg(false)
      return
  }
  messagesData[id].replies.unshift({
          url: user1,
          title: "Mike Smith",
          text:query.search,
      })
      setQuery({search:""})
}

  useEffect(() => {
    const fetchPhotos = async () => {
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
          setData(prevData => [...prevData, ...res.data]);

        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);

      } finally {
        setLoading(false);
        setInitialLoading(false)
      }
    };
    fetchPhotos();
  }, [page]);
  const handleLoading = (listNumber, action) => {
    if (listNumber == 1) {

      return setLoading1(action)
    }
    if (listNumber == 2) {
      return setLoading2(action)
    }
    if (listNumber == 3) {
      return setLoading3(action)
    }

  }
  addToList = async(listNumber) => {
  

      try {
        handleLoading(listNumber, true)
        Snackbar.show({
          text: `sauce adding in List ${listNumber}`,
          duration: Snackbar.LENGTH_SHORT,
          action: {
            text: 'UNDO',
            textColor: '#FFA100',
    
            onPress: () => {
              Snackbar.show({
                text: `sauce remove from List ${listNumber}`,
                duration: Snackbar.LENGTH_SHORT,
              });
            },
          },
        });
        
        const type=listNumber==1?"triedSauces":listNumber==2?"toTrySauces":"favoriteSauces"
          const res = await axiosInstance.post(`/bookmark`, {sauceId:product?._id, listType:type});
      } catch (error) {
          console.error('Failed to like / dislike:', error);
      } finally {
      handleLoading(listNumber, false)
      setModalVisible(false)
      setisEnabled(true)
      }
  }
  const handleUserProfileView = (data)=>{
    navigation.navigate("ExternalProfileScreen", {url:data.profileUri, name:data.name})
}


  if (initialLoading) {
    return (
      <ImageBackground source={getStartedbackground} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={getStartedbackground}>
      <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
        <Header

          showMenu={false}
          cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
            paddingBottom: scale(20)
          }} title={""} showText={false} />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 1, 1, 1]}
          renderItem={({ item, index }) => {
            return (
              <View


                style={{
                  width: "100%",
                  flex: 1,
                  paddingHorizontal: scale(20),

                }}>

                {
                  index == 0 && <View style={{
                    marginBottom: scale(20)
                  }}>
                    <ProductCard
                    setSaucesData={setSaucesData}
                    product={product}
                    fetchSuaces={fetchSuaces}
                      setshowListModal={setModalVisible}
                      url={url} title={title} />
                  </View>
                }

                {
                  index == 1 && <View style={{
                    marginBottom: scale(20),
                    gap: scale(20)
                  }}>


                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: 600,
                    }}>
                      About {product?.name}

                    </Text>

                    <Text style={{
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: scale(12),
                      fontWeight: 700,
                      lineHeight: 20,

                    }}>
                      {product?.description}
                    </Text>


                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: "600",
                      marginTop: scale(20)
                    }}>
                      Chili peppers used

                    </Text>

                    <ProductsBulletsList
                    data={product?.chilli}
                    bulletStyle={{
                      backgroundColor:"#FFA100"
                    }}
                    textStyles={{
                      fontWeight: 700
                    }} />



                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: 600,
                      marginTop: scale(20)

                    }}>
                      Ingredients

                    </Text>

                    <Text style={{
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: scale(12),
                      fontWeight: 700,
                      lineHeight: 18,

                    }}>
                      1 lb. Fresh Chiles, Such As Jalapeno, Serrano, Fresno, Poblano, Habanero, Or A Mix.

                    </Text>


                  </View>
                }
                {
                  index == 2 && <View style={{
                    marginTop: scale(20),
                    marginBottom: scale(20)
                  }}>
                    <View style={{
                      gap: scale(30)
                    }}>

                      <SauceList title='Shared Images' data={topRatedSauces} />
                      <View>
                        <Text style={{
                          color: "white",
                          lineHeight: scale(29),
                          fontSize: scale(24),
                          fontWeight: "600",
                          marginTop: scale(20)
                        }}>
                          Check-ins
                        </Text>
                      </View>

                      {/* <CommentsList setPage={setPage} data={data} loading={loading} hasMore={hasMore} /> */}
                      <CommentsList product={product} cb={handleUserProfileView} getId={getId} setNewMsg={setNewMsg} handleSubmitMessage = {handleSubmitMessage} setPage={setPage}
                                        //  data={data} 
                                         data={messagesData}
                                        
                                        loading={loading} hasMore={hasMore} />

                    </View>


                  </View>


                }
              </View>
            )
          }}
        />
        <CustomSelectListModal
          modalVisible={modalVisible}
          setModalVisible={() => { setModalVisible(false) }}
          cb={addToList}
          isEnabled={isEnabled}
          loading1={loading1}
          loading2={loading2}
          loading3={loading3}
          title1="List 1"
          title2="List 2"
          title3="List 3"

        />
      </SafeAreaView>
      { isKeyBoard &&
               <View style={{
                marginBottom:scale(10)
               }}>
               <CustomInput
               autoFocus ={isKeyBoard}
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
                        background:"red",
                        width:"95%",
                        margin:"auto",
                        marginBottom:scale(10)
                    }}
                    inputStyle={{
                        borderColor: "#FFA100",
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 15,
                        paddingLeft: scale(10),
                        textAlignVertical:"top"

                    }} />  
                    <TouchableOpacity
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
                        width:"95%",
                        margin:"auto"

                    }}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700",
                        textAlign:"center"

                    }}>Submit</Text>


                </TouchableOpacity></View> }
                <UserDetailsModal
                name={userData.name}
                email={userData.email}
                number={userData.number}
                profilePicture={userData.profileUri}
                modalVisible={openUserDetailsModal}
                setModalVisible={setOpenUserDetailsModal}
            />
    </ImageBackground>

  )
}

export default memo(Product)
