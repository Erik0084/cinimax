import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '@/constants/icons';

const MovieCardFull = ({ title, date, genre, imageUrl }) => {
    return (
        <View className="">
            <View className="relative w-full h-52">
                <Image
                    source={{ uri: imageUrl || 'https://i.pinimg.com/736x/65/5e/e0/655ee0b8e348b99696ef44605bbaddce.jpg' }} // Placeholder image
                    className="w-full h-full absolute  rounded-xl overflow-hidden"
                    resizeMode="cover"
                />
                <TouchableOpacity className="absolute inset-0 items-center justify-center bg-black/30">
                    <Image source={Icons.play} className="w-12 h-12" tintColor="#fff" />
                </TouchableOpacity>
                <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md">
                    <Text className="text-white text-xs font-bold">IMAX</Text>
                </View>
            </View>
            <View className="p-4 px-0">
                <Text className="text-white text-h4 font-bold mb-2">{title || "Selahaddin Eyyubi - Season II"}</Text>
                <View className="flex-row items-center">
                    <Image source={Icons.calendar} className="w-[14px] h-auto aspect-square mr-1" tintColor="#9CA3AF" />
                    <Text className="text-gray-400 text-h6 mr-4">{date || "July 2, 2025"}</Text>
                    <Image source={Icons.film} className="w-[14px] h-auto aspect-square mr-1" tintColor="#9CA3AF" />
                    <Text className="text-gray-400 text-h6">{genre || "Historical"}</Text>
                </View>
            </View>
        </View>
    );
};

export default MovieCardFull;