import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import EpisodeList from '../../components/EpisodeCard';
import { Icons } from '../../constants/icons';


const SeriesDetail = () => {
    return (
        <ScrollView className="flex-1 bg-black">
            {/* Background Image and Overlay */}
            <View className="relative w-full h-[74vh]">
                <View className="w-full h-full relative">
                    <ImageBackground
                        source={{ uri: 'https://i.pinimg.com/736x/43/4c/4a/434c4a4819c0c21d3c3895530e90d19a.jpg' }} // Placeholder image for Riverdale
                        className="w-full h-full absolute top-0 left-0 right-0"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black opacity-70" />
                </View>
                <View className="absolute bottom-0 left-0 right-0 top-0 mt-12 items-center  justify-center">
                    <Image source={{ uri: 'https://i.pinimg.com/736x/c3/f1/06/c3f1068e18413f10bae29d50ee10b8af.jpg' }} className="w-[220px] h-auto rounded-xl" style={{ aspectRatio: "2/3" }} />
                    <View className="flex items-center mb-2">
                        {/* <Text className="text-white text-h1 font-bold mb-2">RIVERDALE</Text> */}
                        <View className="flex-row items-center mb-2 mt-4">
                            <Image source={Icons.calendar} className="w-4 h-4 mr-[5px]" tintColor="#92929D" />
                            <Text className="text-grey text-h5 mr-4">2021</Text>
                            <Image source={Icons.clock} className="w-4 h-4 mr-[5px]" tintColor="#92929D" />
                            <Text className="text-grey text-h5 mr-4">148 Minutes</Text>
                            <Image source={Icons.film} className="w-4 h-4 mr-[5px]" tintColor="#92929D" />
                            <Text className="text-grey text-h5 mr-4">Action</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Image source={Icons.star} className="w-4 h-4 mr-1" tintColor="#FF8700" />
                            <Text className="text-orange text-h5 mr-4">4.5</Text>
                        </View>

                        <View className="flex-row justify-around items-center mt-6 px-4">
                            <TouchableOpacity className="flex-row items-center bg-blue_accent px-8 py-3 rounded-full flex mr-2 justify-center">
                                <Image source={Icons.film} className="w-5 h-5 mr-2" tintColor="#fff" />
                                <Text className="text-white text-h4 font-bold">Trailer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-soft p-[12px] rounded-full mx-2">
                                <Image source={Icons.download} className="w-6 h-6" tintColor="#12CDD9" />
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-soft p-4 rounded-full ml-2">
                                <Image source={Icons.share41} className="w-5 h-5" tintColor="#12CDD9" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Story Line */}
            <View className="mt-6 px-6">
                <Text className="text-white text-h3 font-bold mb-2">Story Line</Text>
                <Text className="text-grey text-h5 leading-6" numberOfLines={4}>
                    Originally a story from Archie Comics which started in 1941, Riverdale centres around a
                    group of high school students who are shocked by the death of classmate, Jason
                    Blossom. Together theyunravel the secrets of Riverdale and who <Text className="text-primary">More</Text>
                </Text>
            </View>
            <View className="mt-6 px-6 mb-20">
                <EpisodeList />
            </View>
        </ScrollView>
    );
};

export default SeriesDetail;