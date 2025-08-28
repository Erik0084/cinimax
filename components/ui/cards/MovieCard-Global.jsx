// components/MovieCard.js
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const MovieCard = ({ movie, isLast, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isLast ? 'mb-0' : 'mb-6'}`}
      activeOpacity={0.8}
    >
      <View className="bg-[#252836] rounded-2xl overflow-hidden">
        {/* Movie Thumbnail with Play Button */}
        <View className="relative">
          <ImageBackground
            source={{ uri: movie.images.poster || 'https://via.placeholder.com/400x200' }}
            className="w-full h-48 justify-center items-center"
            imageStyle={{ backgroundColor: '#333' }}
          >
            {/* Play Button Overlay */}
            <View className="absolute inset-0 bg-black/30 justify-center items-center">
              <TouchableOpacity className="w-16 h-16 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
                <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
            
            {/* Duration Badge (Optional) */}
            <View className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded">
              <Text className="text-white text-xs font-medium">2h 56m</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Movie Info */}
        <View className="p-4">
          <Text className="text-white text-lg font-semibold mb-3">
            {movie.title}
          </Text>
          
          <View className="flex-row items-center justify-between">
            {/* Release Date */}
            <View className="flex-row items-center">
              <MaterialIcons name="date-range" size={16} color="#8E8E93" />
              <Text className="text-[#8E8E93] text-sm ml-2">
                {movie.releaseDate}
              </Text>
            </View>
            
            {/* Genre Tag */}
            <View className="bg-[#1F1D2B] px-3 py-1 rounded-full">
              <Text className="text-[#8E8E93] text-sm">
                {movie.genre}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
