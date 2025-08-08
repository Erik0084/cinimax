import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../constants/icons';
import SeasonSelectionModal from './SeasonSelectionModal';

const EpisodeCard = ({ episodeNumber, duration, description, isPremium = false }) => {
    return (
        <View className="bg-soft rounded-xl p-3 mb-4">
            <View className="flex-row items-center mb-3">
                <View className="relative w-36 h-24 rounded-lg overflow-hidden mr-4">
                    <Image
                        source={{ uri: 'https://i.pinimg.com/736x/b0/41/bc/b041bc4d2e2e3c425cae4eb5c3f27a10.jpg' }} // Placeholder image
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <TouchableOpacity className="absolute inset-0 items-center justify-center bg-black/30">
                        <Image source={Icons.PlayButton} className="w-10 h-10" tintColor="#fff" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 flex-row  items-center py-2"> 
                    <View className="flex-1">
                        {isPremium && (
                            <View className="bg-orange px-2 py-1 rounded-md self-start mb-1">
                                <Text className="text-white text-h6 font-semibold">Premium</Text>
                            </View>
                        )}
                        <Text className="text-grey text-h6">{duration}</Text>
                        <Text className="text-white text-h4 font-bold">Episode {episodeNumber}</Text>
                    </View>
                    <TouchableOpacity className="p-2 rounded-full bg-black">
                        <Image source={Icons.download} className="w-6 h-6" tintColor="#FF8700" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text className="text-grey text-h5 leading-6 text-justify" numberOfLines={2}>
                {description}
            </Text>
        </View>
    );
};

const EpisodeList = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('Season 2');

    const handleSeasonSelect = (season) => {
        setSelectedSeason(season);
        setModalVisible(false);
    };

    return (
        <View className="">
            {/* <Text className="text-white text-h3 font-semibold mb-4">Episode</Text> */}
            <TouchableOpacity
                className="flex-row items-center mb-6"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-white text-h4 font-semibold mr-2">{selectedSeason}</Text>
                <Image source={Icons.arrowIosDownward} className="w-4 h-4" tintColor="#fff" />
            </TouchableOpacity>

            <EpisodeCard
                episodeNumber={1}
                duration="1h30m"
                description="Football player who longs to write his own music. It's not all smiles for this hunk though after he gets involved with his music teacher."
                isPremium={true}
            />

            <EpisodeCard
                episodeNumber={2}
                duration="1h30m"
                description="Football player who longs to write his own music. It's not all smiles for this hunk though after he gets involved with his music teacher."
                isPremium={true}
            />

            {isModalVisible && (
                <SeasonSelectionModal
                    onClose={() => setModalVisible(false)}
                    onSelectSeason={handleSeasonSelect}
                    currentSeason={selectedSeason}
                />
            )}
        </View>
    );
};

export default EpisodeList;