import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Text, View } from 'react-native';
import { Icons } from '../constants/icons';

const { width, height } = Dimensions.get('window');

const AnimatedSplashScreen = ({ onAnimationFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo scale and fade in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Text fade in
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]);

    // Glow effect animation (continuous)
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    animationSequence.start(() => {
      // Wait a bit before finishing
      setTimeout(() => {
        onAnimationFinish();
      }, 500);
    });

    glowAnimation.start();

    return () => {
      glowAnimation.stop();
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E', '#16213E', '#0F0F23']}
        locations={[0, 0.3, 0.7, 1]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%" }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            height: "100%",
          }}
        >
          {/* Animated Glow Effect */}
          <Animated.View
            style={{
              position: 'absolute',
              width: "100%",
              height: "100%",
              borderRadius: 10,
              backgroundColor: '#12CDD9',
              opacity: glowOpacity,
              transform: [{ scale: 1.5 }],
            }}
          />
          
          {/* Logo Container */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: logoFadeAnim,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            {/* Cinema Icon with Glow */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 20,
                backgroundColor: '#12CDD9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#12CDD9',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              <Image
                source={Icons.film}
                style={{
                  width: 60,
                  height: 60,
                  tintColor: '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View
            style={{
              opacity: textFadeAnim,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 42,
                fontWeight: 'bold',
                color: '#FFFFFF',
                letterSpacing: 4,
                textShadowColor: '#12CDD9',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              PLEXIA
            </Text>
            {/* <Text  
              style={{
                fontSize: 16,
                color: '#12CDD9',
                marginTop: 8,
                letterSpacing: 2,
                fontWeight: '300',
              }}
            >
              PREMIUM CINEMA EXPERIENCE
            </Text> */}
          </Animated.View>

          {/* Loading Progress Bar */}
          <Animated.View
            style={{
              opacity: textFadeAnim,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 200,
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  width: progressWidth,
                  backgroundColor: '#12CDD9',
                  borderRadius: 2,
                  shadowColor: '#12CDD9',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }}
              />
            </View>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 12,
                marginTop: 12,
                letterSpacing: 1,
              }}
            >
              Loading your cinema experience...
            </Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default AnimatedSplashScreen;