import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import getStartedbackground from './../../../assets/images/EventDetailBG.png';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { formatEventDate } from '../../../utils.js';
import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
import { useRoute } from '@react-navigation/native';
import CustomSelectListModal from '../../components/CustomSelectListModal/CustomSelectListModal.jsx';
import Snackbar from 'react-native-snackbar';
import CustomTimer from '../../components/CustomTimer/CustomTimer.jsx';
import Location from './../../../assets/images/locationIcon.png';
import calender from './../../../assets/images/calender.png';
import destination from './../../../assets/images/destination.png';
import UserDetailsModal from '../../components/UserDetailsModal/UserDetailsModal.jsx';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { GOOGLE_MAP_API_KEY } from "@env"
import useAxios from '../../../Axios/useAxios.js';
import MapView, { Marker, Polyline } from 'react-native-maps';
import yellowChilli from "./../../../assets/images/yellow-chilli.png";
import redChilli from "./../../../assets/images/red-chilli.png";
import darkArrow from "./../../../assets/images/darkArrow.png";
import { useDispatch, useSelector } from 'react-redux';
// import { handleInterestedEvents, handleRemoveInterestedEvents } from '../../../android/app/Redux/InterestedEvents.js';
// import { handleAllEventsExceptInterested } from '../../../android/app/Redux/allEventsExceptInterested.js';

import MapViewDirections from 'react-native-maps-directions';

import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';
import { handleAllEventsExceptInterested } from '../../Redux/allEventsExceptInterested.js';
import { handleInterestedEvents, handleRemoveInterestedEvents } from '../../Redux/InterestedEvents.js';

const EventPage = () => {
  const route = useRoute();
  const event = route?.params?.event
  const [loading, setLoading] = useState(false);
  const mapViewRef = useRef(null)
  const [initialLoading, setInitialLoading] = useState(true);
  const [isKeyBoard, setIsKeyBoard] = useState(false);
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const navigation = useNavigation();
  const [eventDistance, setEventDistance] = useState(null);
  const [eventDuration, setEventDuration] = useState(null); // Added
  const [eventCoords, setEventsCoords] = useState(null)
  const [currentCoords, setCurrentCoords] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);
 const interestedEvents = useSelector(state=>state?.interestedEvents)
 const isInterestedEvent = !!interestedEvents?.find(item=>item?._id==event?._id)
 const [isLocationAvailable, setIsLocationAvailable] = useState(false)
 const [tempIsInterested, setTempIsInterested] = useState(isInterestedEvent)
 const [yesNoModal, setYesNoModal] = useState({
  open: false,
  message: "",
  severity: "success",
  cb: () => { },
  isQuestion:false
})
 const [alertModal, setAlertModal] = useState({
  open: false,
  message: "",
  success: true
})
  const axiosInstance = useAxios()
  const dispatch = useDispatch()
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });




  const fetchDirections = async (origin, destination) => {
    try {
      const response = await axiosInstance.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: GOOGLE_MAP_API_KEY,
          // mode: 'driving', // You can change mode to walking, bicycling, or transit
        },
      });

      if (response.data.status === 'OK') {
        const points = response.data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
      return  setRouteCoordinates(decodedPoints);
      }
      // if (response.data.status !== 'OK') {
      //   console.error('Google Maps API Error:', response.data.status);
      //   Alert.alert("Error", `Directions request failed: ${response.data.status}`);
      //   return;
      // }
      else {
        console.error('Error fetching directions:', response.data.status);
      }
    } catch (error) {
      console.error('Error in API request:', error);
    }
  };

  const toggleFullScreenMap = () => {
    setIsFullScreenMap(!isFullScreenMap);
  };


  const decodePolyline = (t, e = 5) => {
    let points = [];
    let index = 0, lat = 0, lng = 0;
    const len = t.length;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };
