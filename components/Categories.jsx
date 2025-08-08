import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Categories = ({ title }) => {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Comedy', 'Animation', 'Dokument', 'Action', 'Horror', 'Thriller', 'Romance', 'Adventure', 'Science Fiction', 'War', 'History', 'Music', 'Family', 'Mystery', 'Crime', 'Fantasy', 'Western', 'TV Movie'];

    return (
        <View className="my-0">
            {title && (
                <Text className="text-h4 text-white font-bold mb-[16px]">{title}</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        className={`py-[8px] mr-2 rounded-lg min-w-[80px] flex-row gap-2 justify-center ${activeCategory === category ? 'bg-soft' : 'bg-none'
                            }`}
                        onPress={() => setActiveCategory(category)}
                    >
                        <Text className={`text-h6 ${activeCategory === category ? 'text-white font-semibold' : 'text-white font-semibold'
                            }`}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Categories;