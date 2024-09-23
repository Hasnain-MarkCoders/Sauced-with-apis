import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, StyleSheet, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import darkArrow from "./../../../assets/images/darkArrow.png";
import yellowChilli from "./../../../assets/images/yellow-chilli.png";
import redChilli from "./../../../assets/images/red-chilli.png";

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
  }, [selectedRegion]);


  const handleMarkerPress = (store) => {
    Alert.alert(
      store.storeName,
      `Posted by: ${store.postedBy.name}\nEmail: ${store.postedBy.email}`,
      [{ text: 'OK' }]
    );
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
        position:"relative"
      }}>
        <View style={{
          position:"absolute",
          top:0,
          zIndex:3,
          top:scale(66),
          left:scale(83)
        }}>

        <Search   color={"gray"} size={23}/>
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
            latitudeDelta: .005,
            longitudeDelta: .005,
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
            // placeholderTextColor is not a valid style property here
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
      ref={mapRef}
        onPress={async (e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          try {
            const geocodeResponse = await Geocoder.from(latitude, longitude);
            console.log("geocodeResponse===================================>", geocodeResponse)
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
              latitudeDelta: .005,
              longitudeDelta: .005,
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
        // onRegionChangeComplete={handleRegionChange}
      >
        {!!region && (
          <Marker 
          
          onPress={(e) =>{console.log(e)}}
          coordinate={region}>
            <View style={styles.marker}>
              <Image
                source={yellowChilli}
                style={[styles.markerImage, { width: scale(markerSize), height: scale(markerSize) }]}
              />
            </View>
          </Marker>
        )}
  {/* {places.map((place) => (
    <Marker
      key={place.id}
      coordinate={{ latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }}
      title={place.name}
      onPress={() => handleMarkerPress(place)}
    />
  ))} */}
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
                // onPress={() => handleMarkerPress(store)}
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
    resizeMode: "contain"
    // borderRadius: 15,
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
