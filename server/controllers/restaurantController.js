const Restaurants = require("../models/restaurantScema");
const Menu = require("../models/menuSchema");
const Table = require("../models/tableSchema");

const { generateToken, verifyToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const {
      phone,
      email,
      name,
      ownerName,
      gstin,
      pan,
      fssai,
      city,
      state,
      pincode,
      coordinates,
    } = req.body.formData;

    if (
      !phone ||
      !email ||
      !name ||
      !ownerName ||
      !gstin ||
      !pan ||
      !fssai ||
      !city ||
      !state ||
      !pincode ||
      !coordinates
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in registration",
      });
    }

    const existingRestaurant = await Restaurants.findOne({
      $or: [{ email }, { phone: phone }],
    });

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "A restaurant with this email or phone number already exists",
      });
    }

    const newRestaurant = new Restaurants({
      name,
      phone,
      email,
      ownerName,
      gstin,
      pan,
      fssai,
      city,
      state,
      pincode,
      coordinates,
    });

    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the restaurant",
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log(phone, otp);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const restaurant = await Restaurants.findOne({ phone });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!otp || (Array.isArray(otp) && otp.some((d) => d.trim() === ""))) {
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      restaurant.otp = {
        code: generatedOtp,
        createdAt: new Date(),
      };
      await restaurant.save();

      console.log(`🔐 OTP for ${phone}: ${generatedOtp}`);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. Valid for 5 minutes.",
      });
    }

    const storedOtp = restaurant.otp;

    if (!storedOtp || !storedOtp.code || !storedOtp.createdAt) {
      return res.status(401).json({
        success: false,
        message: "No OTP generated or already used.",
      });
    }

    const currentTime = new Date();
    const otpCreatedTime = new Date(storedOtp.createdAt);
    const otpIsExpired = currentTime - otpCreatedTime > 5 * 60 * 1000;

    if (storedOtp.code !== (Array.isArray(otp) ? otp.join("") : otp)) {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    if (otpIsExpired) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    restaurant.otp = undefined;
    await restaurant.save();

    const token = await generateToken({
      id: restaurant._id,
      role: "restaurant",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      restaurant,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user information provided",
      });
    }

    const restaurant = await Restaurants.findById(user.id).populate({
      path: "reviews.customer",
      select: "username phone",
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant details fetched successfully",
      restaurant,
    });
  } catch (err) {
    console.error("Error fetching restaurant details:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching restaurant details",
    });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const { restaurantId, item } = req.body;

    if (
      !restaurantId ||
      !item ||
      !item.name ||
      !item.price ||
      !item.category ||
      !item.type
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for menu item",
      });
    }

    let menu = await Menu.findOne({ restaurantId });

    if (!menu) {
      menu = new Menu({
        restaurantId,
        items: [item],
      });
    } else {
      menu.items.push(item);
    }

    await menu.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menu,
    });
  } catch (error) {
    console.error("Add Menu Item error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding menu item",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.body;

    if (!restaurantId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId and itemId are required",
      });
    }

    const menu = await Menu.findOne({ restaurantId });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found for the given restaurant",
      });
    }

    const initialLength = menu.items.length;
    menu.items = menu.items.filter((item) => item._id.toString() !== itemId);

    if (menu.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in the menu",
      });
    }

    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      menu,
    });
  } catch (error) {
    console.error("Delete Menu Item error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting menu item",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, itemId, updatedItem } = req.body;

    if (!restaurantId || !itemId || !updatedItem) {
      return res.status(400).json({
        success: false,
        message: "restaurantId, itemId and updated data are required",
      });
    }

    const menu = await Menu.findOne({ restaurantId });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found for the given restaurant",
      });
    }

    const itemIndex = menu.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menu.items[itemIndex] = { ...menu.items[itemIndex]._doc, ...updatedItem };
    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menu,
    });
  } catch (error) {
    console.error("Update Menu Item error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating menu item",
    });
  }
};

