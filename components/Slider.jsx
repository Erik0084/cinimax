import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * .9; // 80% of screen width
const ITEM_MARGIN = 5; // Margin between items
const SIDE_ITEM_OFFSET = (screenWidth - ITEM_WIDTH) / 2 - ITEM_MARGIN;

const MovieCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const movies = [
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.pinimg.com/1200x/39/bc/a2/39bca2a19655ae6818d9922781458307.jpg',

        },
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.pinimg.com/736x/1e/7d/b5/1e7db554c2d36849839ffc51d6e0dd4c.jpg',

        },
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.pinimg.com/736x/a9/36/61/a936615fad26c5fce5eadccb7457d827.jpg',
        },
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.pinimg.com/736x/99/46/b0/9946b07d3d237eaef29906ca7054856c.jpg',
        },
    ];

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
                {movies.map((movie, index) => (
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
                            <View className='relative'>
                                <Image
                                    source={{ uri: movie.imageUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                {/* <LinearGradient
                                    colors={['transparent', 'rgba(16, 16, 17, 0.2)', 'rgba(16, 16, 17, 0.6)']}
                                    className="absolute top-0 bottom-0 left-0 right-0 h-[100%]"
                                /> */}
                            </View>
                            {/* <View className="px-6 py-6 absolute bottom-0 flex justify-end left-0 right-0 top-0">
                                <Text className="text-white text-h2 font-bold">{movie.title}</Text>
                                <Text className="text-h5 text-white mt-1">Released on {movie.releaseDate}</Text>
                            </View> */}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination indicators */}
            <View className="flex-row justify-center mt-4 absolute bottom-4 left-[50%]" style={{ transform: "translateX(-50%)" }}>
                {movies.map((_, index) => (
                    <View
                        key={index}
                        className={`w-[4px] h-[4px] rounded-full mx-1 ${index === activeIndex ? 'bg-blue_accent !w-8' : 'bg-blue_accent opacity-[.4]'}`}
                    />
                ))}
            </View>
        </View>
    );
};

export default MovieCarousel;