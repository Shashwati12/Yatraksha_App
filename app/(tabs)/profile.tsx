import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  CreditCard,
  Users,
  Shield,
  Heart,
  Smartphone,
  Settings,
  Plus,
  ChevronRight,
  Edit3,
  X,
} from "lucide-react-native";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    idType: "Aadhar",
    verificationStatus: "Not Verified",
    emergencyContacts: [],
    healthConditions: [],
    medicalAllergies: [],
    bloodGroup: "",
    deviceIntegration: { iotDevices: false, locationServices: true, emergencyRecording: true },
    privacyConsent: { eFirGeneration: false, dataSharing: "Emergency Only", locationTracking: true },
  });

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("userProfile");
      if (saved) setProfile(JSON.parse(saved));
    })();
  }, []);

  const renderProfileCard = (emoji, title, icon, items, onPress) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {React.createElement(icon, { size: 20, color: "#008080" })}
          <Text style={styles.cardTitle}>
            {emoji} {title}
          </Text>
        </View>
        <ChevronRight size={20} color="#999" />
      </View>
      {items.map((item, idx) => (
        <View key={idx} style={styles.cardItem}>
          <Text style={styles.cardItemLabel}>{item.label}</Text>
          <Text style={styles.cardItemValue}>{item.value}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17A2B8" />

      {/* Gradient Header */}
      <LinearGradient colors={["#17A2B8", "#20B2AA"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <User size={32} color="white" />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {profile.name || "Explorer"} 👋
            </Text>
            <Text style={styles.headerSubtitle}>
              {profile.email || "Add your details"}
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Settings size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileCard("👤", "Basic Info", User, [
          { label: "Name", value: profile.name || "Not provided" },
          { label: "Email", value: profile.email || "Not provided" },
          { label: "Phone", value: profile.phone || "Not provided" },
        ])}

        {renderProfileCard("🪪", "Identity", CreditCard, [
          { label: "Type", value: profile.idType },
          { label: "Status", value: profile.verificationStatus },
        ])}

        {/* Emergency Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Users size={20} color="#008080" />
              <Text style={styles.cardTitle}>🚨 Emergency Contacts</Text>
            </View>
            <TouchableOpacity>
              <Plus size={20} color="#008080" />
            </TouchableOpacity>
          </View>
          {profile.emergencyContacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No contacts added</Text>
            </View>
          ) : (
            profile.emergencyContacts.map((c, idx) => (
              <View key={idx} style={styles.contactItem}>
                <View>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactRelation}>{c.relation}</Text>
                  <Text style={styles.contactPhone}>{c.phone}</Text>
                </View>
                <TouchableOpacity>
                  <Edit3 size={18} color="#008080" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {renderProfileCard("❤️", "Health", Heart, [
          { label: "Blood Group", value: profile.bloodGroup || "Not specified" },
          { label: "Conditions", value: profile.healthConditions?.length || "None" },
          { label: "Allergies", value: profile.medicalAllergies?.length || "None" },
        ])}

        {renderProfileCard("📱", "Device", Smartphone, [
          { label: "IoT Devices", value: profile.deviceIntegration?.iotDevices ? "Connected" : "Off" },
          { label: "Location", value: profile.deviceIntegration?.locationServices ? "On" : "Off" },
          { label: "Recording", value: profile.deviceIntegration?.emergencyRecording ? "On" : "Off" },
        ])}

        {renderProfileCard("🛡️", "Privacy", Shield, [
          { label: "E-FIR", value: profile.privacyConsent?.eFirGeneration ? "Enabled" : "Disabled" },
          { label: "Data Sharing", value: profile.privacyConsent?.dataSharing },
          { label: "Location Tracking", value: profile.privacyConsent?.locationTracking ? "Active" : "Inactive" },
        ])}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFC" },
  header: {
    height: 160,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#008080",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "white" },
  headerSubtitle: { fontSize: 14, color: "white", opacity: 0.9 },
  settingsBtn: { marginLeft: "auto", padding: 8 },
  content: { flex: 1, padding: 16, marginTop: -20 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginLeft: 10, color: "#333" },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardItemLabel: { fontSize: 14, color: "#666" },
  cardItemValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  emptyState: { padding: 16, alignItems: "center" },
  emptyStateText: { color: "#888" },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F8F8F8",
  },
  contactName: { fontSize: 16, fontWeight: "600", color: "#333" },
  contactRelation: { fontSize: 12, color: "#008080" },
  contactPhone: { fontSize: 14, color: "#666" },
});
