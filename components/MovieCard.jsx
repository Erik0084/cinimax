// components/MovieCard.js
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({ id, title, genre, imageUrl, series }) => {
    return (
        <Link className="" href={series ? `/series/${id}` : `/movies/${id}`} asChild>
            <TouchableOpacity className=' mr-2' activeOpacity={0.9}>
                <View className="bg-soft w-full rounded-md overflow-hidden relative">
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-36 h-auto"
                        resizeMode="cover"
                        style={{ aspectRatio: 2 / 2.4 }}
                    />
                    <Text className="text-white text-[9px] bg-blue_accent mt-1 w-[40px] text-center rounded-sm absolute top-1 right-2">Urdu</Text>
                    <View className="p-[8px] pb-[8px]">
                        <Text className="text-white text-[11px] font-semibold" numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className="text-gray-400 text-[9px] mt-1">{genre}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;