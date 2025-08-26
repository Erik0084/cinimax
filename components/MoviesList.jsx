import { JELLYFIN_URL } from '@/utils/useJellyfin';
import { Link } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import MovieCard from './MovieCard';

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
                    {movies.map((item) => {
                    const imageUrl = item.ImageTags?.Primary ? `http://192.168.108.202:8096/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}` : `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary`;
                    // console.log('Image URL for', item.Name, ':', imageUrl);
                    return (
                        <MovieCard 
                            key={item.id}
                            id={item.Id}
                            title={item.Name}
                            genre={item.GenreItems && item.GenreItems.length > 0 ? item.GenreItems[0].Name : ''}
                            imageUrl={imageUrl}
                             series={series}
                         />
                     );
                     })}
                </ScrollView>
            </View>
        </View>
    )
}

export default FeaturedMovies