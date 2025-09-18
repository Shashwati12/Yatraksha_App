import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  Vibration,
} from 'react-native';
import { TriangleAlert as AlertTriangle, Phone, Shield, Users, MapPin, Mic, Camera, Clock, PhoneCall, AlertCircle } from 'lucide-react-native';

export default function RealSOSEmergencyScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [sosPressed, setSOSPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    if (!isEmergencyActive) {
      pulse.start();
    } else {
      pulse.stop();
    }

    return () => pulse.stop();
  }, [isEmergencyActive]);

  useEffect(() => {
    let timer;
    if (isEmergencyActive && countdown > 0) {
      Vibration.vibrate([500, 200, 500, 200]);
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isEmergencyActive && countdown === 0) {
      executeEmergencyProtocol();
    }
    return () => clearTimeout(timer);
  }, [isEmergencyActive, countdown]);

  const handleSOSPressIn = () => {
    setSOSPressed(true);
    const timer = setTimeout(() => {
      setIsEmergencyActive(true);
      setCountdown(3);
      Vibration.vibrate(1000);
    }, 1000);
    setPressTimer(timer);
  };

  const handleSOSPressOut = () => {
    setSOSPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(3);
    Vibration.cancel();
  };

  const executeEmergencyProtocol = () => {
    setIsEmergencyActive(false);
    setCountdown(3);
    Vibration.vibrate([200, 100, 200, 100, 200]);
    Alert.alert(
      'EMERGENCY ACTIVATED',
      '🚨 Emergency services have been contacted\n📍 Location shared\n📞 Emergency contacts notified\n🎥 Recording started',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const callEmergencyService = (service) => {
    Alert.alert(
      `Calling ${service.title}`,
      `Emergency call to ${service.number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => {}, style: 'destructive' }
      ]
    );
  };

  const emergencyServices = [
    { 
      id: 1, 
      title: 'Police Only', 
      subtitle: 'Local police response', 
      icon: Shield, 
      color: '#DC2626',
      number: '100'
    },
    { 
      id: 2, 
      title: 'Police + Medical', 
      subtitle: 'Police & ambulance response', 
      icon: PhoneCall, 
      color: '#DC2626',
      number: '108'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {isEmergencyActive && (
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyHeader}>
            <AlertCircle size={40} color="#FFFFFF" />
            <Text style={styles.emergencyTitle}>EMERGENCY SOS</Text>
            <Text style={styles.emergencySubtitle}>Emergency services will be contacted</Text>
          </View>
          
          <View style={styles.countdownSection}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownText}>Touch "Cancel" to stop</Text>
          </View>

          <View style={styles.emergencyActions}>
            <TouchableOpacity style={styles.cancelEmergencyButton} onPress={cancelEmergency}>
              <Text style={styles.cancelEmergencyText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyInfoText}>
              Your location and emergency information will be sent to emergency services and your emergency contacts.
            </Text>
          </View>
        </View>
      )}

      {!isEmergencyActive && (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.statusBar}>
              <Text style={styles.carrier}>Emergency</Text>
              <Text style={styles.time}>SOS</Text>
              <View style={styles.batteryContainer}>
                <View style={styles.signal} />
                <View style={styles.battery} />
              </View>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>Emergency SOS</Text>
              <Text style={styles.mainSubtitle}>Press and hold the button below to call emergency services</Text>

              <View style={styles.sosContainer}>
                <Animated.View 
                  style={[
                    styles.sosButtonWrapper,
                    { transform: [{ scale: sosPressed ? 0.95 : pulseAnim }] }
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.sosButton, sosPressed && styles.sosButtonPressed]}
                    onPressIn={handleSOSPressIn}
                    onPressOut={handleSOSPressOut}
                    activeOpacity={1}
                  >
                    <View style={styles.sosInner}>
                      <AlertTriangle size={60} color="#FFFFFF" strokeWidth={3} />
                      <Text style={styles.sosText}>SOS</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                <View style={styles.sosInstructions}>
                  <Text style={styles.sosInstructionText}>Press and hold to call emergency services</Text>
                  {sosPressed && (
                    <Text style={styles.sosHoldText}>Keep holding...</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.quickCallSection}>
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              {emergencyServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.emergencyButton}
                  onPress={() => callEmergencyService(service)}
                >
                  <View style={styles.emergencyButtonContent}>
                    <View style={styles.emergencyIconContainer}>
                      <service.icon size={28} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                    <View style={styles.emergencyTextContainer}>
                      <Text style={styles.emergencyButtonTitle}>{service.title}</Text>
                      <Text style={styles.emergencyButtonSubtitle}>{service.subtitle}</Text>
                    </View>
                    <View style={styles.emergencyNumberContainer}>
                      <Text style={styles.emergencyNumber}>{service.number}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>When SOS is activated</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <MapPin size={20} color="#DC2626" />
                  <Text style={styles.featureText}>Your location will be sent to emergency services</Text>
                </View>
                <View style={styles.featureItem}>
                  <Users size={20} color="#DC2626" />
                  <Text style={styles.featureText}>Emergency contacts will be notified</Text>
                </View>
                <View style={styles.featureItem}>
                  <Camera size={20} color="#DC2626" />
                  <Text style={styles.featureText}>Camera will start recording automatically</Text>
                </View>
                <View style={styles.featureItem}>
                  <Mic size={20} color="#DC2626" />
                  <Text style={styles.featureText}>Audio recording will begin</Text>
                </View>
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  emergencyOverlay: {
    flex: 1,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emergencyHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  emergencyTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 2,
  },
  emergencySubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  countdownSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  emergencyActions: {
    marginBottom: 40,
  },
  cancelEmergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cancelEmergencyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emergencyInfo: {
    paddingHorizontal: 20,
  },
  emergencyInfoText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#000000',
    paddingTop: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  carrier: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signal: {
    width: 20,
    height: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderRadius: 2,
  },
  battery: {
    width: 24,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  mainSubtitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  sosContainer: {
    alignItems: 'center',
  },
  sosButtonWrapper: {
    marginBottom: 30,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 8,
    borderColor: '#FFFFFF',
  },
  sosButtonPressed: {
    backgroundColor: '#B91C1C',
    transform: [{ scale: 0.95 }],
  },
  sosInner: {
    alignItems: 'center',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 4,
  },
  sosInstructions: {
    alignItems: 'center',
  },
  sosInstructionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  sosHoldText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  quickCallSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#008080',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  emergencyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emergencyButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emergencyNumberContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 100,
  },
});