import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CheckBoxIcon from 'react-native-elements/dist/checkbox/CheckBoxIcon';
import HeaderScreen from '@components/layout/HeaderScreen';


const SignupScreen = ({ navigation }) => {
    const router = useRouter();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('Tiffanyjearsey@gmail.com');
    const [password, setPassword] = React.useState('');
    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <View className="flex-1 justify-center min-h-full px-6 pt-20 pb-32 bg-black h-full">
            {/* Header */}
            <HeaderScreen title="Sign Up" />
            <View className="flex-1 justify-center min-h-full pb-32 bg-black h-full">
                <View className="mb-10 mt-16 flex items-start">
                    {/* <Text className="text-3xl font-bold text-white mb-2">Sign Up</Text> */}
                    <Text className="font-bold text-white text-h1 mb-1">Let's get started</Text>
                    <Text className="text-lg text-grey">
                        The latest movies and series are here
                    </Text>
                </View>

                {/* Divider */}
                {/* <View className="h-px bg-gray-200 mb-6" /> */}

                {/* Full Name Input */}
                <View className="mb-6 relative">
                    {/* <Text className="text-grey text-sm font-medium mb-2">Full Name</Text> */}
                    <TextInput
                        className="border border-grey rounded-full p-4 text-white placeholder:text-grey"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        style={{ borderWidth: 1 }}
                    />
                </View>

                {/* Email Input */}
                <View className="mb-6">
                    {/* <Text className="text-grey text-sm font-medium mb-2">Email Address</Text> */}
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
                <View className="mb-6">
                    {/* <Text className="text-grey text-sm font-medium mb-2">Password</Text> */}
                    <TextInput
                        className="border border-grey rounded-full p-4 text-white placeholder:text-grey"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                    />
                </View>

                {/* Terms Checkbox */}
                <View className="mb-8 flex-row items-center">
                    <CheckBoxIcon
                        onPress={() => setIsChecked(!isChecked)}
                        checked={isChecked}
                        containerStyle={{
                            backgroundColor: 'transparent',
                            borderWidth: 0,
                            padding: 0,
                            marginLeft: 0,
                            marginRight: 12,
                        }}
                    />
                    <Text className="text-grey ml-2 text-sm max-w-[70%]">
                        I agree to the{' '}
                        <Text className="text-blue_accent">Terms and Services</Text> and{' '}
                        <Text className="text-blue_accent">Privacy Policy</Text>
                    </Text>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                    className={`py-4 rounded-full mb-6 ${isChecked ? 'bg-blue_accent' : 'bg-blue_accent'}`}
                    disabled={!isChecked}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text className="text-white text-h4 text-center font-bold">Sign Up</Text>
                </TouchableOpacity>
                
                {/* Login Link */}
                <View className="flex-row justify-center">
                    <Text className="text-grey">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/user/login')}>
                        <Text className="text-blue_accent">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};

export default SignupScreen;