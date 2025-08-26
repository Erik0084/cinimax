import React, { useRef, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = screenWidth * 0.9; // 80% of screen width
const ITEM_MARGIN = 5; // Margin between items
const SIDE_ITEM_OFFSET = (screenWidth - ITEM_WIDTH) / 2 - ITEM_MARGIN;

const Slider = ({ series }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / ITEM_WIDTH);
    setActiveIndex(newIndex);
  };

  return (
    <View className=" mb-4 relative">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 2}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: SIDE_ITEM_OFFSET,
        }}
      >
        {series.map((movie, index) => (
          <View
            key={index}
            style={{
              width: ITEM_WIDTH,
              marginHorizontal: ITEM_MARGIN,
              height: "auto",
              aspectRatio: "4/2.3",
            }}
          >
            <View className="bg-gray-800 relative rounded-[10px] overflow-hidden">
              <View className="relative">
                <Image
                  source={{ uri: movie?.images?.poster }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination indicators */}
      <View
        className="flex-row justify-center mt-4 absolute bottom-4 left-[50%]"
        style={{ transform: "translateX(-50%)" }}
      >
        {series.map((_, index) => (
          <View
            key={index}
            className={`w-[4px] h-[4px] rounded-full mx-1 ${
              index === activeIndex
                ? "bg-blue_accent !w-8"
                : "bg-blue_accent opacity-[.4]"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default Slider;
