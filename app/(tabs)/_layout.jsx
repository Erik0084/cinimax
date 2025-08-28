// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { icons } from "@/constants/icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00D4FF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarShowLabel: false, // Hide default labels since we're custom rendering
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 6,
          paddingHorizontal: 20,
          // Floating effect styles
          position: "absolute",
          bottom: 30, // Distance from bottom
          left: 20, // Left margin
          right: 20, // Right margin
          borderRadius: 25, // Rounded corners
          marginLeft: 10,
          marginRight: 10,
          // Shadow for iOS
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          // Elevation for Android
          elevation: 15,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
          flex: 1,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                minWidth: focused ? 100 : 40,
                paddingHorizontal: focused ? 16 : 0,
                backgroundColor: focused ? "#252836" : "transparent",
                borderRadius: focused ? 20 : 0,
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.home}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: "#12CDD9",
                }}
                resizeMode="contain"
              />
              {/* {focused && (
                <Text style={{
                  color: '#12CDD9',
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 8,
                }}>
                  Home
                </Text>
              )} */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                minWidth: focused ? 100 : 40,
                paddingHorizontal: focused ? 16 : 0,
                backgroundColor: focused
                  ? "rgba(0, 212, 255, 0.2)"
                  : "transparent",
                borderRadius: focused ? 20 : 0,
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.search}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
              {/* {focused && (
                <Text style={{
                  color: color,
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 8,
                }}>
                  Search
                </Text>
              )} */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="download"
        options={{
          title: "Download",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                minWidth: focused ? 100 : 40,
                paddingHorizontal: focused ? 16 : 0,
                backgroundColor: focused
                  ? "rgba(0, 212, 255, 0.2)"
                  : "transparent",
                borderRadius: focused ? 20 : 0,
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.download}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
              {/* {focused && (
                <Text style={{
                  color: color,
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 8,
                }}>
                  Download
                </Text>
              )} */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                minWidth: focused ? 100 : 40,
                paddingHorizontal: focused ? 16 : 0,
                backgroundColor: focused
                  ? "rgba(0, 212, 255, 0.2)"
                  : "transparent",
                borderRadius: focused ? 20 : 0,
                flexDirection: "row",
              }}
            >
              <Image
                source={icons.profile}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
              {/* {focused && (
                <Text style={{
                  color: color,
                  fontSize: 14,
                  fontWeight: '600',
                  marginLeft: 8,
                }}>
                  Profile
                </Text>
              )} */}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
