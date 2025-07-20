import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import DownloadCard from '../../components/DownloadCard';
import HeaderScreen from '../../components/HeaderScreen';
import { Icons } from '../../constants/icons';

const DownloadScreen = () => {
  const [downloads, setDownloads] = React.useState([
    {
      id: '1',
      image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      title: 'Spider-Man No Way Home',
      type: 'Movie',
      size: '1.78 GB',
      progress: 0.75,
      category: 'Action',
      downloading: true
    },
    {
      id: '1',
      image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      title: 'Spider-Man No Way Home',
      type: 'Movie',
      size: '1.78 GB',
      progress: 0.75,
      category: 'Action',
      downloading: true
    },
    {
      id: '1',
      image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      title: 'Spider-Man No Way Home',
      type: 'Movie',
      size: '1.78 GB',
      progress: 0.75,
      category: 'Action',
      downloading: true
    },
    // Add more downloads here
  ]);

  const isEmpty = downloads.length === 0;

  return (
    <View className="flex-1 bg-dark px-4 pt-12">
      {/* Header */}
      <HeaderScreen title="Downloads" />


      {isEmpty ? (
        // Empty State
        <View className="flex-1 items-center h-full mt-[-90px] justify-center">
          <Image source={Icons.noResults1} className="w-40 h-40 mb-6" />
          <Text className="text-white text-xl font-bold mb-2">There is No Movie Yet!</Text>
          <Text className="text-grey text-center">
            Find your movie by Type title,
          </Text>
          <Text className="text-grey text-center">
            categories, years, etc
          </Text>
          <TouchableOpacity
            className="mt-8 bg-blue_accent py-3 px-6 rounded-full"
            onPress={() => router.push('/browse')}
          >
            <Text className="text-white font-bold">Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Download List
        <FlatList
          className="mt-8"
          data={downloads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DownloadCard item={item} />
          )}
        />
      )}
    </View>
  );
};

export default DownloadScreen;