import { Image, Text, TouchableOpacity, View } from 'react-native';
// import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Icons } from '@/constants/icons';

const SignupScreen = ({ navigation }) => {
    return (
        <>
            <View className="flex-1 justify-center min-h-full px-6 pt-10 pb-32 bg-dark h-full">
                {/* Logo/Cinemax Text */}
                <View className="items-center mb-10">
                    <Image source={Icons.logo} />
                    <Text className="text-h1 font-bold text-white mt-4 mb-2 text-center">CINEMAX</Text>
                    <Text className="text-gray-400 text-h4 text-center">Enter your registered</Text>
                    <Text className="text-gray-400 text-h4 text-center">Phone Number to Sign Up</Text>
                </View>

                {/* Phone Number Input */}
                {/* <View className="mb-6">
                    <TextInput
                        className="bg-[#252836] text-white p-4 px-6 text-h4 rounded-full"
                        placeholder="Phone Number"
                        placeholderTextColor="#6B7280"
                        keyboardType="phone-pad"
                    />
                </View> */}

                {/* Sign Up Button */}
                <Link href="/user/signup" asChild>
                    <TouchableOpacity
                        className="bg-[#12CDD9] py-4 rounded-full mb-6"
                    >
                        <Text className="text-white text-h4 text-center font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </Link>

                {/* Login Link */}
                <TouchableOpacity
                    className="mb-8"
                    onPress={() => navigation.navigate('Login')}
                >
                    <Link  href="/user/login">
                    <Text className="text-gray-400 text-h4 text-center">
                        I already have an account? <Text className="text-[#12CDD9]" >Login</Text>
                    </Text>
                    </Link>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-px bg-gray-700" />
                    <Text className="px-4  text-gray-500">Or Sign up with</Text>
                    <View className="flex-1 h-px bg-gray-700" />
                </View>

                {/* Social Login Options */}
                <View className="flex-row justify-center gap-6">
                    <TouchableOpacity className="bg-[#252836] rounded-full">
                        <Image source={Icons.google} />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#252836] rounded-full">
                        <Image source={Icons.facebook} />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#252836] rounded-full">
                        <Image source={Icons.apple} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default SignupScreen;