import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { Icons } from '../../constants/icons';

export const TabIcon = ({ focused, icon, title }) => {
  if (focused) {
    return (
      <>
        <View className='flex-row items-center justify-center bg-soft min-w-[100px] pr-[4px] rounded-[15px] h-[40px]'>
          <Image source={icon} tintColor="#12CDD9" className="w-6" />
          {/* <Text className="text-secondary text-[16px] text-blue_accent font-semibold ml-[8px]">
            {title}
          </Text> */}
        </View>
      </>
    )
  }
  return (

    <View className='flex-row items-center justify-center'>
      <Image source={icon} tintColor="#fff" className="h-[20px]" />
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarShowLabel: false,
        headerShown: false,

        tabBarItemStyle: {
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          paddingVertical: 15,
        },
        tabBarStyle: {
          backgroundColor: "#1F1D2B",
          // borderRadius: 50,
          // marginHorizontal: 20,
          marginBottom: 36,
          height: 60,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          paddingHorizontal: 20,
          borderColor: "#1F1D2B",
        }
      }}
    >
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="download"
        options={{
          title: 'Download',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Icons.download} title="Download" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={Icons.profile} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}