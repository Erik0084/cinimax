import { Image, Text, TouchableOpacity, View } from 'react-native';
// import { icons } from '../../constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import arrowback from '../../assets/icons/arrow-back.png';
import heart from '../../assets/icons/heart.png';

const Details = () => {
    return (
        <View className="flex justify-start min-h-full px-6 pt-10 pb-32 bg-dark h-full">
            {/* Movie Header */}
            <View className="flex-row w-full items-center justify-between px-4 py-4 bg-transparent">
                <TouchableOpacity className="p-2">
                    <Image source={arrowback} width={24} height={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-h3 font-bold mx-2 flex-1 text-center" numberOfLines={1}>
                    Spider-Man: No Way Home
                </Text>
                <TouchableOpacity className="p-2">
                    <Image source={heart} width={24} height={24} color="" className="" />
                </TouchableOpacity>
            </View>
            {/* Movie Poster */}
            <View className="relative">
                <View className="relative h-[200px]">
                    <Image
                        source={{ uri: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' }}
                        className="w-full h-auto"
                        resizeMode="cover"
                        style={{ aspectRatio: 2 / 3 }}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                        className="absolute bottom-0 left-0 right-0 to-inherit h-1/2"
                    />
                </View>

                {/* Movie Title and Details */}
                <View className="">
                    <Text className="text-white text-4xl font-bold tracking-wider">SPIDER-MAN</Text>
                    <Text className="text-white text-3xl font-bold mt-1">No Way Home</Text>

                    <View className="flex-row items-center mt-3">
                        <Text className="text-gray-300">2021</Text>
                        <View className="w-1 h-1 bg-gray-400 mx-2 rounded-full" />
                        <Text className="text-gray-300">148 Minutes</Text>
                        <View className="w-1 h-1 bg-gray-400 mx-2 rounded-full" />
                        <Text className="text-gray-300">Action</Text>
                    </View>
                </View>

                {/* Play Button */}
                <TouchableOpacity className="absolute bottom-6 left-0 right-0 items-center">
                    <View className="flex-row items-center bg-red-600 px-8 py-3 rounded-full">
                        <Text className="text-white text-lg font-bold ml-2">Play</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Details;
