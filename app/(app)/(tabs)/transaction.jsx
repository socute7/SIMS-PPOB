import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function TransactionScreen() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [balance, setBalance] = useState(0);
  const limit = 5;

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

  const fetchTransactions = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.status === 0) {
        const newRecords = data.data.records;

        if (newRecords.length < limit) {
          setHasMore(false);
        }

        if (offset === 0) {
          setTransactions(newRecords);
        } else {
          setTransactions((prev) => [...prev, ...newRecords]);
        }
      }
    } catch (error) {
      console.error("Fetch transactions error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        await Promise.all([fetchBalance(), fetchTransactions()]);
      };

      refreshData();
    }, [])
  );

  useEffect(() => {
    fetchTransactions();
  }, [offset]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setOffset(offset + limit);
    }
  };

  const getTransactionIcon = (type) => {
    return type === "TOPUP" ? "+" : "-";
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.leftContent}>
        <Text
          style={[
            styles.transactionAmount,
            item.transaction_type === "TOPUP"
              ? styles.amountPositive
              : styles.amountNegative,
          ]}
        >
          {getTransactionIcon(item.transaction_type)} Rp
          {item.total_amount.toLocaleString()}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.created_on).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          WIB
        </Text>
      </View>
      <Text style={styles.transactionType}>
        {item.transaction_type === "TOPUP"
          ? "Top Up Saldo"
          : item.transaction_type === "PAYMENT"
          ? "Listrik Pascabayar"
          : "Pulsa Prabayar"}
      </Text>
    </View>
  );

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
        <Text style={styles.title}>Transaksi</Text>
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

      <Text style={styles.sectionTitle}>Transaksi</Text>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.invoice_number}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <>
            {isLoading && <Text style={styles.loading}>Loading...</Text>}
            {!isLoading && hasMore && transactions.length > 0 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleLoadMore}
              >
                <Text style={styles.showMoreText}>Show more</Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyText}>No transactions found</Text>
          )
        }
      />
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
  balanceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
    color: "#000",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftContent: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  amountPositive: {
    color: "#4CAF50",
  },
  amountNegative: {
    color: "#FF0000",
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionType: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    marginLeft: 16,
  },
  showMoreButton: {
    alignItems: "center",
    padding: 16,
  },
  showMoreText: {
    color: "#FF0000",
    fontSize: 14,
  },
  loading: {
    textAlign: "center",
    padding: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 16,
  },
});
