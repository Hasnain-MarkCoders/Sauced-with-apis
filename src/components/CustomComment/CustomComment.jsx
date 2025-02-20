import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { scale } from 'react-native-size-matters';
import emptyheart from './../../../assets/images/emptyHeart.png';
import filledHeart from './../../../assets/images/filledHeart.png';
import useAxios from '../../../Axios/useAxios';
import ImageView from 'react-native-image-viewing';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomAlertModal from '../CustomAlertModal/CustomAlertModal';
import YesNoModal from '../YesNoModal/YesNoModal';
import { MapPin, Pencil, Trash } from 'lucide-react-native';
import { useSelector } from 'react-redux';

const CustomComment = ({
  getId = () => { },
  uri = '',
  text = '',
  title = '',
  profileUri = '',
  showImages = false,
  handleSubmitMessage = () => { },
  assets = [],
  replies,
  showBorder = true,
  isReply = false,
  count = 0,
  index = 0,
  cb = () => { },
  _id = '',
  item = {},
  email = '',
  likesCount = 0,
  hasLikedUser = false,
  location = null,
  address = null,
  sauce_name = null,
  sauce_id = null,
  foodPairings = [],
  ownerId = null,
  fetchCheckings=()=>{},
}) => {
  const axiosInstance = useAxios()

  const auth = useSelector(state=>state.auth)
  const authId = auth?._id
  useEffect(() => { }, [profileUri]);
  
  const [commentStatus, setCommentStatus] = useState(hasLikedUser);
  const [visible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false)
  const [imageIndex, setImageIndex] = useState(0);
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [likeCount, setLikesCount] = useState(likesCount);
  const [showMore, setShowMore] = useState(text?.length > 200)
  const [yesNoModal, setYesNoModal] = useState({
    open: false,
    message: '',
    severity: 'success',
    isQuestion: false,
    cb: () => { },
  });
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });
  let watchId = useRef(null)
  const navigation = useNavigation()
  const handleLike = async () => {
    try {
      setLikesCount(prev => (commentStatus && prev > 0 ? prev - 1 : prev + 1));
      setCommentStatus(prev => !prev);
      const res = await axiosInstance.post(`/like-checkin`, { checkinId: _id });
      setLikesCount(res.data?.likesCount);
      Snackbar.show({
        text: !commentStatus ? 'Liked' : 'Unliked',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) { }
  };

  const checkLocationServiceAndNavigate = async () => {
    setLocationLoading(true); // Start loading indicator
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await check(permission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          setAlertModal({
            open: true,
            message: 'Location services are  N/A on this device.',
            success: false,
          });
          setLocationLoading(false);
          break;
        case RESULTS.DENIED:
          showPermissionModal(
            'Location Permission Required. Would you like to grant permission?',
            async () => {
              const requestResult = await request(permission);
              if (requestResult === RESULTS.GRANTED) {
                fetchCurrentLocation();
              } else if (requestResult === RESULTS.BLOCKED) {
                handleBlockedPermission();
              } else {
                setLocationLoading(false);
              }
            },
          );
          break;
        case RESULTS.LIMITED:
          // iOS only: proceed with limited access
          fetchCurrentLocation();
          break;
        case RESULTS.GRANTED:
          fetchCurrentLocation();
          break;
        case RESULTS.BLOCKED:
          handleBlockedPermission();
          break;
        default:
          setAlertModal({
            open: true,
            message:
              'An unexpected error occurred while checking location permission.',
            success: false,
          });
          setLocationLoading(false);
          break;
      }
    } catch (error) {
      console.warn('Error checking location permission:', error);
      setAlertModal({
        open: true,
        message:
          'An error occurred while checking location permission. Please try again.',
        success: false,
      });
      setLocationLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    watchId.current = Geolocation.watchPosition(
      position => {
        navigation.navigate('Get-directions', {
          currentCoords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          targetCoords: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          fn: () => { },
          showContinue: true,
        });
        setLocationLoading(false); // Stop loading indicator
      },
      error => {
        let errorMessage = '';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permission to access location was denied.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'The request to get user location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while fetching location.';
            break;
        }
        setAlertModal({
          open: true,
          message: `Location Service Error: ${errorMessage}`,
          success: false,
        });
        setLocationLoading(false); // Stop loading indicator
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 },
    );
  };

  const showPermissionModal = (message, onConfirm) => {
    setYesNoModal({
      open: true,
      message: message,
      success: true,
      isQuestion: true,
      cb: onConfirm,
    });
  };

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        // Android: Open Location Settings
        const url = 'android.settings.LOCATION_SOURCE_SETTINGS';
        await Linking.sendIntent(url);
      } else if (Platform.OS === 'ios') {
        // iOS: Open App Settings
        const url = 'app-settings:';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open settings');
        }
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert('Error', 'Unable to open settings');
    }
  };

  const handleBlockedPermission = () => {
    Alert.alert(
      'Location Permission Blocked',
      'Please enable location permission in your device settings to use this feature.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setLocationLoading(false) },
        {
          text: 'Open Settings',
          onPress: () => {
            openLocationSettings();
            setLocationLoading(false);
          },
        },
      ],
    );
  };
  const handleDelete = ()=>{
    setYesNoModal({
      open: true,
      message: "Delete "+(isReply?"Comment?":"Check-in?"),
      severity: "success",
      cb: async() => { 
        let endpoint = ""
        if(isReply){
        endpoint =  `/delete-comment?commentId=${item._id}`
        fetchCheckings(_id, item._id)
        }else{
          endpoint =  `/delete-checkin/${_id}`
        fetchCheckings(_id)
        }
        const res = await axiosInstance.delete(endpoint);
      },
      isQuestion:true
    })
  }

  const handleEditReview = ()=>{
    setYesNoModal({
      open: true,
      message: "Edit " + (isReply?"Comment?":" Check-in?"),
      severity: "success",
      cb: () => { 

        if(isReply){
          getId(_id,item._id)
          setTimeout(()=>{
            handleSubmitMessage();
          },0)
        }else{

          navigation.navigate('EditCheckInScreen', {_id})
        }
      },
      isQuestion:true
    })
  }

  const handleClearWatchid = useCallback(() => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current)
    }
  }, [])

  useEffect(() => {
    handleClearWatchid()
    return () => {
      handleClearWatchid()
    }

  }, [watchId])



  return (
    <View
      style={{
        gap: isReply ? scale(0) : scale(20),
        borderBottomColor: '#FFA100',
        borderBottomWidth: showBorder && count > 1 ? 1 : 0,
        marginBottom: isReply ? scale(0) : scale(30),
        paddingBottom: isReply ? scale(0) : scale(30),
      }}>
        {/* profile */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: scale(20),
            flexShrink: 1,
            flexGrow: 1,
          }}>
          <View
            style={{
              position: 'relative',
            }}>
            {isLoading && (
              <SkeletonPlaceholder
                speed={1600}
                borderColor={'#FFA100'}
                borderWidth={1}
                backgroundColor="#2E210A"
                highlightColor="#fff">
                <SkeletonPlaceholder.Item
                  width={isReply ? scale(30) : scale(58)}
                  height={isReply ? scale(30) : scale(58)}
                  borderRadius={scale(58)}
                />
              </SkeletonPlaceholder>
            )}
            <Image
              onLoad={() => setIsLoading(false)}
              style={{
                width: isReply ? scale(30) : scale(60),
                height: isReply ? scale(30) : scale(60),
                borderRadius: scale(50),
                borderColor: '#FFA100',
                borderWidth: scale(1),
                opacity: isLoading ? 0 : 1,
                position: isLoading ? 'absolute' : 'relative',
              }}
              source={{ uri: profileUri }}
            />
          </View>
          <View
            style={{
              flexShrink: 1,
              flexGrow: 1,
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setOpenUserDetailsModal(true);
                  cb({
                    profileUri,
                    name: title,
                    email,
                    number: '+1234567890',
                    item,
                  }, isReply);
                }}>
                <Text
                  style={{
                    color: isReply ? 'white' : '#FFA100',
                    fontWeight: 700,
                    fontSize: isReply ? scale(12) : scale(14),
                    lineHeight: scale(17),
                    paddingVertical: scale(10),
                  }}>
                  {title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProductScreen", {
                    _id: sauce_id
                  })
                }}>
                <Text
                  style={{
                    color: isReply ? 'white' : '#FFA100',
                    fontWeight: 700,
                    fontSize: isReply ? scale(8) : scale(9),
                    lineHeight: scale(10),
                    textDecorationLine: "underline"
                  }}>
                  {sauce_name}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <>
            <>
              {

                showMore ?
                  <>
                    <Text
                      style={{ maxWidth: '90%', color: 'white' }}>
                      {text.slice(0,200) }
                    </Text>
                    <TouchableOpacity
                    
                    style={{
                      backgroundColor: '#FFA500', // Set the background color in the View
                      borderRadius: scale(20), // Apply the borderRadius here
                      paddingHorizontal: scale(10),
                      paddingVertical: scale(5),
                      marginRight:"auto",
                      marginTop:!showMore ? 0:scale(10)

                    }}
                    onPress={() => {
                      setShowMore(false)
                    }}>
                      <Text>
                        show more
                      </Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    <Text
                     style={{ maxWidth: '90%', color: 'white' }}
                    >{text}</Text>
                   {text.length>200&& <TouchableOpacity
                      style={{
                        backgroundColor: '#FFA500', // Set the background color in the View
                        borderRadius: scale(20), // Apply the borderRadius here
                        paddingHorizontal: scale(10),
                        paddingVertical: scale(5),
                        marginRight:"auto",
                        marginTop:showMore ? scale(10):scale(0)

                      }}
                      onPress={() => {
                        setShowMore(true)
                      }}
                    >
                      <Text>
                        show less
                      </Text>
                    </TouchableOpacity>}
                  </>
              }
            </>
            {address && <View style={{
              flexDirection: "row",
              gap: scale(10),
              marginTop: scale(10),
              // marginLeft: -40
            }}>
              <MapPin size={30} stroke={"#FFA500"} />
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={{ maxWidth: '90%', color: 'white' }}>
                {address}
              </Text>
            </View>}
            </> */}
          </View>
        </View>
        <View>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => {
              handleLike();
            }}>
            <View
              style={{
                display: isReply ? 'none' : 'flex',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: scale(20),
                  height: scale(20),
                  objectFit: 'contain',
                }}
                source={commentStatus ? filledHeart : emptyheart}
              />
              <Text
                style={{
                  color: 'white',
                }}>
                {likeCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        { ownerId==authId &&  <View style={{
            flexDirection: "row",
            gap: scale(20),
            marginTop:scale(10),
            justifyContent:"flex-end",
          }}>
          <Pencil hitSlop={20}
            onPress={()=>{
              handleEditReview()
          }}  size={14} stroke={"#FFA500"} />
          <Trash hitSlop={20} onPress={()=>{
           handleDelete()
          }}   size={14} stroke={"#FFA500"} />
          </View>}
        </View>
      </View>
{/* message and address */}
      <>
        <View style={{
        }}>
          {

            showMore ?
              <>
                <Text
                  style={{ maxWidth: '100%', color: 'white' }}>
                  {text?.slice(0, 200) + "..."}
                </Text>
                <TouchableOpacity

                  style={{
                    backgroundColor: '#FFA500', // Set the background color in the View
                    borderRadius: scale(20), // Apply the borderRadius here
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(5),
                    marginRight: "auto",

                  }}
                  onPress={() => {
                    setShowMore(false)
                  }}>
                  <Text style={{
                    color: 'black'
                  }}>
                    show more
                  </Text>
                </TouchableOpacity>
              </>
              :
              <>
                <Text
                  style={{ maxWidth: '100%', color: 'white' }}
                >{text}</Text>
                {text.length > 200 && <TouchableOpacity
                  style={{
                    backgroundColor: '#FFA500', // Set the background color in the View
                    borderRadius: scale(20), // Apply the borderRadius here
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(5),
                    marginRight: "auto",

                  }}
                  onPress={() => {
                    setShowMore(true)
                  }}
                >
                  <Text style={{
                    color: 'black'
                  }}>
                    show less
                  </Text>
                </TouchableOpacity>}
              </>
          }
     
        </View>
        {address && <View style={{
          flexDirection: "row",
          gap: scale(10),
        }}>
          <MapPin size={30} stroke={"#FFA500"} />
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{ maxWidth: '90%', color: 'white' }}>
            {address}
          </Text>
        </View>}
      </>

      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(7),
      }}>
        {foodPairings?.map((foodPair, index) => <View key={index}><Text style={{
          backgroundColor: '#2e210a', // Dark box for unselected chips
          borderRadius: scale(20),
          paddingVertical: scale(6),
          paddingHorizontal: scale(10),
          borderColor: '#FFA500', // Orange border for chips to match the theme
          borderWidth: scale(1),
          alignItems: 'center',
          color: "white"
        }}>{foodPair}</Text></View>)}
      </View>
      {assets.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            gap: scale(20),
            flexWrap: 'wrap',
            width: '100%',
          }}>
          {assets.map(
            (uri, index) =>
              uri && (

                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(true);
                    setImageIndex(index);
                  }}>
                  <Image
                    style={{
                      width: scale(120),
                      height: scale(100),
                      minWidth: scale(120),
                      minHeight: scale(100),
                      borderRadius: scale(10),
                      borderColor: '#FFA100',
                      borderWidth: scale(1),
                    }}
                    source={{ uri }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ),
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          gap: scale(10),
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
          }}
          onPress={() => {
            handleSubmitMessage();
            getId(_id);
          }}>
          <View
            style={{
              backgroundColor: '#FFA500', // Set the background color in the View
              borderRadius: scale(20), // Apply the borderRadius here
              paddingHorizontal: scale(10),
              paddingVertical: scale(5),
              display: isReply ? 'none' : 'flex',
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: scale(12),
              }}>
              Reply
            </Text>
          </View>
        </TouchableOpacity>

        {replies?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setShowReplies(prev => !prev);
            }}
            style={{
              alignSelf: 'flex-start',
            }}>
            {
              <View
                style={{
                  borderRadius: scale(20),
                  backgroundColor: '#FFA500',
                  paddingHorizontal: scale(10),
                  paddingVertical: scale(5),
                }}>
                <Text
                  style={{
                    fontSize: scale(12),

                    color: '#000',
                  }}>
                  {showReplies ? 'Hide replies' : 'Show replies'}
                </Text>
              </View>
            }
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={{
            marginLeft:"auto",
            display: (location?.latitude && location?.longitude) ? 'flex' : 'none',

          }}
          onPress={() => {
            checkLocationServiceAndNavigate()
          }}>
          <View
            style={{
              backgroundColor: '#FFA500', // Set the background color in the View
              borderRadius: scale(20), // Apply the borderRadius here
              paddingHorizontal: scale(10),
              paddingVertical: scale(5),
              display: isReply ? 'none' : 'flex',
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: scale(12),
              }}>
                {
                  locationLoading?
                  "Loading..."
                  :"Get Directions"
                }
            </Text>
          </View>
        </TouchableOpacity> */}

      </View>

      {showReplies ? (
        <View
          style={{
            alignSelf: 'flex-start',
            gap:scale(20)
          }}>
          {replies?.map(item => (
            <CustomComment
            _id={_id}
            getId={getId}
              cb={cb}
              isReply={true}
              showBorder={false}
              handleSubmitMessage={handleSubmitMessage}
              profileUri={item?.user?.image}
              email={item?.user?.email}
              title={item?.user?.name}
              text={item.text}
              item={item}
              ownerId={item?.user?._id}
              fetchCheckings={fetchCheckings}
            />
          ))}
        </View>
      ) : null}
      <ImageView
        imageIndex={imageIndex}
        images={assets.map(uri => ({ uri: uri }))}
        visible={visible}
        onRequestClose={() => {
          setIsVisible(false);
        }}
      />
      <CustomAlertModal
        title={alertModal.message}
        modalVisible={alertModal.open}
        setModalVisible={() =>
          setAlertModal({
            open: false,
            message: '',
            success: true,
          })
        }
        success={alertModal.success}
      />
      <YesNoModal
        isQuestion={yesNoModal.isQuestion}
        modalVisible={yesNoModal.open}
        setModalVisible={() => {
          setYesNoModal({
            open: false,
            message: '',
            severity: true,
          });
          setLocationLoading(false);
        }}
        showCancel={true}
        success={yesNoModal.severity}
        // title={'Location Request'}
        title={yesNoModal.message}
        cb={yesNoModal.cb}
      />
    </View>
  );
};

export default CustomComment;

const styles = StyleSheet.create({});
