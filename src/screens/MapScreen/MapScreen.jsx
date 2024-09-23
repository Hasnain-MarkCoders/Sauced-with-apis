import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, StyleSheet, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import darkArrow from "./../../../assets/images/darkArrow.png";
import yellowChilli from "./../../../assets/images/yellow-chilli.png";
import redChilli from "./../../../assets/images/red-chilli.png";

import restaurant from "./../../../assets/images/restaurant.png";
import shopping from "./../../../assets/images/shopping.png";
import bar from "./../../../assets/images/bar.png";
import gym from "./../../../assets/images/gym.png";
import bank from "./../../../assets/images/bank.png";
import park from "./../../../assets/images/park.png";
import school from "./../../../assets/images/school.png";
import hospital from "./../../../assets/images/hospital.png";
import interest from "./../../../assets/images/interest.png";
import establishment from "./../../../assets/images/establishment.png";
import defaultMarker from "./../../../assets/images/defaultMarker.png";



import Geocoder from 'react-native-geocoding';

// Initialize the Geocoder with your API key (for example, Google API)

import useAxios from '../../../Axios/useAxios'; // Make sure to import your axios instance
import Toast from 'react-native-toast-message';
import { Search } from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const route = useRoute();
  const lng = route?.params?.lng;
  const lat = route?.params?.lat;
  const handleEventCoords = route?.params?.fn;
  // const [places, setPlaces] = useState([])
  const [isContinue, setIsContinue] = useState(false);

  const [region, setRegion] = useState({
    latitude: lat,
    longitude: lng,
    latitudeDelta: .005,
    longitudeDelta: .005,
  });

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [markerSize, setMarkerSize] = useState(60);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [stores, setStores] = useState([]);
  const mapRef = useRef()
  useEffect(() => {
    // Fetch stores data
    const fetchStores = async () => {
      try {
        const res = await axiosInstance.get('/get-stores');
        const validStores = res.data.stores.filter((store) => {
          const latitude = parseFloat(store.storeLocation.latitude);
          const longitude = parseFloat(store.storeLocation.longitude);
          // Check if both latitude and longitude are valid numbers
          return !isNaN(latitude) && !isNaN(longitude);
        });
        setStores(validStores);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    Geocoder.init('AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E'); // replace with your actual API key
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedRegion && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedRegion.latitude,
        longitude: selectedRegion.longitude,
        latitudeDelta: .005,
        longitudeDelta: .005,
      }, 1000); // 1000ms animation duration
    }
    fetchNearbyPlaces(selectedRegion)
  }, [selectedRegion]);


  const getRadiusFromDelta = (latitudeDelta) => {
    return Math.round(latitudeDelta * 100000); // Adjust multiplier for different radius
  };
  const handleMarkerPress = (store) => {
    Alert.alert(
      store.storeName,
      `Posted by: ${store.postedBy.name}\nEmail: ${store.postedBy.email}`,
      [{ text: 'OK' }]
    );
  };

  const handleNearByMarkerPress = (place) => {
    Alert.alert(
      place.name,
      place.vicinity || 'No address available',
      [{ text: 'OK' }]
    );
  };

  // const fetchNearbyPlaces = async () => {
  //   try {
  //     const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
  //       params: {
  //         location: `${lat},${lng}`,
  //         radius: 1000,
  //         key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace with your API key
  //       }
  //     });
  //     setNearbyPlaces(response.data.results);
  //   } catch (error) {
  //     console.error('Error fetching nearby places:', error);
  //   }
  // };

  const fetchNearbyPlaces = async (region) => {
    try {
      const radius = getRadiusFromDelta(region.latitudeDelta);
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${region.latitude},${region.longitude}`,
          radius: radius,
          key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace with your API key
        },
      });
      setNearbyPlaces(response.data.results);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const handleContinuePress = () => {
    Toast.show({
      type: 'success',
      text1: 'Continue Pressed',
      text2: 'You pressed the Continue button.',
    });
  };

  // useEffect(() => {
  //   const fetchPlaces = async () => {

  //     try{
  //       const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${yourLng}&radius=1000&key=AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E`);
  //       // setPlaces(data.results);  // Assuming you have a state to hold places
  //       console.log("data.results==================================================================>", response)
  //     }catch(err){
  //       console.log(err)
  //     }finally{

  //     }

  //   };

  //   fetchPlaces();
  // }, []);

  const handleRegionChangeComplete = (newRegion) => {
    // Fetch nearby places without updating the displayed region
    fetchNearbyPlaces(newRegion);
  };

  const getMarkerIcon = (types) => {
    // Map of place types to Google Places icons
    const typeToIconMap = {
      restaurant ,
      shopping_mall: shopping,
      bar: bar,
      gym: gym,
      bank: bank,
      park: park,
      school: school,
      hospital: hospital,
      point_of_interest: interest, // Add this line
      establishment: establishment, // Add this line
      default:defaultMarker,
    };

    // Return the icon URL based on the place type
    for (const type of types) {
      if (typeToIconMap[type]) {
        return typeToIconMap[type];
      }
    }
    // Return the default icon if no type matches
    return typeToIconMap.default;
  };






  const CustomMarker = ({ imageSource, size }) => (
    <View style={{
      alignItems: "center",
      padding: scale(8),
      backgroundColor: "white",
      borderRadius: 50,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.17,
      shadowRadius: 3.05,
      elevation: 4


    }}>
      <Image
        source={imageSource}
        style={[{ width: scale(size), height: scale(size) }]}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={darkArrow}
        />
      </TouchableOpacity>

      <View style={{
        position: "relative"
      }}>
        <View style={{
          position: "absolute",
          top: 0,
          zIndex: 3,
          top: scale(66),
          left: scale(83)
        }}>

          <Search color={"gray"} size={23} />
        </View>
        <GooglePlacesAutocomplete
          nearbyPlacesAPI="GooglePlacesSearch"
          placeholder='Search for places'
          fetchDetails={true}

          onPress={(data, details = null) => {

            const postalCode = details?.address_components?.find(component =>
              component.types.includes('postal_code')
            )?.long_name;

            const newSelectedRegion = {
              latitude: details.geometry.location?.lat,
              longitude: details.geometry.location?.lng,
            };

            setSelectedRegion(newSelectedRegion);

            handleEventCoords({
              latitude: details.geometry.location?.lat,
              longitude: details.geometry.location?.lng,
              destination: data?.description,
              // latitudeDelta: .005,
              // longitudeDelta: .005,
              zip: postalCode?.toString()
            });

            Toast.show({
              type: 'success',
              text1: 'Location selected',
              text2: 'Please go Back to continue.'
            });

            setIsContinue(true);
          }}

          query={{
            key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace this with your actual API key
            language: 'en',
          }}
          textInputProps={{
            placeholderTextColor: 'gray',
            returnKeyType: "search"
          }}
          styles={{
            textInput: {
              backgroundColor: '#FFFFFF',
              height: scale(50),
              borderRadius: scale(50),
              fontSize: 15,
              paddingLeft: scale(42),
              color: "gray",
            },
            container: {
              position: 'absolute',
              width: '70%',
              top: scale(50),
              left: width * 0.2,
              zIndex: 1,
            },

            description: {
              color: "gray"
            },
          }}
        />
      </View>


      <MapView
        onRegionChangeComplete={handleRegionChangeComplete}
        ref={mapRef}
        onPress={async (e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          try {
            const geocodeResponse = await Geocoder.from(latitude, longitude);
            const address = geocodeResponse.results[0].formatted_address;
            const postalCode = geocodeResponse.results[0].address_components.find(component =>
              component.types.includes('postal_code')
            )?.long_name;
            const newSelectedRegion = {
              latitude,
              longitude,
            };
            handleEventCoords({
              latitude,
              longitude,
              destination: address,
              // latitudeDelta: .005,
              // longitudeDelta: .005,
              zip: postalCode?.toString()
            });
            setSelectedRegion(newSelectedRegion);

            Toast.show({
              type: 'success',
              text1: 'Location selected',
              text2: 'Please go Back to continue.'
            });
            setIsContinue(true);

          } catch (error) {
            console.error("Error fetching location description:", error);
          }
        }}

        style={styles.map}
        region={region}
        followsUserLocation={true}
      >
        {!!region && (
          <Marker

            onPress={(e) => { console.log(e) }}
            coordinate={region}>
            <View style={styles.marker}>
              <Image
                source={yellowChilli}
                style={[styles.markerImage, { width: scale(markerSize), height: scale(markerSize) }]}
              />
            </View>
          </Marker>
        )}
   
        {!!selectedRegion && (
          <Marker
            coordinate={{
              latitude: selectedRegion.latitude,
              longitude: selectedRegion.longitude,
            }}
          >
            <View style={styles.marker}>
              <Image
                source={redChilli}
                style={[styles.markerImage, { width: scale(markerSize), height: scale(markerSize) }]}
              />
            </View>
          </Marker>
        )}

        {/* Render multiple markers with validation */}
        {stores.map((store) => {
          const latitude = parseFloat(store.storeLocation.latitude);
          const longitude = parseFloat(store.storeLocation.longitude);

          // Validate latitude and longitude before rendering the marker
          if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
              <Marker
                key={store._id}
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                pinColor="orange"
                onPress={() => handleMarkerPress(store)}
              >
                <View style={styles.marker}>
                  <Image
                    source={redChilli}
                    style={[styles.markerImage, { width: markerSize, height: markerSize }]}
                  />
                </View>
              </Marker>
            );
          }

          return null;
        })}
        {nearbyPlaces.map((place) => (



          <Marker
            key={place.id}
         
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            onPress={() => handleNearByMarkerPress(place)}
          >
            <CustomMarker
              imageSource={ getMarkerIcon(place.types) }
              size={12}
            />
          </Marker>
        ))}

      </MapView>

      {isContinue && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backButton: {
    position: 'absolute',
    width: scale(20),
    height: scale(20),
    zIndex: 2,
    top: scale(65),
    left: scale(30),
  },
  map: {
    flex: 1,
  },
  marker: {
    alignItems: 'center',
    width: scale(100),
    height: scale(150),
  },
  markerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 150,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,  // 20px from the bottom
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
