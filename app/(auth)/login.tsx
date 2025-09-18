import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async () => {
  console.log("Button pressed");
  if (!email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }
  console.log("Email:", email, "Password:", password);

  try {
    if (isLogin) {
      // LOGIN FLOW
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        Alert.alert('Error', 'No user found. Please register first.');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.email === email && parsedUser?.password === password) {
        await AsyncStorage.setItem('userToken', 'mock-token'); // save session

        if (Platform.OS === "web") {
          window.alert("Success: Logged in");
          router.replace("/(tabs)");  // 🚀 navigate after login
        } else {
          Alert.alert("Success", "Logged in successfully", [
            { text: "OK", onPress: () => router.replace("/(tabs)") },
          ]);
        }
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } else {
      // REGISTER FLOW
      const newUser = { email, password };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      if (Platform.OS === "web") {
        window.alert("Success: Registered");
        setIsLogin(true);
      } else {
        Alert.alert("Success", "Registered successfully", [
          { text: "OK", onPress: () => setIsLogin(true) },
        ]);
      }
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>यात्रारक्षा</Text>
          <Text style={styles.subtitle}>YATRAKSHA</Text>
          <Text style={styles.tagline}>Your Travel Safety Companion</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#008080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#008080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CBEAF6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#008080',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  authButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  switchButtonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});