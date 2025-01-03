import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setSubmitted(true);
    setIsLoading(true);
    let isValid = true;

    // Basic validation
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (isValid) {
      try {
        const response = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/registration",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (data.message?.toLowerCase().includes("berhasil")) {
          Alert.alert("Success", data.message, [
            {
              text: "OK",
              onPress: () => router.push("/(auth)"),
            },
          ]);
        } else {
          throw new Error(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration failed:", error);
        Alert.alert(
          "Registration Failed",
          error.message || "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const getPlaceholder = (field) => {
    if (submitted && !formData[field]) {
      return "This field is required";
    }
    return field === "email"
      ? "masukan email anda"
      : field === "firstName"
      ? "nama depan"
      : field === "lastName"
      ? "nama belakang"
      : field === "password"
      ? "buat password"
      : field === "confirmPassword"
      ? "konfirmasi password"
      : "";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/Logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>SIMS PPOB</Text>
            </View>

            <Text style={styles.title1}>Lengkapi data untuk</Text>
            <Text style={styles.title2}>membuat akun</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="at-outline"
                size={24}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder("email")}
                placeholderTextColor={
                  submitted && !formData.email ? "red" : "gray"
                }
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder("firstName")}
                placeholderTextColor={
                  submitted && !formData.firstName ? "red" : "gray"
                }
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder("lastName")}
                placeholderTextColor={
                  submitted && !formData.lastName ? "red" : "gray"
                }
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder("password")}
                placeholderTextColor={
                  submitted && !formData.password ? "red" : "gray"
                }
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.iconButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder("confirmPassword")}
                placeholderTextColor={
                  submitted && !formData.confirmPassword ? "red" : "gray"
                }
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.iconButton}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Sedang Memuat" : "Registrasi"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.loginContainer}
            >
              <Text style={styles.textBlack}>Sudah punya akun? login</Text>
              <Text style={styles.textRed}> di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  title2: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#f00",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  textRed: {
    color: "red",
    fontWeight: "bold",
  },
  textBlack: {
    color: "black",
  },
});
