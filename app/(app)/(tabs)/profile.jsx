import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { logout } from "../../../slices/authSlice";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
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
      if (data.status === 0) {
        const profileData = {
          firstName: data.data.first_name,
          lastName: data.data.last_name,
          email: data.data.email,
          profileImage: data.data.profile_image,
        };
        setProfile(profileData);
        setEditForm(profileData);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Alert.alert("Error", "Failed to fetch profile data");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "photo.jpg",
        });

        console.log("Uploading image...");
        console.log("FormData:", formData);

        const uploadResponse = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/profile/image",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: formData,
          }
        );

        console.log("Upload response status:", uploadResponse.status);
        const responseData = await uploadResponse.json();
        console.log("Upload response:", responseData);

        if (uploadResponse.ok) {
          fetchProfile();
          Alert.alert("Success", "Foto profil berhasil diupdate");
        } else {
          Alert.alert("Error", responseData.message || "Gagal mengupload foto");
        }
      }
    } catch (error) {
      console.error("Detail error:", error);
      Alert.alert(
        "Error",
        "Gagal mengupload foto. Pastikan ukuran foto dibawah 100KB"
      );
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: editForm.email,
            first_name: editForm.firstName,
            last_name: editForm.lastName,
          }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        await fetchProfile();
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(app)/home")}
        >
          <Feather name="arrow-left" size={24} color="black" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Akun</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image
              key={profile.profileImage}
              source={
                profile.profileImage
                  ? {
                      uri:
                        profile.profileImage +
                        "?timestamp=" +
                        new Date().getTime(),
                      cache: "reload",
                    }
                  : require("../../../assets/images/Profile Photo-1.png")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={pickImage}
            >
              <Feather name="edit-2" size={16} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={isEditing ? editForm.email : profile.email}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, email: text }))
              }
              editable={isEditing}
              placeholder="Email"
            />
          </View>

          <Text style={styles.label}>Nama Depan</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={isEditing ? editForm.firstName : profile.firstName}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, firstName: text }))
              }
              editable={isEditing}
              placeholder="Nama Depan"
            />
          </View>

          <Text style={styles.label}>Nama Belakang</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={isEditing ? editForm.lastName : profile.lastName}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, lastName: text }))
              }
              editable={isEditing}
              placeholder="Nama Belakang"
            />
          </View>

          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelText}>Batalkan</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleStartEdit}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  formSection: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  editButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#666",
    marginTop: 12,
  },
  buttonText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    marginTop: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
