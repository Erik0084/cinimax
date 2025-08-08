import { Link } from '@react-navigation/native'
import { ScrollView, Text, View } from 'react-native'
import MovieCard from './MovieCard'

const FeaturedMovies = ({title, movies, series}) => {
    return (
        <View>
            <View className="mt-8">
                <View className="flex-row justify-between items-center mb-[16px]">
                    <Text className="text-h4 text-white font-bold">{title}</Text>
                    <Link href="/popular">
                        <Text className=" text-h6 text-blue_accent">See All</Text>
                    </Link>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {movies.map((item) => (
                        <MovieCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            genre={item.genre}
                            imageUrl={item.imageUrl}
                            series={series}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default FeaturedMovies