const addTable = async (req, res) => {
  try {
    const { restaurantId, tableName, capacity } = req.body;

    if (!restaurantId || !tableName || tableName.length !== 1 || !capacity) {
      return res.status(400).json({
        success: false,
        message:
          "restaurantId, capacity, and a single character tableName are required",
      });
    }

    const existing = await Table.findOne({ restaurantId, tableName });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Table already exists for this restaurant",
      });
    }

    const newTable = new Table({ restaurantId, tableName, capacity });
    await newTable.save();

    return res.status(201).json({
      success: true,
      message: "Table added successfully",
      table: newTable,
    });
  } catch (err) {
    console.error("Add Table error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { restaurantId, tableId } = req.body;

    const table = await Table.findOne({ _id: tableId, restaurantId });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found for this restaurant",
      });
    }

    const deleted = await Table.findByIdAndDelete(tableId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Failed to delete table",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (err) {
    console.error("Delete Table error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateTable = async (req, res) => {
  try {
    const { tableId, updates } = req.body;

    const updatedTable = await Table.findByIdAndUpdate(tableId, updates, {
      new: true,
    });

    if (!updatedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table: updatedTable,
    });
  } catch (err) {
    console.error("Update Table error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllMenus = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId is required",
      });
    }

    const menu = await Menu.findOne({ restaurantId });

    if (!menu || !menu.items || menu.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No menus found for the given restaurant",
        menu: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menus fetched successfully",
      menu: menu.items,
    });
  } catch (err) {
    console.error("Get All Menus error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTables = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId is required",
      });
    }

    const tables = await Table.find({ restaurantId });

    if (!tables || tables.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tables found for the given restaurant",
        tables: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tables fetched successfully",
      tables,
    });
  } catch (err) {
    console.error("Get All Tables error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const token = req.query;
    const response = verifyToken(token.token);

    if (!response) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!tableId) {
      return res.status(400).json({
        success: false,
        message: "Table ID is required",
      });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Table status fetched successfully",
      table: {
        id: table._id,
        tableName: table.tableName,
        status: table.status,
        capacity: table.capacity,
        createdAt: table.createdAt,
      },
    });
  } catch (err) {
    console.error("Get Table Status error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId, updatedRestaurant } = req.body;
    console.log(restaurantId, updatedRestaurant);

    if (!restaurantId || !updatedRestaurant) {
      return res.status(400).json({
        success: false,
        message: "restaurantId and updatedRestaurant data are required",
      });
    }

    const restaurant = await Restaurants.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    Object.keys(updatedRestaurant).forEach((key) => {
      if (updatedRestaurant[key] !== undefined) {
        restaurant[key] = updatedRestaurant[key];
      }
    });

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (err) {
    console.error("Update Restaurant error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating restaurant",
    });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    const { restaurantId, updatedRestaurantImage } = req.body;
    console.log(restaurantId, updatedRestaurantImage);

    if (!restaurantId || !updatedRestaurantImage) {
      return res.status(400).json({
        success: false,
        message: "restaurantId and updatedRestaurantImage are required",
      });
    }

    const restaurant = await Restaurants.findById(restaurantId);
    console.log(restaurant);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.image = updatedRestaurantImage;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant profile image updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update Restaurant Profile error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the restaurant profile image",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { restaurantId, status } = req.body;

    if (!restaurantId || typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "restaurantId and a valid boolean status are required",
      });
    }

    const restaurant = await Restaurants.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isOpen = status;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: `Restaurant isOpen status updated to ${status}`,
      restaurant,
    });
  } catch (err) {
    console.error("Update Status error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating restaurant status",
    });
  }
};

module.exports = {
  register,
  login,
  getRestaurant,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  addTable,
  deleteTable,
  updateTable,
  getAllMenus,
  getAllTables,
  getTableStatus,
  updateRestaurant,
  updateRestaurantProfile,
  updateStatus,
};
