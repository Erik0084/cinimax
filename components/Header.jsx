import { Icons } from '@/constants/icons'
import { Image, TouchableOpacity, View } from 'react-native'

const Header = () => {
    return (
        <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity>
                <Image source={Icons.options} className="w-6 h-6" tintColor="#ddcc8e" />
            </TouchableOpacity>

            <Image
                // source={{ uri: "https://plexia.vercel.app/assets/Plexia-logo-2-CDlf4Rra.png" }} // Assuming you have a logo icon named plexiaPlayLogo in your Icons
                className="w-32 h-12" // Adjust width and height as needed for your logo
                resizeMode="contain"
            />

            <View className="flex-row items-center">
                <TouchableOpacity className="mr-4">
                    <Image source={Icons.Edit} className="w-6 h-6" tintColor="#ddcc8e" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={Icons.download} className="w-6 h-6" tintColor="#ddcc8e" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Header