import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderScreen from '@components/layout/HeaderScreen';

const LoginScreen = ({ navigation }) => {
    const router = useRouter();
    const [email, setEmail] = React.useState('Tiffanyjeersey@gmail.com');
    const [password, setPassword] = React.useState('');

    return (
        <View className="flex-1 justify-center min-h-full px-6 pt-20 pb-32 bg-black h-full">
            {/* Header */}
            <HeaderScreen title="Login" />
            
            <View className="flex-1 justify-center min-h-full pb-32 bg-black h-full">
                <View className="mb-10 mt-16">
                    <Text className="font-bold text-white text-h1 mb-1">Hi, Tiffany</Text>
                    <Text className="text-lg text-grey">
                        Welcome back! Please enter
                    </Text>
                    <Text className="text-lg text-grey">
                        your details.
                    </Text>
                </View>

                {/* Email Input */}
                <View className="mb-6">
                    <Text className="text-grey text-sm font-medium mb-2">Email Address</Text>
                    <TextInput
                        className="border border-grey rounded-full p-4 text-white placeholder:text-grey"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Input */}
                <View className="mb-4">
                    <Text className="text-grey text-sm font-medium mb-2">Password</Text>
                    <TextInput
                        className="border border-grey rounded-full p-4 text-white placeholder:text-grey"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                    />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity className="items-end mb-8">
                    <Text className="text-blue_accent text-sm">Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    className="py-4 rounded-full mb-6 bg-blue_accent"
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text className="text-white text-h4 text-center font-bold">Login</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="flex-row justify-center">
                    <Text className="text-grey">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/user/signup')}>
                        <Text className="text-blue_accent">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;