import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '@/constants/icons';

// Helper component for a single setting item
const SettingItem = ({ icon, text, onPress }) => (
  <TouchableOpacity className="flex-row items-center py-3" onPress={onPress}>
    <Image source={icon} className="w-6 h-6 mr-4" tintColor="#12CDD9" />
    <Text className="text-white text-h4 flex-1">{text}</Text>
    <Image source={Icons.arrowBack} className="w-6 transform rotate-180" tintColor="#12CDD9" />
  </TouchableOpacity>
);

// Helper component for a section header
const SectionHeader = ({ title }) => (
  <Text className="text-white text-h3 font-semibold mb-4">{title}</Text>
);

// Helper component for a separator line
const Separator = () => (
  <View className="h-[1px] bg-gray-700 my-2" />
);

const Profile = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View className="flex-1 bg-dark pb-20">
      <ScrollView className="flex-1 bg-dark pt-8">
        {/* Profile Header */}
        <View className="py-4 pb-0  items-center justify-center">
          <Text className="text-white text-h3 font-semibold">Profile</Text>
        </View>


        {/* Premium Member Card */}
        <View className="mx-4 mt-6 p-4 bg-orange rounded-xl flex-row items-center">
          <Image source={Icons.workspacePremiumBlack24dp1} className="w-10 h-10 mr-4" tintColor="#fff" />
          <View className="flex-1">
            <Text className="text-white text-h3 font-bold">Premium Member</Text>
            <Text className="text-white text-h5">New movies are coming for you,\nDownload Now!</Text>
          </View>
        </View>

        {isLogin && (
          <Link href="/user/login" asChild>
            <TouchableOpacity className="mx-4 mt-6 p-4 mb-0 bg-red-500 rounded-xl border-[1px] border-blue_accent items-center justify-center">
              <Text className="text-blue_accent text-h3 font-bold">Log In</Text>
            </TouchableOpacity>
          </Link>
        )}

        {/* User Profile Card */}
        <View className="mx-4 mt-6 p-4 bg-soft rounded-xl flex-row items-center">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Placeholder image
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-white text-h3 font-bold">Tiffany</Text>
            <Text className="text-grey text-h5">Tiffanyjearsey@gmail.com</Text>
          </View>
          <Link href={'/profiles/1'} asChild>
            <TouchableOpacity>
              <Image source={Icons.Edit} className="w-6 h-6" tintColor="#12CDD9" />
            </TouchableOpacity>
          </Link>
        </View>


        {/* Account Settings */}
        <View className="mx-4 mt-6 p-4 bg-soft rounded-xl">
          <SectionHeader title="Account" />
          <SettingItem icon={Icons.person} text="Member" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.padlock1} text="Change Password" onPress={() => { }} />
        </View>

        {/* General Settings */}
        <View className="mx-4 mt-6 p-4 bg-soft rounded-xl">
          <SectionHeader title="General" />
          <SettingItem icon={Icons.notification61} text="Notification" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.globe} text="Language" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.flag} text="Country" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.trashBin1} text="Clear Cache" onPress={() => { }} />
        </View>

        {/* More Settings */}
        <View className="mx-4 mt-6 p-4 mb-20 bg-soft rounded-xl">
          <SectionHeader title="More" />
          <SettingItem icon={Icons.shield21} text="Legal and Policies" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.question21} text="Help & Feedback" onPress={() => { }} />
          <Separator />
          <SettingItem icon={Icons.profile} text="About Us" onPress={() => { }} />
        </View>


        {!isLogin && (
          <TouchableOpacity className="mx-4 mt-6 p-4 mb-32 bg-red-500 rounded-xl items-center justify-center">
            <Text className="text-white text-h3 font-bold">Log Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;