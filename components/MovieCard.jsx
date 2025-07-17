// components/MovieCard.js
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({ id, title, genre, imageUrl }) => {
    return (
        <Link className="" href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-36 mr-4' activeOpacity={0.9}>
                <View className="bg-gray-800 w-full rounded-[12px] overflow-hidden">
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-40 rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="p-[8px] pb-[8px]">
                        <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className="text-gray-400 text-[12px] mt-1">{genre}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;