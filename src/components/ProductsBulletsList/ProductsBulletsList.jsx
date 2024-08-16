import {  FlatList, StyleSheet, View } from "react-native";
import { welcomeLists } from "../../../utils";
import { scale } from "react-native-size-matters";
import ProductBulletPoint from "../ProductBulletPoint/ProductBulletPoint";

const renderItem = ({ item, textStyles, bulletStyle }) =>
    (<ProductBulletPoint text={item} textStyles={textStyles} bulletStyle={bulletStyle} />)
  ;
const ProductsBulletsList = ({
  data=[],
  textStyles={},
  bulletStyle={},


}) => {
    return (
      <View style={{
        paddingRight:scale(20)
      }}>
        <FlatList
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={(props)=>renderItem({...props, textStyles, bulletStyle})}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    separator: {
      height: scale(20),
    }
  })


  export default ProductsBulletsList