import { useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Icons } from '../constants/icons'

const HeaderScreen = ({ title }) => {
    const router = useRouter()
    return (

        <View className="flex-row items-center justify-center py-4 relative">
            <TouchableOpacity
                onPress={router.back}
                className="absolute left-0 p-2 rounded-xl bg-soft"
            >
                <Image source={Icons.arrowBack} className="w-6 h-6" tintColor="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-h3 font-semibold">{title}</Text>
        </View>
    )
}

export default HeaderScreen