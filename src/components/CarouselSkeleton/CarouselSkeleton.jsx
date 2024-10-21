import React from 'react'
import { View } from 'react-native'
import { scale } from 'react-native-size-matters'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const CarouselSkeleton = () => {
  return (
    <SkeletonPlaceholder speed={1600} backgroundColor='#2E210A' style={{height:"100%"}} highlightColor={"#fff"} borderRadius={4}>
                
    <View style={{
        gap:scale(10)
    }}>
            <View style={{width:"70%", height: scale(20) }}>
            </View>
    <View style={{width:"90%", height: scale(20) }}>
    </View>
    <View style={{ width:"80%", height: scale(20) }}>
    </View>
    <View style={{width:"50%", height: scale(20) }}>
    </View>
    </View>
</SkeletonPlaceholder> 
  )
}

export default CarouselSkeleton