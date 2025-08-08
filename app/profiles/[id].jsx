import HeaderScreen from '@/components/HeaderScreen';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icons } from '../../constants/icons';

const EditProfile = () => {
    return (
        <ScrollView className="flex-1 bg-dark pt-16 px-4">
            <HeaderScreen title="Edit Profile" />
            {/* Profile Picture and Edit Icon */}
            <View className="items-center mt-4 mb-8">
                <View className="relative w-24 h-24 rounded-full bg-gray-700 items-center justify-center">
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Placeholder image
                        className="w-24 h-24 rounded-full"
                    />
                    <TouchableOpacity className="absolute bottom-0 right-[-10px] bg-soft p-3 rounded-full">
                        <Image source={Icons.Edit} className="w-4 h-4" tintColor="#12CDD9" />
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-h3 font-bold mt-4">Tiffany</Text>
                <Text className="text-grey text-h5 mt-2">Tiffanyjearsey@gmail.com</Text>
            </View>

            {/* Full Name Input */}
            <View className="mb-4">
                <Text className="text-white text-h5 mb-2 ml-4">Full Name</Text>
                <TextInput
                    className=" text-white text-h4 p-4 rounded-full border border-soft"
                    placeholder="Tiffany"
                    placeholderTextColor="#9CA3AF"
                    value="Tiffany"
                />
                <Text className="text-red text-h6 mt-1">* Name already exist</Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
                <Text className="text-white text-h5 mb-2 ml-4">Email</Text>
                <TextInput
                    className=" text-white text-h4 p-4 rounded-full border border-soft"
                    placeholder="Tiffanyjearsey@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value="Tiffanyjearsey@gmail.com"
                />
            </View>

            {/* Password Input */}
            <View className="mb-4">
                <Text className="text-white text-h5 mb-2 ml-4">Password</Text>
                <TextInput
                    className=" text-white text-h4 p-4 rounded-full border border-soft"
                    placeholder="********"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value="********"
                />
            </View>

            {/* Phone Number Input */}
            <View className="mb-6">
                <Text className="text-white text-h5 mb-2 ml-4">Phone Number</Text>
                <TextInput
                    className=" text-white text-h4 p-4 rounded-full border border-soft"
                    placeholder="+1 82120142305"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value="+1 82120142305"
                />
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity className="bg-blue_accent p-4 rounded-full items-center justify-center mb-8">
                <Text className="text-white text-h3 font-bold">Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditProfile;