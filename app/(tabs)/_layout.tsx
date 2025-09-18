import { Tabs } from 'expo-router';
import { Chrome as Home, MapPin, User, TriangleAlert as AlertTriangle, Navigation, History } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff', // White when active
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Transparent white for inactive
        tabBarStyle: {
          backgroundColor: '#007B83', // Teal like Fixair
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          height: 70,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ size, color }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ size, color }) => <AlertTriangle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="directions"
        options={{
          title: 'Directions',
          tabBarIcon: ({ size, color }) => <Navigation size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => <History size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
