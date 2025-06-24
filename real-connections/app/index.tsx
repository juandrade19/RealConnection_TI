import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();


  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
  
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

  
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNavigate = () => {
    if (navigating) return;
    setNavigating(true);

    
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      router.push('../login');
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { opacity: logoOpacity }]}
      />
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity onPress={handleNavigate} style={styles.button}>
          <Image source={require('../assets/play.png')} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F4F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: height * 0.15,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FB8469',
    borderRadius: 50,
    padding: 18,
    marginBottom: 40,
    marginTop: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  icon: {
    width: 36,
    height: 36,
    tintColor: '#fff',
  },
});
