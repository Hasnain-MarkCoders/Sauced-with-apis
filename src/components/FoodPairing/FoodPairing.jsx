import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

const flavors = [
  "Smoky", "Peppery", "Tangy", "Citrusy", "Garlicky", "Herbal", "Spicy", "Fiery", 
  "Bold", "Sweet", "Sour", "Zesty", "Savory", "Robust", "Earthy", "Acidic", 
  "Fruity", "Mild", "Mellow", "Medium", "Scorching", "Tomatoey", "Vinegary", 
  "Onion", "Umami", "Soy", "Sesame", "Chemical", "Capsaicin"
];

const { width } = Dimensions.get('window');

const SelectableChips = ({setData}) => {
  const [selectedFlavors, setSelectedFlavors] = useState([]);

  const handleChipPress = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(item => item !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };


  useEffect(()=>{
    setData(prev=>({...prev, ["foodPairings"]:selectedFlavors}))
  },[selectedFlavors])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        selectedFlavors.includes(item) && styles.chipSelected
      ]}
      onPress={() => handleChipPress(item)}
    >
      <Text style={[
        styles.chipText,
        selectedFlavors.includes(item) && styles.chipTextSelected
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={flavors}
       
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={4} // Three chips per row
        contentContainerStyle={styles.flatListContent}
      /> */}
      {flavors.map(item=>{
        return <TouchableOpacity
         style={[
           styles.chip,
           selectedFlavors.includes(item) && styles.chipSelected
         ]}
         onPress={() => handleChipPress(item)}
       >
         <Text style={[
           styles.chipText,
           selectedFlavors.includes(item) && styles.chipTextSelected
         ]}>
           {item}
         </Text>
       </TouchableOpacity>
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"row",
    flexWrap:"wrap",
    gap:scale(7)
  },
  flatListContent: {
    justifyContent: 'space-between',
    gap:scale(10)
  },
  chip: {
    backgroundColor: '#2e210a', // Dark box for unselected chips
    borderRadius: scale(20),
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderColor: '#FFA500', // Orange border for chips to match the theme
    borderWidth: scale(1),
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#FFA500', // Orange background when selected
  },
  chipText: {
    color: '#FFFFFF', // Light text color for unselected chips
  },
  chipTextSelected: {
    color: '#000000', // Dark text color for selected chips
  },
});

export default SelectableChips;
