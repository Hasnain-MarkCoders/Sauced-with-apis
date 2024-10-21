import {  FlatList, StyleSheet, Text, View } from "react-native";
import { welcomeLists } from "../../../utils";
import { scale } from "react-native-size-matters";
import ProductBulletPoint from "../ProductBulletPoint/ProductBulletPoint";
import NotFound from "../NotFound/NotFound";

const renderItem = ({ item, textStyles, bulletStyle }) =>
    (<ProductBulletPoint text={item} textStyles={textStyles} bulletStyle={bulletStyle} />)
  ;
const ProductsBulletsList = ({
  data=[],
  textStyles={},
  bulletStyle={},
  bulletGap={}


}) => {
    return (
      <View style={{
        paddingRight:scale(20)
      }}>
        {data.length>0
        ?
        <FlatList
        contentContainerStyle={{
        }}
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={(props)=>renderItem({...props, textStyles, bulletStyle})}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={[styles.separator, {...bulletGap}]} />}
      />
      :
      // <NotFound
      // title="No Chili papers available"
      // />
      <Text style={
        {color: 'white',
        fontSize: scale(13),
        fontWeight: 400,
        lineHeight: 20,}
      }>
        N/A
      </Text>
      }
    
      </View>
    );
  };

  const styles = StyleSheet.create({
    separator: {
      height: scale(20),
      
    }
  })


  export default ProductsBulletsList