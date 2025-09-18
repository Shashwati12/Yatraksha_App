import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Polygon,
  Circle,
  Ellipse,
  Line,
} from "react-native-svg";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* FULL-SCREEN GRADIENT BACKGROUND */}
      <Svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#87CEEB" /> {/* Sky Blue */}
            <Stop offset="50%" stopColor="#C4D8E2" /> {/* Columbia Blue */}
            <Stop offset="100%" stopColor="#FFFFFF" /> {/* White */}
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGradient)" />
      </Svg>

      {/* Floating Clouds */}
      {[styles.cloud1, styles.cloud2, styles.cloud3, styles.cloud4].map(
        (style, idx) => (
          <Animated.View
            key={idx}
            style={[
              styles.cloud,
              style,
              { transform: [{ translateX: cloudAnim }] },
            ]}
          />
        )
      )}

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.appName}>YATRAKSHA</Text>
          <Text style={styles.subtitle}>
            Find safe routes and explore your favorite destination with us.
          </Text>
        </View>

        {/* Landscape Illustration */}
        <Svg width={width - 48} height={250} viewBox="0 0 400 200">
          <Defs>
            <LinearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#10b981" />
              <Stop offset="100%" stopColor="#059669" />
            </LinearGradient>
            <LinearGradient id="fieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#fbbf24" />
              <Stop offset="100%" stopColor="#f59e0b" />
            </LinearGradient>
          </Defs>

          {/* Mountains */}
          <Polygon
            points="0,120 80,60 160,100 240,40 320,80 400,70 400,200 0,200"
            fill="url(#mountainGradient)"
          />
          <Polygon points="80,60 120,80 160,100 120,70" fill="#34d399" opacity="0.6" />
          <Polygon points="240,40 280,60 320,80 280,50" fill="#34d399" opacity="0.6" />

          {/* Fields */}
          <Polygon points="0,140 400,130 400,200 0,200" fill="url(#fieldGradient)" />

          {/* Trees */}
          <Polygon points="60,140 70,120 80,140" fill="#065f46" />
          <Line x1="65" y1="140" x2="65" y2="135" stroke="#065f46" strokeWidth="2" />
          <Polygon points="320,135 330,115 340,135" fill="#065f46" />
          <Line x1="330" y1="135" x2="330" y2="130" stroke="#065f46" strokeWidth="2" />

          {/* House */}
          <Rect x="150" y="130" width="20" height="15" fill="#8b5cf6" />
          <Polygon points="150,130 160,120 170,130" fill="#7c3aed" />
          <Rect x="155" y="135" width="4" height="6" fill="#fbbf24" />

          {/* Cows */}
          <Ellipse cx="200" cy="145" rx="8" ry="4" fill="white" />
          <Ellipse cx="198" cy="143" rx="2" ry="1.5" fill="white" />
          <Circle cx="197" cy="142.5" r="0.5" fill="black" />

          <Ellipse cx="220" cy="147" rx="6" ry="3" fill="white" />
          <Ellipse cx="218" cy="145" rx="1.5" ry="1" fill="white" />
          <Circle cx="217.5" cy="144.5" r="0.3" fill="black" />
        </Svg>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.buttonText}>🚀 Start Your Journey</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: { alignItems: "center", marginBottom: 16 },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#374151" },
  appName: { fontSize: 28, fontWeight: "bold", color: "#065f46", marginVertical: 8 },
  subtitle: { fontSize: 14, color: "#374151", textAlign: "center", marginTop: 4 },
  cloud: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
    opacity: 0.8,
  },
  cloud1: { width: 64, height: 32, top: 32, left: 32 },
  cloud2: { width: 48, height: 24, top: 24, left: 80 },
  cloud3: { width: 72, height: 36, top: 48, right: 60 },
  cloud4: { width: 56, height: 28, top: 72, right: 32 },
  ctaButton: {
    backgroundColor: "#FF8045",
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600", textAlign: "center" },
});

export default WelcomeScreen;
