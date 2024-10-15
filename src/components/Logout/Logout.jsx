import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
// import { handleAuth } from '../../../android/app/Redux/userReducer';
import logoutIcon from './../../../assets/images/logout.png';
import { handleAuth } from '../../Redux/userReducer';


const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(
      handleAuth({
        "token": null,
        "uid": null,
        "name": null,
        "email": null,
        "provider": null,
        "type": null,
        "status": null,
        "_id": null,
        "url":null,
        "authenticated": false,
        "welcome":false,
      })
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.container}>
      <Image style={styles.image} source={logoutIcon} />
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    gap:10,
    alignItems:"center",
  },
  image: {
    width: 30,
    height: 30,
    aspectRatio:"1/1",
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    color: 'white',
    marginLeft: 8, // Adjust spacing between image and text if needed
  },
});

export default Logout;
