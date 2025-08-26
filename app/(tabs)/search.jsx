import Categories from '@/components/Categories';
import MoviesList from '@/components/MoviesList';
import SearchBar from '@/components/SearchBar';
import { recommendations } from '@/constants/data/constant';
import { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import FeaturedMovieCard from '../../components/FeaturedMovieCard';



export default function Search() {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <View className="flex justify-start min-h-full pt-10 pb-32 px-6 bg-dark h-full">
        <ScrollView
          className="flex-1 px-0"  
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <SearchBar ref={searchInputRef} />
          <View className="mt-8">
            <Categories />
          </View>
          <FeaturedMovieCard />
          <MoviesList title="Recommended for you" movies={recommendations} />
          <MoviesList title="You might like" movies={recommendations} />
        </ScrollView>
      </View>
    </>
  );
}