import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function PaymentScreen() {
  const { serviceCode } = useLocalSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [balance, setBalance] = useState(0);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchBalance();
    fetchServiceInfo();
  }, []);

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

  const fetchServiceInfo = async () => {
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
      const service = data.data.find(
        (service) => service.service_code === serviceCode
      );
      setServiceInfo(service);
    } catch (error) {
      console.error("Failed to fetch service info:", error);
    }
  };

  const handlePayment = async () => {
    if (!serviceInfo?.service_tariff) {
      Alert.alert("Error", "Service tariff not available");
      return;
    }

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/transaction",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_code: serviceCode,
            amount: serviceInfo?.service_tariff,
          }),
        }
      );

      const data = await response.json();

      if (data.status === 0) {
        Alert.alert("Success", "Payment successful!", [
          {
            text: "OK",
            onPress: () => router.push("/(app)"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(app)/home")}
          >
            <Feather name="arrow-left" size={24} color="black" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>PemBayaran</Text>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo anda</Text>
        <Text style={styles.balanceAmount}>Rp {balance.toLocaleString()}</Text>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>PemBayaran</Text>

        {serviceInfo && (
          <View style={styles.serviceInfo}>
            <Image
              source={{ uri: serviceInfo.service_icon }}
              style={styles.serviceIcon}
            />
            <Text style={styles.serviceName}>{serviceInfo.service_name}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={24} color="gray" />
          <Text style={styles.priceText}>
            {serviceInfo?.service_tariff
              ? `${serviceInfo.service_tariff.toLocaleString()}`
              : "Loading..."}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Bayar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftSection: {
    width: 80,
  },
  rightSection: {
    width: 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  backText: {
    marginLeft: 5,
    fontSize: 14,
    color: "black",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  balanceCard: {
    backgroundColor: "#F42619",
    height: 120,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  paymentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: "#F42619",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  priceText: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
  },
});
