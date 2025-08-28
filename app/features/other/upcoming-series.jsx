// screens/UpcomingMovieScreen.js
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import CategoryFilter from "@components/ui/navigation/CategoryFilter";
import MovieCard from "@components/ui/cards/MovieCard-Global";
import HeaderScreen from "@components/layout/HeaderScreen";
import { categories, recommendations } from "@/constants/data/constant";

const UpcomingSeriesScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const upcomingMovies = [
    {
      id: 1,
      title: "The Batman",
      releaseDate: "March 2, 2022",
      genre: "Action",
      poster: "https://example.com/batman-poster.jpg", // Replace with actual image
      thumbnail: "https://example.com/batman-thumb.jpg",
    },
    {
      id: 2,
      title: "Black Panther: Wakanda Forever",
      releaseDate: "November 11, 2022",
      genre: "Action",
      poster: "https://example.com/wakanda-poster.jpg",
      thumbnail: "https://example.com/wakanda-thumb.jpg",
    },
    {
      id: 3,
      title: "Minions: The Rise of Gru",
      releaseDate: "July 1, 2022",
      genre: "Animation",
      poster: "https://example.com/minions-poster.jpg",
      thumbnail: "https://example.com/minions-thumb.jpg",
    },
    // Add more movies as needed
  ];

  const filteredMovies =
    selectedCategory === "All"
      ? upcomingMovies
      : upcomingMovies.filter((movie) => movie.genre === selectedCategory);

  return (
    <SafeAreaView className="flex-1 bg-[#1F1D2B]">
      {/* Header */}
      <HeaderScreen title="Upcoming Series" />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Movie List */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {recommendations.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isLast={index === filteredMovies.length - 1}
            onPress={() => {
              // Navigate to movie detail screen
              // navigation.navigate('MovieDetail', { movieId: movie.id });
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpcomingSeriesScreen;
