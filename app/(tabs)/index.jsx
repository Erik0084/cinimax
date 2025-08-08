import Categories from "@/components/Categories";
import MovieCardFull from "@/components/MovieCardFull";
import MoviesList from "@/components/MoviesList";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import React from "react";

import { ScrollView, View } from "react-native";

export default function Index() {

  const recommendations = [

    {
      id: 2,
      title: 'Life of PI',
      genre: 'Adventure',
      imageUrl: 'https://i.pinimg.com/736x/ae/7a/e4/ae7ae4b85a1039a13d3853ec4e4092f9.jpg',
    },
    {
      id: 1,
      title: 'The Jungle Book',
      genre: 'Action',
      imageUrl: 'https://i.pinimg.com/736x/5b/d9/d6/5bd9d6d6790a47c9b8588ab40c742280.jpg',
    },
    {
      id: 3,
      title: 'Dune',
      genre: 'Sci-Fi',
      imageUrl: 'https://i.pinimg.com/1200x/ab/93/4c/ab934cc1ce1b3cc20b90a557b45517f4.jpg',
    },
    {
      id: 4,
      title: 'The Matrix',
      genre: 'Action',
      imageUrl: 'https://i.pinimg.com/736x/86/c7/aa/86c7aa5e1efd6626999799fc66ef2085.jpg',
    },
  ];

  return (
    <>
      <View className="flex-1 justify-start min-h-full bg-dark h-">
        <ScrollView
          className="flex-1 px-0 pb-20"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <View className="w-full mt-12 mb-6 px-4">
            <View className="w-full">
              <SearchBar />
            </View>
          </View>
          <Slider />
          <View className="w-full mb-28 mt-2 px-4">
            <View className="most__popular w-full">
              <Categories />
              <MoviesList title="Top series for you" movies={recommendations} series={true} />
              <View className="pt-8">
                <MovieCardFull />
              </View>
              <MoviesList title="Recommended for you" movies={recommendations} />
              <View className="pt-12">
                <MovieCardFull />
              </View>
              <MoviesList title="Top Rated" movies={recommendations} />
            </View>
          </View>

        </ScrollView >
      </View >
    </>
  );
}