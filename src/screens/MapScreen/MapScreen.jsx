import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, StyleSheet, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import darkArrow from "./../../../assets/images/darkArrow.png";
import storeIcon from "./../../../assets/images/store.png";
import locationIcon from "./../../../assets/images/location.png";


import useAxios from '../../../Axios/useAxios';// Make sure to import your axios instance
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const axiosInstance = useAxios()
  const navigation = useNavigation();
  const route = useRoute();
  const lng = route?.params?.lng;
  const lat = route?.params?.lat;
  const handleEventCoords = route?.params?.fn;

  const [region, setRegion] = useState({
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markerSize, setMarkerSize] = useState(30);
  const [stores, setStores] = useState([]);





  const handleRegionChange = (newRegion) => {
    // setRegion(newRegion);

    // Adjust marker size based on latitudeDelta (this determines zoom level)
    const zoomFactor = newRegion.latitudeDelta;
    let size = 30; // Default marker size

    // Adjust size dynamically based on zoom level
    if (zoomFactor < 0.02) {
      size = 70; // Zoomed in
    } else if (zoomFactor < 0.05) {
      size = 65; // Moderately zoomed in
    } else if (zoomFactor < 0.1) {
      size = 60; // Default size
    } else {
      size = 55; // Zoomed out
    }

    setMarkerSize(size);
  };

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

    fetchStores();
  }, []);

  const handleMarkerPress = (store) => {
    Alert.alert(
      store.storeName,
      `Posted by: ${store.postedBy.name}\nEmail: ${store.postedBy.email}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={darkArrow}
        />
      </TouchableOpacity> */}

      <GooglePlacesAutocomplete
        placeholder='Search for places'
        fetchDetails={true}
        onPress={(data, details = null) => {
          setRegion({
            latitude: details.geometry.location?.lat,
            longitude: details.geometry.location?.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

          handleEventCoords({
            latitude: details.geometry.location?.lat,
            longitude: details.geometry.location?.lng,
            destination: data?.description,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });

          Toast.show({
            type: 'success',
            text1: 'Location selcted',
            text2: 'Please go backt to continue.'}
          )
        }}
        query={{
          key: 'AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY', // Replace this with your actual API key
          language: 'en',
        }}
        styles={{
          textInput: {
            backgroundColor: '#FFFFFF',
            height: scale(50),
            borderRadius: scale(50),
            fontSize: 15,
            paddingLeft:scale(20)
          },
          container: {
            position: 'absolute',
            width: '95%',
            top: scale(18),
            left: width * 0.025,
            zIndex: 1,
          }
        }}
      />

      <MapView
        style={styles.map}
        region={region}
        followsUserLocation={true}
        onRegionChangeComplete={handleRegionChange}
      >
        {!!region && <Marker
         coordinate={region}><View style={styles.marker}>
                  <Image
                       source={locationIcon}
                       style={[styles.markerImage, { width: scale(markerSize), height: scale(markerSize) }]}
                  />
                  {/* <Text>{store.storeName}</Text> */}
                </View></Marker>}

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
                    // source={{ uri: "https://w7.pngwing.com/pngs/113/388/png-transparent-store-shop-market-shopping-ecommerce-buy-3d-icon.png" }}
                       source={storeIcon}
                    style={[styles.markerImage, { width: markerSize, height: markerSize }]}
                  />
                  {/* <Text>{store.storeName}</Text> */}
                </View>
              </Marker>
            );
          }

          return null;
        })}
      </MapView>
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
    top: scale(20),
    left: scale(15),
  },
  map: {
    flex: 1,
  },
  marker: {
    alignItems: 'center',
    width:scale(100),
    height:scale(150),

  },
  markerImage: {
    width:"100%",
    height:"100%",
    resizeMode:"contain"
    // borderRadius: 15,
  }
});

export default MapScreen;
