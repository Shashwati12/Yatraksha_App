import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Bell,
  Heart,
  Zap,
  Globe,
  Navigation,
  Camera,
  Shield,
  Star,
  Compass,
  Plus,
} from "lucide-react-native";

export default function HomeScreen() {
  const [user] = useState<{ email: string } | null>({
    email: "jeremy.zucker@example.com",
  });

  const quickActions = [
    {
      id: 1,
      title: "Explore Destinations",
      subtitle: "Find amazing places",
      icon: Globe,
      bg: "#E0F7FA",
      color: "#FF6B35",
    },
    {
      id: 2,
      title: "Plan Journey",
      subtitle: "Create your route",
      icon: Navigation,
      bg: "#F0FFF4",
      color: "#20B2AA",
    },
    {
      id: 3,
      title: "Capture Moments",
      subtitle: "Save memories",
      icon: Camera,
      bg: "#F3E5F5",
      color: "#9C27B0",
    },
    {
      id: 4,
      title: "Safety First",
      subtitle: "Emergency tools",
      icon: Shield,
      bg: "#E8F5E9",
      color: "#4CAF50",
    },
  ];

  const popularDestinations = [
    {
      id: 1,
      name: "Mount Forel",
      location: "Greenland",
      price: "$150",
      rating: 4.8,
      image: "🏔️",
      color: "#4CAF50",
    },
    {
      id: 2,
      name: "Eco Camping",
      location: "Patagonia",
      price: "$89",
      rating: 4.6,
      image: "🏕️",
      color: "#FF6B35",
    },
    {
      id: 3,
      name: "Ocean View",
      location: "Maldives",
      price: "$299",
      rating: 4.9,
      image: "🏝️",
      color: "#2196F3",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Welcome 👋</Text>
          <Text style={styles.username}>
            {user?.email ? user.email.split("@")[0] : "Explorer"}
          </Text>
        </View>
        <Compass size={28} color="#fff" />
      </View>

      {/* Floating icons */}
      <View style={styles.floatingIcons}>
        <View style={styles.iconBubble}>
          <Bell size={18} color="#FF6B35" />
        </View>
        <View style={[styles.iconBubble, { top: 50, right: 20 }]}>
          <Heart size={16} color="#E91E63" />
        </View>
        <View style={[styles.iconBubble, { top: 90, right: 35 }]}>
          <Zap size={16} color="#FFC107" />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>✨ Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.card}>
              <View
                style={[styles.iconWrapper, { backgroundColor: action.bg }]}
              >
                <action.icon size={28} color={action.color} />
              </View>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Destinations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Popular Now</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularDestinations.map((dest) => (
            <View key={dest.id} style={styles.destCard}>
              <View
                style={[
                  styles.destImage,
                  { backgroundColor: dest.color + "20" },
                ]}
              >
                <Text style={styles.emoji}>{dest.image}</Text>
                <View style={styles.priceTag}>
                  <Text style={styles.price}>{dest.price}</Text>
                </View>
              </View>
              <View style={styles.destInfo}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destLocation}>📍 {dest.location}</Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{dest.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Travel Stats */}
        <Text style={styles.sectionTitle}>📊 Your Travel Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>12</Text>
            <Text style={styles.statsLabel}>Countries</Text>
            <Text style={styles.emoji}>🌍</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>47</Text>
            <Text style={styles.statsLabel}>Adventures</Text>
            <Text style={styles.emoji}>🎒</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>2.3k</Text>
            <Text style={styles.statsLabel}>Photos</Text>
            <Text style={styles.emoji}>📸</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#20B2AA",
    height: 160,
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeBox: {},
  welcomeText: { color: "#fff", fontSize: 14 },
  username: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  floatingIcons: { position: "absolute", top: 40, right: 20 },
  iconBubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    right: 0,
    top: 0,
    elevation: 3,
  },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontWeight: "bold", color: "#333", fontSize: 14 },
  cardSubtitle: { fontSize: 12, color: "#666" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAll: { color: "#20B2AA", fontWeight: "600" },
  destCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    width: 160,
    elevation: 2,
    overflow: "hidden",
  },
  destImage: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 24 },
  priceTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  price: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  destInfo: { padding: 10 },
  destName: { fontWeight: "bold", fontSize: 14, color: "#333" },
  destLocation: { fontSize: 12, color: "#666" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { fontSize: 12, color: "#333", marginLeft: 4 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  statsCard: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
  },
  statsNumber: { fontSize: 20, fontWeight: "bold", color: "#20B2AA" },
  statsLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
});
