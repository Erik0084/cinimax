import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../../constants/icons';

const WishlistScreen = () => {
    const [wishlist, setWishlist] = React.useState([
        {
            id: '1',
            title: 'Spider-Man No Way Home',
            type: 'Movie',
            rating: 4.5,
            category: 'Action',
            poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
        },
        {
            id: '2',
            title: 'Spider-Man No Way Home',
            type: 'Movie',
            rating: 4.5,
            category: 'Action',
            poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
        },
        {
            id: '3',
            title: 'Spider-Man No Way Home',
            type: 'Movie',
            rating: 4.5,
            category: 'Action',
            poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
        },
    ]);

    const isEmpty = wishlist.length === 0;

    return (
        <View className="flex-1 bg-dark px-4 pt-12">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white text-2xl font-bold">Wishlist</Text>
                <TouchableOpacity>
                    <Image source={Icons.search} className="w-6 h-6 tint-white" />
                </TouchableOpacity>
            </View>

            {isEmpty ? (
                // Empty State
                <View className="flex-1 items-center justify-center">
                    <Image
                        source={Icons.noResults1}
                        className="w-40 h-40 mb-6"
                        resizeMode="contain"
                    />
                    <Text className="text-white text-xl font-bold mb-2">
                        There Is No Movie Yet!
                    </Text>
                    <Text className="text-grey text-center">
                        Find your movie by Type title,
                    </Text>
                    <Text className="text-grey text-center mb-8">
                        categories, years, etc
                    </Text>
                    <TouchableOpacity
                        className="bg-blue_accent py-3 px-6 rounded-full"
                        onPress={() => router.push('/browse')}
                    >
                        <Text className="text-white font-bold">Browse Movies</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Wishlist Items
                <FlatList
                    data={wishlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row bg-soft rounded-xl p-3 mb-3"
                            onPress={() => router.push(`/movie/${item.id}`)}
                        >
                            <Image
                                source={item.poster}
                                className="w-16 h-24 rounded-lg mr-4"
                            />
                            <View className="flex-1 justify-center">
                                <Text className="text-grey text-sm mb-1">{item.category}</Text>
                                <Text className="text-white text-lg font-semibold">
                                    {item.title.split(' ').slice(0, 2).join(' ')}
                                </Text>
                                <Text className="text-white text-lg font-semibold">
                                    {item.title.split(' ').slice(2).join(' ')}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-grey text-sm mr-2">{item.type}</Text>
                                    <Image source={Icons.heart} className="w-4 h-4 mr-1" />
                                    <Text className="text-yellow-400 text-sm">{item.rating}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => {
                                    setWishlist(wishlist.filter(movie => movie.id !== item.id));
                                }}
                            >
                                <Image source={Icons.heart} className="w-5 h-5 tint-grey" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default WishlistScreen;