//   const handleInterestedEvent = async()=>{
//     setTempIsInterested(prev=>!prev)
//     const x = interestedEvents?.find(item=>item?._id==event?._id)
//     if(!!x){
//       dispatch(handleRemoveInterestedEvents(event?._id))
// }
//     if(!x){
//             //  dispatch(handleRemoveAllEventsExceptInterested(event?._id))
//         // return dispatch(handleRemoveInterestedEvents(event?._id))
//         dispatch(handleAllEventsExceptInterested([event]))

//         dispatch(handleInterestedEvents([event]))
//       }
//       const res = await axiosInstance.post(`/interest-event`, {
//           eventId:event?._id
//       });


// }
const handleInterestedEvent = async () => {
    setTempIsInterested(prev=>!prev)

  const eventExists = interestedEvents?.some(item => item?._id === event?._id);
  if (eventExists) {
    dispatch(handleRemoveInterestedEvents(event?._id));
  } else {
    dispatch(handleInterestedEvents([event]));
  }
  // Update the backend
  await axiosInstance.post('/interest-event', { eventId: event?._id });
};

  useEffect(() => {
    const fakeFetch = async () => {
      setTimeout(() => {
        setInitialLoading(false);

      }, 1000)
    };
    fakeFetch();
  }, []);

  useEffect(() => {
    setEventsCoords({
      latitude: parseFloat(event.venueLocation.latitude),
      longitude: parseFloat(event.venueLocation.longitude),
    });
    const checkLocationServiceAndNavigate = () => {
      // setIsLoading(prev => ({ ...prev, loadMap: true }))
      setLoading(true);
      // Start loading indicator
      const permission = Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      check(permission).then(result => {
          if (result === RESULTS.GRANTED) {
              fetchCurrentLocation();
          } else if (result === RESULTS.DENIED) {
              setYesNoModal({
                  open: true,
                  message: "Location Permission Required. Would you like to grant permission?",
                  success: true,
                  isQuestion:true,
                  cb: () => {
                      request(permission).then(result => {
                          if (result === RESULTS.GRANTED) {
                              fetchCurrentLocation();
                          } else {
                              // Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
                              Alert.alert(
                                  "Location Permission Blocked",
                                  "Please enable location permission in your device settings to use this feature.",
                                  [
                                      { text: "Cancel", style: "cancel" },
                                      { text: "Open Settings", onPress: () => Linking.openSettings() }
                                  ]
                              );
                              setLoading(false)  // Stop loading indicator
                          }
                      });
                  }
              });
          } else {
              setYesNoModal({
                  open: true,
                  message: "Location Permission Required. Would you like to grant permission?",
                  success: true,
                  isQuestion:true,

                  cb: () => {
                      request(permission).then(result => {
                          if (result === RESULTS.GRANTED) {
                              fetchCurrentLocation();
                          } else {
                              Alert.alert(
                                  "Location Permission Blocked",
                                  "Please enable location permission in your device settings to use this feature.",
                                  [
                                      { text: "Cancel", style: "cancel" },
                                      { text: "Open Settings", onPress: () => Linking.openSettings() }
                                  ]
                              );
                              setLoading(false) // Stop loading indicator
                          }
                      });
                  }
              });
          }
      }).catch(error => {
          console.warn("Error checking location permission:", error);
          setAlertModal({
              open: true,
              message: "An error occurred while checking location permission. Please try again.",
              success: false
          })
         setLoading(false) // Stop loading indicator
      });
  };



    // const checkLocationServiceAndNavigate = () => {
    //   setLoading(true); // Start loading indicator
    //   const permission = Platform.OS === 'ios'
    //     ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    //     : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    //   check(permission).then(result => {
    //     if (result === RESULTS.GRANTED) {
    //       fetchCurrentLocation();
    //       setIsLocationAvailable(true)

    //     } else if (result === RESULTS.DENIED) {
    //       request(permission).then(result => {
    //         if (result === RESULTS.GRANTED) {
    //           fetchCurrentLocation();
    //           setIsLocationAvailable(true)
    //         } else {
    //           // Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
    //           setYesNoModal({
    //             open: true,
    //             message:  "Location Permission Required Please grant location permission to use this feature.",
    //             success: false,
    //             isQuestion:true,

    //         })
    //           setLoading(false); // Stop loading indicator
    //         }
    //       });
    //     } else {
    //       setLoading(false); // Stop loading indicator
    //       setYesNoModal({
    //         open: true,
    //         message:  "Location Permission, Location permission is not available or blocked. Please enable it in settings.",
    //         success: false,
    //         isQuestion:true
    //     })
    //       // Alert.alert("Location Permission, Location permission is not available or blocked. Please enable it in settings.");
    //     }
    //   }).catch(error => {
    //     console.warn("Error checking location permission:", error);
    //     setAlertModal({
    //       open: true,
    //       message:  "Error An error occurred while checking location permission. Please try again.",
    //       success: false
    //   })
    //     // Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
    //     setLoading(false); // Stop loading indicator
    //   });
    // };

    const fetchCurrentLocation = async () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          setEventsCoords({
            latitude: parseFloat(event.venueLocation.latitude),
            longitude: parseFloat(event.venueLocation.longitude),
          });
          setCurrentCoords({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          });
          await fetchDirections({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }, {
            latitude: parseFloat(event.venueLocation.latitude),
            longitude: parseFloat(event.venueLocation.longitude),
          });
          setIsLocationAvailable(true)

          const response = await axiosInstance.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
            params: {
              origins: `${position.coords.latitude},${position.coords.longitude}`,
              destinations: `${event.venueLocation.latitude},${event.venueLocation.longitude}`,
              key: GOOGLE_MAP_API_KEY

            }
          })
          // const result = response.data.rows[0].elements[0].distance.value
          if (response.data.status === "OK") {
            const elements = response.data.rows[0].elements;

            // Check if elements exist and status is not "NOT_FOUND"
            if (elements.length > 0 && elements[0]?.status !== "NOT_FOUND") {
              const distanceInMeters = elements[0]?.distance?.value;
              const distanceInMiles = distanceInMeters / 1609.34;
              if(distanceInMiles){
                // setEventDistance(distanceInMiles?.toFixed(2))
              }
              console.log(`Distance from origin to destination: ${distanceInMeters} meters`);
            } else {
              console.log("Distance could not be calculated. Check origin and destination addresses.");
            }
          } else {
            console.error("Error in fetching distance:", response.data.status);
          }



          setLoading(false); // Stop loading indicator
        },
        (error) => {
          console.log("Error fetching current location:", error);
          setAlertModal({
            open: true,
            message:  "Location Service Error, Could not fetch current location. Please ensure your location services are enabled and try again.",
            success: false
        })
          // Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
          setLoading(false); // Stop loading indicator
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
      );
    };
    checkLocationServiceAndNavigate()
  }, [event])




  useEffect(() => {
    if (event && event.venueLocation) {
      const { latitude, longitude } = event.venueLocation;
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setRegion({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 2,
          longitudeDelta: 2,
        });
      } else {
        // Alert.alert('Invalid Coordinates', 'Latitude and longitude must be valid numbers.');
        setAlertModal({
          open: true,
          message:  "Invalid Coordinates', 'Latitude and longitude must be valid numbers.",
          success: false
      })
        // "Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again."
      }
    }
  }, [event]);


  if (initialLoading) {
    return (
      <ImageBackground
        source={getStartedbackground}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }



  return (
    <View View style={{
      flex: 1,
      position:"relative"
    }}>
{
  isFullScreenMap&&<SafeAreaView

  style={{
    flex:1,
    position:"relative"
  }}>

    <TouchableOpacity style={{
      position: 'absolute',
      top:scale(80),
      left:scale(10),
      zIndex:1000
    }} onPress={toggleFullScreenMap}

    >
     <Image style={{ width: scale(30), height: scale(20), objectFit:"contain" }} source={darkArrow}/>
    </TouchableOpacity>
     <View
                    style={{
                     flex:1,
                     width:"100%"
                    }}>
                    <MapView
                    ref={mapViewRef}
                      style={{ width: "100%", height: "100%"}}
                      zoomTapEnabled={true}
                      initialRegion={{
                        ...region,
                        latitudeDelta: 5,
                        longitudeDelta:5,
                      }}

                    >

                      {!!eventCoords && (
                        <Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          onPress={(e) => { console.log(e) }}
                          coordinate={{
                            latitude: eventCoords.latitude,
                            longitude: eventCoords.longitude,
                          }}>
                          <View >
                            <Image
                              source={redChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>
                      )}


                      {!!currentCoords && (
                        <Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          onPress={(e) => { console.log(e) }}
                          coordinate={{
                            latitude: currentCoords.latitude,
                            longitude: currentCoords.longitude,
                          }}>
                          <View >
                            <Image
                              source={yellowChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>
                      )}


{/* {routeCoordinates.length > 0 && (
        <Polyline
        coordinates={routeCoordinates}
        strokeWidth={4}
        strokeColor="#4285F4" // Google Maps-like blue color
        lineCap="round" // Smooth line ends
      />
        )} */}

                    {  !!currentCoords && !!eventCoords&& <MapViewDirections
                          origin={{
                            latitude: currentCoords.latitude,
                            longitude: currentCoords.longitude,
                          }}
                          destination={{
                            latitude: eventCoords.latitude,
                            longitude: eventCoords.longitude,
                          }}
                          apikey={GOOGLE_MAP_API_KEY}
                             strokeWidth={6}
            strokeColor="#FFA100"

            onReady={result => {
              // Fit map to route
              mapViewRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 50,
                  right: 50,
                  bottom: 50,
                  left: 50,
                },
                animated: true,
              });
          
              // Set distance and duration
              setEventDistance((result.distance * 0.621371).toFixed(2)); // Convert km to miles
              setEventDuration(Math.ceil(result.duration)); // Duration in minutes
              console.log("result.duration===============>", result.duration)
            }}

                        />}
        
                    </MapView>

                  </View>
  </SafeAreaView>
}
   {! isFullScreenMap &&<ImageBackground
      source={getStartedbackground}
      style={{ flex: 1, width: '100%', height: '100%' }}
      // source={getStartedbackground}
      >
      <SafeAreaView
        style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>

        <Header
          showMenu={false}
          cb={() => navigation.goBack()}
          showProfilePic={false}
          headerContainerStyle={{
            paddingBottom: scale(20),
          }}
          title={'Event'}
          showText={false}
        />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 1, 1, 1]}
          renderItem={({ item, index }) => {
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
                      flex: 1,
                    }}>
                    <View
                      style={{
                        marginBottom: scale(30),
                        gap: scale(20),
                      }}>
                      <View
                        style={{
                          marginBottom: scale(30),

                        }}>
                        <CustomTimer eventTime={event?.eventDate} />
                      </View>
                      <View
                        style={{
                          gap: scale(5),

                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          {
                            event?.eventName &&
                            <Text
                              // ellipsizeMode='tail'
                              // numberOfLines={1}
                              style={{
                                // maxWidth: scale(200),
                                fontSize: scale(25),
                                fontWeight: 800,
                                lineHeight: scale(33),
                                color: 'white',
                              }}>
                              {event?.eventName}
                            </Text>
                          }
                          {/* <TouchableOpacity
                          onPress={handleInterestedEvent}
                            style={{
                              paddingHorizontal: scale(10),
                              paddingVertical: scale(6),
                              backgroundColor: '#FFA100',
                              borderRadius: scale(5),
                              elevation: scale(5),
                              alignSelf: 'flex-end',
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontWeight: '700',
                              }}>
                              {tempIsInterested?"Not-Interested":"Interested"}
                            </Text>
                          </TouchableOpacity> */}
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: scale(5),
                          }}>
                          <Text
                            style={{
                              color: 'white',
                            }}>
                            Organized by
                          </Text>
                          {
                            event?.owner?.name ?
                            <TouchableOpacity onPress={() => {
                              setOpenUserDetailsModal(true)
                            }}>

                              <Text
                                style={{
                                  color: '#FFA100',
                                  textDecorationLine:"underline"
                                }}>

                                {event?.owner?.name ?event?.owner?.name :"N/A"}
                              </Text>
                            </TouchableOpacity>
                            :<Text style={{
                              color:"white"
                            }}>N / A</Text>
                          }
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        gap: scale(25),
                        // backgroundColor:"yellow"

                      }}>
                      {
                        event?.eventDate &&
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: scale(10),

                          }}>
                          <Image
                            style={{
                              width: scale(20),
                              height: scale(20),
                              aspectRatio: '1/1',
                            }}
                            source={calender}
                          />
                          <Text
                            style={{
                              fontSize: scale(12),
                              fontWeight: 700,
                              fontFamily: 'Montserrat',
                              color: 'white',
                              flexShrink: 1
                            }}>
                            {
                              formatEventDate(event?.eventDate)
                            }
                          
                          </Text>
                        </View>
                      }
                      {
                        event?.venueName &&
                        <View
                          style={{
                            flexDirection: 'row',
                            // gap: scale(20),
                            // flexWrap:"wrap"
                            paddingRight:scale(20),
                            // backgroundColor:"green"
                          }}>
                            <View style={{
                              flexDirection:"row",
                              gap:scale(10),
                              alignItems:"start",
                              // flexWrap:"wrap",
                              // backgroundColor:"red",
                              // paddingRight:scale(40)
                            }}>

                            <Image
                            style={{
                              width: scale(18),
                              height: scale(23),
                              marginTop:scale(5)

                            }}
                            source={Location}
                          />
                          <View style={{
                            // backgroundColor:"blue",
                            flexShrink:1
                          }}>

                            <Text
                              // ellipsizeMode='tail'
                              style={{
                                // maxWidth: scale(100),
                                fontSize: scale(16),
                                lineHeight: scale(22),
                                color: '#FFA100',
                              }}>
                              {event?.venueName?.charAt(0).toUpperCase() + event?.venueName?.slice(1).toLowerCase()}
                              
                            </Text>
                          </View>
                            </View>

                          {/* <View
                            style={{
                              gap: scale(6),

                            }}>

                            <Text
                              style={{
                                color: 'white',
                                fontSize: scale(11),
                                lineHeight: scale(14),
                              }}>
                              {event?.venueDescription}
                            </Text>
                          </View> */}
                        </View>
                      }

                    </View>
                  </View>
                )}

                {index == 1 && (
                  <View
                    style={{
                      marginBottom: scale(20),
                      gap: scale(20),
                    }}>
                      <View>

                       <TouchableOpacity
                          onPress={handleInterestedEvent}
                            style={{
                              paddingHorizontal: scale(10),
                              paddingVertical: scale(6),
                              backgroundColor: '#FFA100',
                              borderRadius: scale(5),
                              elevation: scale(5),
                              alignSelf: 'flex-start',
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontWeight: '700',
                              }}>
                              {tempIsInterested?"Not-Interested":"Interested"}
                            </Text>
                          </TouchableOpacity>
                    <Text
                      style={{
                        color: 'white',
                        lineHeight: verticalScale(29),
                        fontSize: moderateScale(24),
                        fontWeight: 600,
                        marginTop: scale(20),
                      }}>
                      Details
                    </Text>
                      </View>

                    {/* <ProductsBulletsList
                        bulletGap={{
                          height:scale(10)
                        }}
                      data={event?.eventDetails}
                      textStyles={{
                        fontWeight: 700,
                        color: 'white',
                      }}
                    /> */}

<Text
                              style={{
                                color: 'white',
                                fontSize: scale(11),
                                lineHeight: scale(14),
                              }}>
                              {event?.venueDescription}
                            </Text>
                    <View
                      style={{
                        marginTop: scale(30),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          lineHeight: verticalScale(29),
                          fontSize: moderateScale(24),
                          fontWeight: 600,
                        }}>
                        About The Venue
                      </Text>
                      <TouchableOpacity
                        onPress={()=>{
                          toggleFullScreenMap()
                        }}
                        style={{
                          paddingHorizontal: scale(10),
                          paddingVertical: scale(6),
                          backgroundColor: '#FFA100',
                          borderRadius: scale(5),
                          elevation: scale(5),
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: '700',
                          }}>
                          Get Destinations
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {event.venueLocation.longitude && event.venueLocation.latitude && <View
                      style={{
                        height: isFullScreenMap ? '100%' : scale(200), width: '100%',
                        minWidth: scale(300),
                        borderRadius: scale(10),
                      }}>
                      <MapView
                        style={{ width: "100%", height: "100%", }}
                        zoomTapEnabled={true}
                        initialRegion={{
                          ...region,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}

                      >

                        {!!eventCoords && (
                          <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            onPress={(e) => { console.log(e) }}
                            coordinate={{
                              latitude: eventCoords.latitude,
                              longitude: eventCoords.longitude,
                            }}>
                            <View >
                              <Image
                                source={redChilli}
                                style={[{ width: scale(50), height: scale(50) }]}
                              />
                            </View>
                          </Marker>
                        )}


                        {!!currentCoords && (
                          <Marker
                            anchor={{ x: 0.5, y: 0.5 }}
                            onPress={(e) => { console.log(e) }}
                            coordinate={{
                              latitude: currentCoords.latitude,
                              longitude: currentCoords.longitude,
                            }}>
                            <View >
                              <Image
                                source={yellowChilli}
                                style={[{ width: scale(50), height: scale(50) }]}
                              />
                            </View>
                          </Marker>
                        )}


{(routeCoordinates.length > 0 && isFullScreenMap)&&(
          <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#4285F4" // Google Maps-like blue color
          lineCap="round" // Smooth line ends
        />
          )}
                      </MapView>

                    </View>}
                    <View
                      style={{
                        gap: scale(6),
                      }}>
                      <Text
                        style={{
                          fontSize: scale(16),
                          lineHeight: scale(22),
                          color: '#FFA100',
                        }}>
                          {
                            // isLocationAvailable?eventDistance?" m":"" "distance from you":"Distance from you not available"
                            isLocationAvailable && eventDistance==null?"Press get directions for event details": isLocationAvailable?eventDistance?`${eventDistance} Miles from you`:"":"Please enable location to use this feature"
                          }
                          {
                            eventDuration?` and estimated time is ${eventDuration} mins`:""
                          }
                        {/* {eventDistance+ `${eventDistance?" m":""}`}  distance from you */}
                      </Text>
                      {/* <Text
                        style={{
                          color: 'white',
                          fontSize: scale(11),
                          lineHeight: scale(14),
                        }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Text> */}
                    </View>
                  </View>
                )}
              </View>
            );
          }}
        />
      </SafeAreaView>
      <YesNoModal
                      isQuestion= {yesNoModal.isQuestion}
                        modalVisible={yesNoModal.open}
                        setModalVisible={() => {
                            setYesNoModal({
                                open: false,
                                message: "",
                                severity: true,
                            })
                            // setIsLoading(prev => ({
                            //     ...prev,
                            //     loadMap: false
                            // }))
                            setLoading(false)
                        }}
                        success={yesNoModal.severity}
                        title={yesNoModal.message}
                        cb={yesNoModal.cb}

                    />
      <CustomAlertModal
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    success={alertModal?.success}
                    setModalVisible={() => setAlertModal({
                        alertModal: false,
                        message: ""
                    })}
                />
      <UserDetailsModal
        name={event?.owner?.name}
        email={event?.owner?.email}
        profilePicture={event?.owner?.image}
        number={event?.owner?.phone?event?.owner?.phone:"N/A"}
        modalVisible={openUserDetailsModal}
        setModalVisible={setOpenUserDetailsModal}
      />
    </ImageBackground>}
    </View>
  );
};

export default EventPage;
