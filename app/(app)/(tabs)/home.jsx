import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchBalance();
    fetchServices();
    fetchBanners();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProfile(data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setBalance(data.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/banner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setBanners(data.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        await Promise.all([
          fetchProfile(),
          fetchBalance(),
          fetchServices(),
          fetchBanners(),
        ]);
      };

      refreshData();
    }, [])
  );

  const renderBanner = ({ item }) => {
    return (
      <View style={styles.bannerItem}>
        <Image
          source={{ uri: item.banner_image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Logo and Profile Section */}
        <View style={styles.topBar}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>SIMS PPOB</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
            <Image
              source={
                profile?.profile_image
                  ? { uri: profile.profile_image }
                  : require("../../../assets/images/Profile Photo-1.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Selamat datang,</Text>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
        </View>

        {/* Balance Card */}
        <ImageBackground
          source={require("../../../assets/images/Background Saldo.png")}
          style={styles.balanceCard}
          resizeMode="cover"
        >
          <Text style={styles.balanceLabel}>Saldo anda</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              Rp {showBalance ? balance.toLocaleString() : "• • • • • • •"}
            </Text>
            <TouchableOpacity
              style={styles.showBalanceButton}
              onPress={() => setShowBalance(!showBalance)}
            >
              <Text style={styles.showBalanceText}>Lihat saldo</Text>
              <Feather
                name={showBalance ? "eye" : "eye-off"}
                size={14}
                color="white"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.service_code}
              style={styles.serviceItem}
              onPress={() =>
                router.push(`/(app)/payment/${service.service_code}`)
              }
            >
              <Image
                source={{ uri: service.service_icon }}
                style={styles.serviceIcon}
              />
              <Text style={styles.serviceText}>{service.service_name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.bannerText}>Temukan promo menarik</Text>
        <View style={styles.bannerSection}>
          <Carousel
            loop
            width={screenWidth - 40}
            height={150}
            autoPlay={true}
            data={banners}
            scrollAnimationDuration={1000}
            renderItem={renderBanner}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    color: "#666",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  balanceCard: {
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  showBalanceButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  showBalanceText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
  },
  eyeIcon: {
    marginLeft: 4,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  serviceItem: {
    width: "16%",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 2,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 10,
    textAlign: "center",
    color: "#000",
  },
  bannerSection: {
    height: 150,
    marginBottom: 20,
  },
  bannerItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  welcomeSection: {
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
});
