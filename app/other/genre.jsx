import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../../constants/icons';

const genres = [
    { id: '1', name: 'Action', image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Action' },
    { id: '2', name: 'Horror', image: 'https://via.placeholder.com/150/000000/FFFFFF?text=Horror' },
    { id: '3', name: 'Fantasy', image: 'https://via.placeholder.com/150/800080/FFFFFF?text=Fantasy' },
    { id: '4', name: 'Anime', image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Anime' },
    { id: '5', name: 'Romance', image: 'https://via.placeholder.com/150/FFC0CB/000000?text=Romance' },
    { id: '6', name: 'Sci-fi', image: 'https://via.placeholder.com/150/008080/FFFFFF?text=Sci-fi' },
    { id: '7', name: 'Comedy', image: 'https://via.placeholder.com/150/FFFF00/000000?text=Comedy' },
    { id: '8', name: 'Adventures', image: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Adventures' },
];

const GenreScreen = () => {
    const [selectedGenre, setSelectedGenre] = useState('Action');

    const renderGenreItem = ({ item }) => (
        <TouchableOpacity
            className="w-[48%] h-40 rounded-xl overflow-hidden mb-4 mx-[1%] relative justify-center items-center"
            onPress={() => setSelectedGenre(item.name)}
        >
            <Image
                source={{ uri: item.image }}
                className="w-full h-full absolute"
                resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/50 justify-center items-center">
                <Text className="text-white text-h3 font-bold">{item.name}</Text>
                {selectedGenre === item.name && (
                    <View className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                        <Image source={Icons.tick} className="w-4 h-4" tintColor="#fff" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-primary p-4">
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity>
                    <Image source={Icons.arrowBack} className="w-6 h-6" tintColor="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-h2 font-bold">Choose Your Genre</Text>
                <View className="w-6 h-6" /> {/* Placeholder for alignment */}
            </View>

            <FlatList
                data={genres}
                renderItem={renderGenreItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </ScrollView>
    );
};

export default GenreScreen;