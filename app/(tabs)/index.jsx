import Categories from "@/components/Categories";
import MoviesList from "@/components/MoviesList";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";

import { ScrollView, View } from "react-native";

export default function Index() {

  const recommendations = [
    {
      id: 1,
      title: 'The Jungle Book',
      genre: 'Action',
      imageUrl: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    },
    {
      id: 2,
      title: 'Life of PI',
      genre: 'Adventure',
      imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    },
    {
      id: 3,
      title: 'Dune',
      genre: 'Sci-Fi',
      imageUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    },
    {
      id: 4,
      title: 'The Matrix',
      genre: 'Action',
      imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    },
  ];


  return (
    <>
      <View className="flex justify-start min-h-full pt-10 pb-32 bg-dark h-full">
        <ScrollView
          className="flex-1 px-0"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <View className="w-full px-6">
            <SearchBar />
          </View>
          <Slider />
          <View className="most__popular w-full px-6">
            <Categories />
            <MoviesList title="Recommended for you" movies={recommendations} />
            <MoviesList title="Top Rated" movies={recommendations} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}