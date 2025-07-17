import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';

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
            imageUrl: 'https://i.ytimg.com/vi/6yMctKlqf4g/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDt8uQQA345m_uNmVvXZtjzO7TqRQ',
        },
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.ytimg.com/vi/6yMctKlqf4g/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDt8uQQA345m_uNmVvXZtjzO7TqRQ',
        },
        {
            title: 'Black Panther: Wakanda Forever',
            releaseDate: 'March 2, 2022',
            imageUrl: 'https://i.ytimg.com/vi/6yMctKlqf4g/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDt8uQQA345m_uNmVvXZtjzO7TqRQ',
        },
    ];

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffset / ITEM_WIDTH);
        setActiveIndex(newIndex);
    };

    return (
        <View className="my-8 mb-4">
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
                            aspectRatio: "4/2.5",
                        }}
                    >   
                        <View className="bg-gray-800 relative rounded-[26px] overflow-hidden">
                            <View className='relative'>
                                <Image
                                    source={{ uri: movie.imageUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(16, 16, 17, 0.2)', 'rgba(16, 16, 17, 0.6)']}
                                    className="absolute top-0 bottom-0 left-0 right-0 h-[100%]"
                                />
                            </View>
                            <View className="px-6 py-6 absolute bottom-0 flex justify-end left-0 right-0 top-0">
                                <Text className="text-white text-h2 font-bold">{movie.title}</Text>
                                <Text className="text-h5 text-white mt-1">Released on {movie.releaseDate}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination indicators */}
            <View className="flex-row justify-center mt-4">
                {movies.map((_, index) => (
                    <View
                        key={index}
                        className={`w-[9px] h-[9px] rounded-full mx-1 ${index === activeIndex ? 'bg-blue_accent !w-8' : 'bg-blue_accent opacity-[.4]'}`}
                    />
                ))}
            </View>
        </View>
    );
};

export default MovieCarousel;