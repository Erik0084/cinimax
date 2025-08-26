// components/EnhancedMovieCard.js
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const EnhancedMovieCard = ({ movie, isLast, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isLast ? 'mb-0' : 'mb-6'}`}
      activeOpacity={0.8}
    >
      <View className="bg-[#252836] rounded-2xl overflow-hidden">
        {/* Movie Thumbnail */}
        <View className="relative">
          <ImageBackground
            source={{ uri: movie.thumbnail || 'https://via.placeholder.com/400x200' }}
            className="w-full h-48"
            imageStyle={{ backgroundColor: '#333' }}
          >
            {/* Gradient Overlay */}
            <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Play Button */}
            <View className="absolute inset-0 justify-center items-center">
              <TouchableOpacity className="w-16 h-16 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm border border-white/30">
                <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
            
            {/* Quality Badge */}
            <View className="absolute top-4 right-4 bg-[#12CDD9] px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">HD</Text>
            </View>
            
            {/* Rating */}
            <View className="absolute top-4 left-4 flex-row items-center bg-black/60 px-2 py-1 rounded">
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text className="text-white text-xs font-medium ml-1">8.5</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Movie Details */}
        <View className="p-5">
          <Text className="text-white text-xl font-bold mb-3">
            {movie.title}
          </Text>
          
          <View className="flex-row items-center justify-between mb-2">
            {/* Release Date */}
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={16} color="#8E8E93" />
              <Text className="text-[#8E8E93] text-sm ml-2">
                {movie.releaseDate}
              </Text>
            </View>
            
            {/* Genre Tag */}
            <View className="bg-[#12CDD9]/20 border border-[#12CDD9] px-3 py-1 rounded-full">
              <Text className="text-[#12CDD9] text-sm font-medium">
                {movie.genre}
              </Text>
            </View>
          </View>
          
          {/* Additional Info */}
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="access-time" size={14} color="#8E8E93" />
            <Text className="text-[#8E8E93] text-xs ml-1 mr-4">2h 56m</Text>
            
            <MaterialIcons name="language" size={14} color="#8E8E93" />
            <Text className="text-[#8E8E93] text-xs ml-1">English</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EnhancedMovieCard;
