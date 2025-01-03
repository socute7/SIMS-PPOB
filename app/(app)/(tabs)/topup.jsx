import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

const NOMINAL_OPTIONS = [10000, 20000, 50000, 100000, 250000, 500000];

export default function TopUpScreen() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchBalance();
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

  const handleTopUp = async () => {
    if (!amount || parseInt(amount) < 10000 || parseInt(amount) > 1000000) {
      Alert.alert(
        "Error",
        "Nominal top up harus antara Rp 10.000 - Rp 1.000.000"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/topup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ top_up_amount: parseInt(amount) }),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);
      if (data.status === 0) {
        Alert.alert("Success", "Top up berhasil");
        setAmount("");
        fetchBalance();
      } else {
        Alert.alert("Error", data.message || "Top up gagal");
      }
    } catch (error) {
      console.error("Top up error:", error);
      Alert.alert("Error", "Gagal melakukan top up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(app)/home")}
        >
          <Feather name="arrow-left" size={24} color="black" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Top Up</Text>
        <View style={styles.headerRight} />
      </View>

      <ImageBackground
        source={require("../../../assets/images/Background Saldo.png")}
        style={styles.balanceCard}
        resizeMode="cover"
      >
        <Text style={styles.balanceLabel}>Saldo anda</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            Rp {balance.toLocaleString()}
          </Text>
        </View>
      </ImageBackground>

      <Text style={styles.title1}>Silahkan masukan</Text>
      <Text style={styles.title2}>nominal Top Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan nominal Top Up"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!isLoading}
      />

      <View style={styles.nominalGrid}>
        {NOMINAL_OPTIONS.map((nominal) => (
          <TouchableOpacity
            key={nominal}
            style={styles.nominalItem}
            onPress={() => setAmount(nominal.toString())}
            disabled={isLoading}
          >
            <Text style={styles.nominalText}>
              Rp {nominal.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.topupButton,
          (!amount || isLoading) && styles.topupButtonDisabled,
        ]}
        onPress={handleTopUp}
        disabled={!amount || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Processing..." : "Top Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerRight: {
    width: 70,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  nominalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nominalItem: {
    width: "32%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  nominalText: {
    color: "#000",
    fontSize: 14,
  },
  topupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#f00",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  topupButtonDisabled: {
    backgroundColor: "#ffcccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceCard: {
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
    height: 120,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title1: {
    fontSize: 18,
    alignItems: "center",
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    alignItems: "center",
    marginBottom: 40,
  },
});
