import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import FallBackProfileImage from "../../../../assets/images/profile-circle.1023x1024.png";
import { Pen } from "lucide-react-native";
import {
  getRestaurant,
  handleRestaurantProfileUpdate,
  handleRestaurantUpdate,
} from "@/services/restaurantOperations";
import Toast from "react-native-toast-message";

export default function Accounts() {
  const { id, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant.restaurant);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...restaurant });
  const [editedForm, setEditedForm] = useState({ ...restaurant });
  const [showImageModal, setShowImageModal] = useState(false);
  const [newProfileImageURL, setNewProfileImageURL] = useState(
    restaurant.profileImageURL
  );
  const [refreshing, setRefreshing] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const handleEditedFormChange = (field, value) => {
    setEditedForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getRestaurant(token, dispatch);
    setForm({ ...restaurant });
    setEditedForm({ ...restaurant });
    setRefreshing(false);
  };

  const handleImageUpload = async () => {
    const response = await handleRestaurantProfileUpdate(
      id,
      token,
      newProfileImageURL,
      dispatch
    );
    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Profile Image updated successfully",
      });
      setIsEditing(false);
      setForm(editedForm);
    } else {
      Toast.show({
        type: "error",
        text1: "Error updating restaurant",
      });
    }
  };

  const saveChanges = async () => {
    const response = await handleRestaurantUpdate(
      id,
      token,
      editedForm,
      dispatch
    );
    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Restaurant updated successfully",
      });
      setIsEditing(false);
      setForm(editedForm);
    } else {
      Toast.show({
        type: "error",
        text1: "Error updating restaurant",
      });
    }
  };

  const Delete = () => {
    // logic to delete the restaurant
  };

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Accounts</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={() => setIsImageFullscreen(true)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Image
                source={
                  restaurant.image
                    ? { uri: restaurant.image }
                    : FallBackProfileImage
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => [setShowImageModal(true)]}
              style={styles.penContainer}
            >
              <Pen size={hp("1.8%")} color={"#fff"} />
            </TouchableOpacity>
          </View>
          <Modal visible={showImageModal} transparent>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: wp("5%"),
                  width: "85%",
                  borderRadius: wp("2%"),
                }}
              >
                <Text style={styles.profileModalLabel}>
                  Enter Profile Image URL:
                </Text>
                <TextInput
                  value={newProfileImageURL}
                  onChangeText={setNewProfileImageURL}
                  style={styles.profileModalInput}
                  placeholder="Enter URL . . ."
                  placeholderTextColor={"#ccc"}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: hp("2%"),
                  }}
                >
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={async () => {
                      await handleImageUpload();
                      setEditedForm({
                        ...editedForm,
                        image: newProfileImageURL,
                      });
                      setNewProfileImageURL("");
                      setShowImageModal(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "grey" }]}
                    onPress={() => {
                      setShowImageModal(false);
                      setNewProfileImageURL("");
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={isImageFullscreen} transparent>
            <TouchableOpacity
              style={styles.fullscreenImageBackdrop}
              onPress={() => setIsImageFullscreen(false)}
            >
              <Image
                source={
                  restaurant.image
                    ? { uri: restaurant.image }
                    : FallBackProfileImage
                }
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Modal>
          <View style={styles.form}>
            {[
              "name",
              "email",
              "phone",
              "ownerName",
              "city",
              "state",
              "pincode",
              "gstin",
              "pan",
              "fssai",
            ].map((key) => (
              <View key={key} style={{ marginBottom: 10 }}>
                <Text style={styles.formLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <TextInput
                  editable={isEditing}
                  value={editedForm[key]}
                  onChangeText={(text) => handleEditedFormChange(key, text)}
                  style={[
                    styles.formInput,
                    !isEditing && styles.formInputDisabled,
                  ]}
                />
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  saveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.buttonText}>
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={Delete}
              style={[styles.button, { backgroundColor: "red" }]}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp("3.5%"),
  },
  logoText: {
    fontFamily: "Montserrat-Bold",
    fontSize: hp("3.7%"),
    color: colors.text1,
  },
  seperator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: hp("1%"),
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: hp("2%"),
    borderColor: colors.primary,
    borderWidth: hp("0.2%"),
    width: wp("32%"),
    height: wp("32%"),
    borderRadius: wp("25%"),
    padding: wp("0.6%"),
    position: "relative",
    alignSelf: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: wp("25%"),
  },
  penContainer: {
    position: "absolute",
    bottom: hp("1%"),
    right: wp("-1%"),
    backgroundColor: "#333",
    borderRadius: wp("1000%"),
    padding: wp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
  },
  formLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: colors.text1,
    marginBottom: hp("0.5%"),
  },
  formInput: {
    fontFamily: "Montserrat-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: hp("1.7%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
  },
  formInputDisabled: {
    backgroundColor: "#eee",
  },
  button: {
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("2%"),
  },
  buttonText: {
    fontSize: wp("3.8%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
  profileModalLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: wp("4%"),
    fontWeight: "600",
    color: colors.text1,
    marginBottom: hp("2%"),
  },
  profileModalInput: {
    fontFamily: "Montserrat-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: hp("1.7%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
    marginBottom: hp("0.2%"),
  },
  fullscreenImageBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
});
