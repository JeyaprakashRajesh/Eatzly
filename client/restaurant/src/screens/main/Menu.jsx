import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControlBase,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ArrowDownUp, Plus, Search, X } from "lucide-react-native";
import {
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import VegIcon from "../../../assets/icons/veg-icon.png";
import NonVegIcon from "../../../assets/icons/nonveg-icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAddMenuItem,
  handleDeleteMenuItem,
  handleGetAllMenus,
  handleUpdateMenuItem,
} from "@/services/restaurantOperations";
import Toast from "react-native-toast-message";

export default function Menu() {
  const dispatch = useDispatch();
  const { id, token } = useSelector((state) => state.auth);
  const menus = useSelector((state) => state.restaurant.menus);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editItemInput, setEditItemInput] = useState({
    name: "",
    price: "",
    type: "",
    category: "",
    image: "",
  });

  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    type: "",
    category: "",
    image: "",
  });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Starters", value: "starters" },
    { label: "Main Course", value: "main_course" },
    { label: "Desserts", value: "desserts" },
    { label: "Drinks", value: "drinks" },
    { label: "Combos", value: "combos" },
    { label: "Breakfast", value: "breakfast" },
  ]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeItems, setTypeItems] = useState([
    { label: "Veg", value: "veg" },
    { label: "Non-Veg", value: "non-veg" },
  ]);

  const fetchAllMenus = async () => {
    try {
      await handleGetAllMenus(id, token, dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItemInput({
      name: item.name || "",
      price: item.price?.toString() || "",
      type: item.type || "",
      category: item.category || "",
      image: item.image || "",
    });
    setEditModalVisible(true);
  };

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const addMenuItem = async () => {
    const response = await handleAddMenuItem(id, token, menuItem, dispatch);
    if (response?.success) {
      Toast.show({
        type: "success",
        text1: "Menu Item Added Successfully",
      });
      setModalVisible(false);
      setMenuItem({
        name: "",
        price: "",
        type: "",
        category: "",
        image: "",
      });
      setCategoryOpen(false);
      fetchAllMenus();
    } else {
      Toast.show({
        type: "error",
        text1: "Error adding menu item",
      });
      console.log(response.message);
    }
  };

  const updateMenuItem = async (e) => {
    const mid = editingItem._id;
    const response = await handleUpdateMenuItem(
      id,
      token,
      mid,
      editItemInput,
      dispatch
    );
    if (response?.success) {
      Toast.show({
        type: "success",
        text1: "Menu Item Updated Successfully",
      });
      setEditModalVisible(false);
      setEditingItem(null);
      fetchAllMenus();
    } else {
      Toast.show({
        type: "error",
        text1: "Error updating menu item",
      });
      console.log(response.message);
    }
  };

  const deleteMenuItem = async (mid) => {
    const response = await handleDeleteMenuItem(id, token, mid, dispatch);
    if (response?.success) {
      Toast.show({
        type: "success",
        text1: "Menu Item Deleted Successfully",
      });
      fetchAllMenus();
      setEditModalVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Error deleting menu item",
      });
      console.log(response.message);
    }
  };

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Menu</Text>
      </View>
      <View style={styles.seperator}></View>
      <View style={styles.content}>
        <View style={styles.topActions}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu . . ."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <Search
              style={{
                position: "absolute",
                left: wp("3.5%"),
                top: "27%",
              }}
              size={hp("2.7%")}
              color={"#ccc"}
            />
          </View>
          <View>
            <ArrowDownUp size={hp("3%")} color={"#626262"} />
          </View>
        </View>
        <FlatList
          key={`flatlist-${2}`}
          data={menus?.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.price.toString().includes(searchQuery)
          )}
          style={{
            marginTop: hp("1.5%"),
          }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                fetchAllMenus();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListEmptyComponent={
            <View style={{ marginTop: hp("25%"), alignSelf: "center" }}>
              <Text
                style={{
                  fontSize: hp("2%"),
                  fontFamily: "Montserrat-MediumItalic",
                  color: "#ccc",
                }}
              >
                No Menus Found
              </Text>
            </View>
          }
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuCard}>
              <Image
                source={{
                  uri:
                    item?.image?.trim() !== ""
                      ? item.image
                      : "https://placehold.co/600x400.png?text=No%20Image&font=montserrat",
                }}
                style={styles.menuImage}
                resizeMode="cover"
              />
              <View style={styles.row}>
                <Text style={styles.menuTitle}>{item.name}</Text>
                <Image
                  style={styles.menuTypeIcon}
                  source={item.type === "veg" ? VegIcon : NonVegIcon}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.edit} onPress={() => handleEditItem(item)}>
                  View
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={hp("3.5%")} color={"#fff"} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.addMenuItemContainer}>
          <View style={styles.addMenuItemHeader}>
            <Text style={styles.addMenuItemHeaderText}>Add Menu Item</Text>
            <X
              onPress={() => {
                setModalVisible(false);
                setMenuItem({
                  name: "",
                  price: "",
                  type: "",
                  category: "",
                  image: "",
                });
                setCategoryOpen(false);
              }}
              size={hp("3%")}
              color={"#626262"}
            />
          </View>
          <View style={styles.addMenuItemContent}>
            <View style={styles.addMenuItemInputContainer}>
              <Text style={styles.addMenuItemInputLabel}>Name</Text>
              <TextInput
                style={styles.addMenuItemInput}
                placeholder="Enter menu item name . . ."
                value={menuItem.name}
                onChangeText={(text) =>
                  setMenuItem({ ...menuItem, name: text })
                }
                placeholderTextColor={"#ccc"}
              />
            </View>

            <View style={styles.addMenuItemInputContainer}>
              <Text style={styles.addMenuItemInputLabel}>Price</Text>
              <TextInput
                style={styles.addMenuItemInput}
                placeholder="Enter menu item price . . ."
                value={menuItem.price}
                onChangeText={(text) => {
                  if (/^\d*\.?\d*$/.test(text)) {
                    setMenuItem({ ...menuItem, price: text });
                  }
                }}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholderTextColor={"#ccc"}
              />
            </View>

            <View style={styles.addMenuItemInputContainer}>
              <Text style={styles.addMenuItemInputLabel}>Type</Text>
              <DropDownPicker
                placeholder="Select Type"
                zIndex={2}
                open={typeOpen}
                value={menuItem.type}
                items={typeItems}
                setOpen={setTypeOpen}
                setValue={(callback) =>
                  setMenuItem((prev) => ({
                    ...prev,
                    type: callback(prev.type),
                  }))
                }
                setItems={setTypeItems}
                style={{
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  backgroundColor: "#f2f2f2",
                  borderWidth: 0,
                }}
                textStyle={{
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  color: "#333",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#f2f2f2",
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  borderColor: "#ccc",
                }}
                placeholderStyle={{
                  color: "#ccc",
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                }}
              />
            </View>

            <View style={styles.addMenuItemInputContainer}>
              <Text style={styles.addMenuItemInputLabel}>Category</Text>
              <DropDownPicker
                placeholder="Select Category"
                zIndex={1}
                open={categoryOpen}
                value={menuItem.category}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={(callback) =>
                  setMenuItem((prev) => ({
                    ...prev,
                    category: callback(prev.category),
                  }))
                }
                setItems={setCategoryItems}
                style={{
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  backgroundColor: "#f2f2f2",
                  borderWidth: 0,
                }}
                textStyle={{
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  color: "#333",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#f2f2f2",
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                  borderColor: "#ccc",
                }}
                placeholderStyle={{
                  color: "#ccc",
                  fontSize: hp("1.8%"),
                  fontFamily: "Montserrat-Medium",
                }}
              />
            </View>

            <View style={styles.addMenuItemInputContainer}>
              <Text style={styles.addMenuItemInputLabel}>Image</Text>
              <TextInput
                style={styles.addMenuItemInput}
                placeholder="Enter menu item image link . . ."
                value={menuItem.image}
                onChangeText={(text) =>
                  setMenuItem({ ...menuItem, image: text })
                }
                placeholderTextColor={"#ccc"}
              />
            </View>
            <TouchableOpacity
              style={styles.addMenuItemButton}
              onPress={addMenuItem}
            >
              <Text style={styles.addMenuItemButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.addMenuItemContainer}>
          <View style={styles.addMenuItemHeader}>
            <Text style={styles.addMenuItemHeaderText}>Edit Menu Item</Text>
            <X
              onPress={() => {
                setEditModalVisible(false);
                setEditingItem(null);
                setEditItemInput({
                  name: "",
                  price: "",
                  type: "",
                  category: "",
                  image: "",
                });
              }}
              size={hp("3%")}
              color={"#626262"}
            />
          </View>
          {editModalVisible && (
            <View style={styles.addMenuItemContent}>
              <View style={styles.addMenuItemInputContainer}>
                <Text style={styles.addMenuItemInputLabel}>Name</Text>
                <TextInput
                  style={styles.addMenuItemInput}
                  value={editItemInput.name}
                  onChangeText={(text) =>
                    setEditItemInput((prev) => ({ ...prev, name: text }))
                  }
                  placeholderTextColor={"#ccc"}
                />
              </View>
              <View style={styles.addMenuItemInputContainer}>
                <Text style={styles.addMenuItemInputLabel}>Price</Text>
                <TextInput
                  style={styles.addMenuItemInput}
                  value={editItemInput.price}
                  onChangeText={(text) => {
                    if (/^\d*\.?\d*$/.test(text)) {
                      setEditItemInput((prev) => ({ ...prev, price: text }));
                    }
                  }}
                  keyboardType="numeric"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholderTextColor={"#ccc"}
                />
              </View>
              <View style={styles.addMenuItemInputContainer}>
                <Text style={styles.addMenuItemInputLabel}>Type</Text>
                <DropDownPicker
                  placeholder="Select Type"
                  zIndex={2}
                  open={typeOpen}
                  value={editItemInput.type}
                  items={typeItems}
                  setOpen={setTypeOpen}
                  setValue={(callback) =>
                    setEditItemInput((prev) => ({
                      ...prev,
                      type: callback(prev.type),
                    }))
                  }
                  setItems={setTypeItems}
                  style={[
                    styles.addMenuItemInput,
                    {
                      borderWidth: 0,
                    },
                  ]}
                  textStyle={{
                    fontSize: hp("1.8%"),
                    fontFamily: "Montserrat-Medium",
                    color: "#333",
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: "#f2f2f2",
                    borderColor: "#ccc",
                  }}
                  placeholderStyle={{
                    color: "#ccc",
                    fontSize: hp("1.8%"),
                    fontFamily: "Montserrat-Medium",
                  }}
                />
              </View>
              <View style={styles.addMenuItemInputContainer}>
                <Text style={styles.addMenuItemInputLabel}>Category</Text>
                <DropDownPicker
                  placeholder="Select Category"
                  zIndex={1}
                  open={categoryOpen}
                  value={editItemInput.category}
                  items={categoryItems}
                  setOpen={setCategoryOpen}
                  setValue={(callback) =>
                    setEditItemInput((prev) => ({
                      ...prev,
                      category: callback(prev.category),
                    }))
                  }
                  setItems={setCategoryItems}
                  style={[
                    styles.addMenuItemInput,
                    {
                      borderWidth: 0,
                    },
                  ]}
                  textStyle={{
                    fontSize: hp("1.8%"),
                    fontFamily: "Montserrat-Medium",
                    color: "#333",
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: "#f2f2f2",
                    borderColor: "#ccc",
                  }}
                  placeholderStyle={{
                    color: "#ccc",
                    fontSize: hp("1.8%"),
                    fontFamily: "Montserrat-Medium",
                  }}
                />
              </View>
              <View style={styles.addMenuItemInputContainer}>
                <Text style={styles.addMenuItemInputLabel}>Image</Text>
                <TextInput
                  style={styles.addMenuItemInput}
                  value={editItemInput.image}
                  onChangeText={(text) =>
                    setEditItemInput((prev) => ({ ...prev, image: text }))
                  }
                  placeholder="Enter image URL"
                  placeholderTextColor={"#ccc"}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: wp("5%"),
                }}
              >
                <TouchableOpacity
                  style={styles.addMenuItemButton}
                  onPress={() => {
                    updateMenuItem(editingItem);
                  }}
                >
                  <Text style={styles.addMenuItemButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addMenuItemButton,
                    { backgroundColor: "#ff6347" },
                  ]}
                  onPress={() => {
                    deleteMenuItem(editingItem._id);
                  }}
                >
                  <Text style={styles.addMenuItemButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
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
    fontFamily: "BalooBhaijaan2-Bold",
    fontSize: hp("3.7%"),
    color: colors.text1,
  },
  seperator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: hp("1%"),
    opacity: 0.3,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginBottom: hp("1%"),
    gap: wp("5%"),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchInput: {
    fontSize: hp("1.9%"),
    fontFamily: "Montserrat-Medium",
    color: "#333",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: hp("1%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.8%"),
    flex: 1,
    paddingLeft: wp("12%"),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1%"),
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: hp("2%"),
    overflow: "hidden",
    marginBottom: hp("2%"),
    width: "48%",
    elevation: 2,
  },
  menuImage: {
    width: "100%",
    height: hp("15%"),
    borderTopLeftRadius: hp("1%"),
    borderTopRightRadius: hp("1%"),
    marginBottom: hp("2%"),
  },
  menuTitle: {
    fontSize: hp("1.7%"),
    fontFamily: "Montserrat-SemiBold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: hp("1%"),
    width: "100%",
  },
  price: {
    fontSize: hp("1.7%"),
    color: "#000",
    fontFamily: "Montserrat-Medium",
  },
  edit: {
    fontSize: hp("1.7%"),
    color: "#27A8A8",
    fontFamily: "Montserrat-SemiBold",
  },
  image: {
    flex: 1,
    borderRadius: hp("1%"),
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: hp("1%"),
    marginBottom: hp("1%"),
    overflow: "hidden",
    elevation: 2,
  },
  menuItemImage: {
    width: wp("25%"),
    height: hp("12%"),
    overflow: "hidden",
  },
  menuItemInfo: {
    flex: 1,
    paddingHorizontal: wp("3%"),
    justifyContent: "center",
  },
  menuItemText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.9%"),
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  menuTypeIcon: {
    width: wp("4%"),
    height: hp("4%"),
    aspectRatio: 1,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: hp("2%"),
    right: wp("3.5%"),
    backgroundColor: "#27A8A8",
    width: hp("7%"),
    height: hp("7%"),
    borderRadius: hp("100%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  addMenuItemContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  addMenuItemHeader: {
    backgroundColor: "#fff",
    width: "100%",
    padding: hp("2%"),
    borderTopLeftRadius: hp("1.5%"),
    borderTopRightRadius: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addMenuItemHeaderText: {
    fontFamily: "Montserrat-Bold",
    fontSize: hp("2.3%"),
    color: "#000",
  },
  addMenuItemContent: {
    backgroundColor: "#fff",
    width: "100%",
    padding: hp("2.5%"),
    borderBottomLeftRadius: hp("1.5%"),
    borderBottomRightRadius: hp("1.5%"),
    justifyContent: "space-between",
  },
  addMenuItemInputContainer: {
    marginBottom: hp("2.5%"),
  },
  addMenuItemInputLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.9%"),
    color: "#000",
    marginBottom: hp("1.2%"),
  },
  addMenuItemInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: hp("1%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-Medium",
    color: "#333",
  },
  addMenuItemButton: {
    backgroundColor: "#27A8A8",
    borderRadius: hp("1%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    fontSize: hp("1.8%"),
    fontFamily: "Montserrat-Medium",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
    flex: 1,
  },
  addMenuItemButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: hp("1.8%"),
    color: "#fff",
  },
});
