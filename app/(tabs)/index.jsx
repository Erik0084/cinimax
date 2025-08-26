import Categories from "@/components/Categories";
import SearchBar from "@/components/Home/SearchBarHome";
import MovieCardFull from "@/components/MovieCardFull";
import MoviesList from "@/components/MoviesList";
import Slider from "@/components/Slider";
import { heroSeries, recommendations } from "@/constants/data/constant";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function Index() {
  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    const url = "https://e66ee6b7b095.ngrok-free.app";
    const apiKey = "4a8f78d0e0eb4b7f8957732ee343a3b0";
    try {
      const response = await fetch(`${url}/Items?api_key=${apiKey}`);
      const data = await response.json();
      setMovies(data?.Items || []);
      console.log("movies", movies);
      return data?.Items || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  console.log("Hello from React Native!");

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
          {/* <JellyfinPlayer /> */}
          <Slider series={heroSeries} />
          <View className="w-full mb-28 mt-2 px-4">
            <View className="most__popular w-full">
              <Categories />
              <MoviesList
                title="Top series for you"
                movies={recommendations}
                series={true}
              />
              <View className="pt-8">
                <MovieCardFull />
              </View>
              <MoviesList
                title="Recommended for you"
                movies={recommendations}
                series={true}
              />
              <View className="pt-12">
                <MovieCardFull />
              </View>
              <MoviesList
                title="Top Rated"
                movies={recommendations}
                series={true}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
