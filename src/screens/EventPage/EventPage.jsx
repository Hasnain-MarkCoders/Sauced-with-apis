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
} from 'react-native';
import React, { useEffect, useState } from 'react';
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

const EventPage = () => {
  const route = useRoute();
  const event = route?.params?.event
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isKeyBoard, setIsKeyBoard] = useState(false);
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const navigation = useNavigation();
  const [eventDistance, setEventDistance] = useState(null)
  const [eventCoords, setEventsCoords] = useState(null)
  const [currentCoords, setCurrentCoords] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);
  const axiosInstance = useAxios()
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


  useEffect(() => {
    const fakeFetch = async () => {
      setTimeout(() => {
        setInitialLoading(false);

      }, 1000)
    };
    fakeFetch();
  }, []);

  useEffect(() => {

    const checkLocationServiceAndNavigate = () => {
      setLoading(true); // Start loading indicator
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      check(permission).then(result => {
        if (result === RESULTS.GRANTED) {
          fetchCurrentLocation();
        } else if (result === RESULTS.DENIED) {
          request(permission).then(result => {
            if (result === RESULTS.GRANTED) {
              fetchCurrentLocation();
            } else {
              Alert.alert("Location Permission Required", "Please grant location permission to use this feature.");
              setLoading(false); // Stop loading indicator
            }
          });
        } else {
          setLoading(false); // Stop loading indicator
          Alert.alert("Location Permission", "Location permission is not available or blocked. Please enable it in settings.");
        }
      }).catch(error => {
        console.warn("Error checking location permission:", error);
        Alert.alert("Error", "An error occurred while checking location permission. Please try again.");
        setLoading(false); // Stop loading indicator
      });
    };

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
            if (elements.length > 0 && elements[0].status !== "NOT_FOUND") {
              const distanceInMeters = elements[0].distance.value;
              setEventDistance(distanceInMeters)
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
          Alert.alert("Location Service Error", "Could not fetch current location. Please ensure your location services are enabled and try again.");
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert('Invalid Coordinates', 'Latitude and longitude must be valid numbers.');
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
      { isFullScreenMap &&<TouchableOpacity style={{
        position: 'absolute',
        top:10,
        left:10,
        zIndex:1000
      }} onPress={toggleFullScreenMap}
      
      >
       <Image style={{ width: scale(30), height: scale(20), objectFit:"contain" }} source={darkArrow}/>
      </TouchableOpacity>}
      { isFullScreenMap&& <View
                      style={{
                       flex:1,
                       width:"100%"
                      }}>
                      <MapView
                        style={{ width: "100%", height: "100%"}}
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


{routeCoordinates.length > 0 && (
          <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#4285F4" // Google Maps-like blue color
          lineCap="round" // Smooth line ends
        />
          )}
                      </MapView>

                    </View>}
   {! isFullScreenMap &&<ImageBackground
      style={{ flex: 1, width: '100%', height: '100%' }}
      source={getStartedbackground}>
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
                              ellipsizeMode='tail'
                              numberOfLines={1}
                              style={{
                                maxWidth: scale(200),
                                fontSize: scale(25),
                                fontWeight: 800,
                                lineHeight: scale(33),
                                color: 'white',
                              }}>
                              {event?.eventName}
                            </Text>
                          }
                          <TouchableOpacity
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
                              Interested
                            </Text>
                          </TouchableOpacity>
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
                            event?.owner?.name &&
                            <TouchableOpacity onPress={() => {
                              setOpenUserDetailsModal(true)
                            }}>

                              <Text
                                style={{
                                  color: '#FFA100',
                                }}>
                                {event?.owner?.name}
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        gap: scale(25),
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
                            gap: scale(10),
                          }}>
                          <Image
                            style={{
                              width: scale(18),
                              height: scale(23),
                            }}
                            source={Location}
                          />
                          <View
                            style={{
                              gap: scale(6),
                            }}>
                            <Text
                              ellipsizeMode='tail'
                              style={{
                                // maxWidth: scale(100),
                                fontSize: scale(16),
                                lineHeight: scale(22),
                                color: '#FFA100',
                              }}>
                              {event?.venueName?.charAt(0).toUpperCase() + event?.venueName?.slice(1).toLowerCase()}
                            </Text>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: scale(11),
                                lineHeight: scale(14),
                                flexShrink: 1

                              }}>
                              {event?.venueDescription}
                            </Text>
                          </View>
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

                    <ProductsBulletsList
                      data={event?.eventDetails}
                      textStyles={{
                        fontWeight: 700,
                        color: 'white',
                      }}
                    />
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
                        {eventDistance} m distance from your home
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
      <UserDetailsModal
        name={event?.owner?.name}
        email={event?.owner?.email}
        profilePicture={event?.owner?.image}
        number={"+1 234-567-0890"}
        modalVisible={openUserDetailsModal}
        setModalVisible={setOpenUserDetailsModal}
      />
    </ImageBackground>}
    </View>


  );
};

export default EventPage;
