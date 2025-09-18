import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "userData";
const TOKEN_KEY = "userToken";

// Save new user (register)
export const registerUser = async (user: { email: string; password: string }) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("Error saving user", error);
    return false;
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_KEY);
    if (!storedUser) return false;

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
      await AsyncStorage.setItem(TOKEN_KEY, "valid-token"); // mock token
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in", error);
    return false;
  }
};

// Check if user is logged in
export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token ? true : false;
  } catch (error) {
    console.error("Error checking login status", error);
    return false;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("Error logging out", error);
    return false;
  }
};
