import Categories from "@/components/Categories";
import SearchBar from "@/components/Home/SearchBarHome";
import MovieCardFull from "@/components/MovieCardFull";
import MoviesList from "@/components/MoviesList";
import Slider from "@/components/Slider";
import { heroSeries } from "@/constants/data/constant";
import { fetchAllSeries } from "@/utils/useJellyfin";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function Index() {
  const [jellyfinSeries, setJellyfinSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("jellyfinSeries", jellyfinSeries);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const series = await fetchAllSeries();
        // console.log("series", series);      
        setJellyfinSeries(series);  
      } catch (error) {  
        console.error('Failed to fetch series:', error);  
      } finally {  
        setLoading(false);
      }  
    };
  
    loadSeries();
  }, []);

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
                movies={jellyfinSeries}
                series={true}
              />
              <View className="pt-8">
                <MovieCardFull />
              </View>
              <MoviesList
                title="Recommended for you"
                movies={jellyfinSeries}
                series={true}
              />
              <View className="pt-12">
                <MovieCardFull />
              </View>
              <MoviesList
                title="Top Rated"
                movies={jellyfinSeries}
                series={true}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
