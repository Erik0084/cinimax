// components/CategoryFilter.js
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        className="py-2"
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            // key={category}
            onPress={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category
                ? 'bg-transparent border border-[#12CDD9]'
                : 'bg-transparent'
            }`}
          >
            <Text
              className={`font-medium ${
                selectedCategory === category
                  ? 'text-[#12CDD9]'
                  : 'text-[#8E8E93]'
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
