import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import {scale} from 'react-native-size-matters';
import SingleReview from '../../components/SingleReview/SingleReview.jsx';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import useAxios from '../../../Axios/useAxios.js';
import {FlatList} from 'react-native-gesture-handler';
import NotFound from '../../components/NotFound/NotFound.jsx';

const AllReviewsScreen = ({showAddReviewButton = true}) => {
  const axiosInstance = useAxios();
  const route = useRoute();
  const _id = route?.params?._id;
  // const setReviewCount = route?.params?.setReviewCount|| function(){}
  // const reviewCount = route?.params?.reviewCount|| null
  // const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount|| function(){}
  // const product = route?.params?.product||{};
  // const sauceType = route?.params?.sauceType;
  // const mycb = route?.params?.mycb || function(){};

  const sauceType = route?.params?.sauceType||"" 
  const url = route?.params?.url||"" 
  const title = route?.params?.title||"" 
  const item = route?.params?.item||{}
  const mycb = route?.params?.mycb||function(){}
  const handleIncreaseReviewCount = route?.params?.handleIncreaseReviewCount||function(){}
  const setReviewCount = route?.params?.setReviewCount||function(){}
  const reviewCount = route?.params?.reviewCount||"" 
  const handleLike = route?.params?.handleLike|| function(){}




  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/get-sauce-reviews`, {
        params: {
          sauceId: _id,
          page,
        },
      });
      setHasMore(res.data.pagination.hasNextPage);
      setData(prev=>[...prev, ...res?.data?.reviews]);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [page, _id]);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.addListener("focus", ()=>{
      fetchReviews();

    })
    return () => {
      navigation.removeListener("focus", ()=>{
        setPage(1);
        setData([]);
        fetchReviews();
      })
    }
  }, [fetchReviews]);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Optionally, you can show an alert or simply prevent going back
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <ImageBackground
      style={{flex: 1, width: '100%', height: '100%'}}
      source={home}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <Header
            showMenu={false}
            showText={false}
            cb={() => 
              // navigation.goBack()
              {
                navigation.navigate("ProductDetail", {
                  url,
                  title,
                  item,
                  reviewCount,
                  setReviewCount,
                  handleIncreaseReviewCount,
                  sauceType,
                  mycb
                 })
              }
            
            }
            showProfilePic={false}
            showDescription={false}
          />
          <View
            style={{
              paddingHorizontal: scale(20),
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: scale(40),
              paddingBottom: 100,
              gap: scale(10),
            }}>
            <View
              style={{
                gap: scale(20),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: scale(35),
                    lineHeight: scale(50),
                  }}>
                  Reviews
                </Text>
                {showAddReviewButton && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddReview', {sauceId: _id, setPage,
                        //  handleIncreaseReviewCount, setReviewCount, reviewCount, mycb, sauceType, product
                        item,title, url, sauceType, mycb, handleIncreaseReviewCount, setReviewCount, reviewCount,handleLike

                        
                        });
                    }}
                    style={{
                      backgroundColor: '#2e210a',
                      padding: scale(10),
                      // alignSelf: "flex-start",
                      borderRadius: scale(10),
                      borderWidth: 1,
                      borderColor: '#FFA100',
                    }}>
                    <Text
                      style={{
                        fontSize: scale(13),
                        color: 'white',
                      }}>
                      Add Review +
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

             {data?.length>0
             ? <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={data}
                onEndReachedThreshold={1}
                onEndReached={() => {
                  if (!loading && hasMore) {
                    setPage(currentPage => currentPage + 1);
                  }
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
               
                  <SingleReview
                  isNavigate={true}
                  url={item?.owner.image}
                  name={item?.owner.name}
                  _id={item?.owner?._id}
                  item={item} />
                )}
              />
            :
            loading?
            <ActivityIndicator size="small" color="#FFA100" />
            :
            <NotFound/>
            
            }
           
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AllReviewsScreen;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#2e210a',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderColor: '#FFA100',
    borderWidth: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontSize: scale(14),
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#2e210a',
    borderColor: '#FFA100',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: scale(14),
    fontWeight: '500',
    color: 'white',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
