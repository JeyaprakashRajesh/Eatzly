const restaurantController = require("../controllers/restaurantController");
const express = require("express");
const { verifyTokenMiddleWare } = require("../utils/jwt");
const router = express.Router();

router.post("/register", restaurantController.register);
router.post("/login", restaurantController.login);
router.get(
  "/get-restaurant",
  verifyTokenMiddleWare,
  restaurantController.getRestaurant
);
router.put(
  "/update",
  verifyTokenMiddleWare,
  restaurantController.updateRestaurant
);
router.put(
  "/profile/update",
  verifyTokenMiddleWare,
  restaurantController.updateRestaurantProfile
);
router.put(
  "/update-status",
  verifyTokenMiddleWare,
  restaurantController.updateStatus
);
router.get("/menus", verifyTokenMiddleWare, restaurantController.getAllMenus);
router.post(
  "/menu/add",
  verifyTokenMiddleWare,
  restaurantController.addMenuItem
);
router.delete(
  "/menu/delete",
  verifyTokenMiddleWare,
  restaurantController.deleteMenuItem
);
router.put(
  "/menu/update",
  verifyTokenMiddleWare,
  restaurantController.updateMenuItem
);

router.get("/tables", verifyTokenMiddleWare, restaurantController.getAllTables);
router.post("/table/add", verifyTokenMiddleWare, restaurantController.addTable);
router.delete(
  "/table/delete",
  verifyTokenMiddleWare,
  restaurantController.deleteTable
);
router.put(
  "/table/update",
  verifyTokenMiddleWare,
  restaurantController.updateTable
);

router.get("/table/status/:tableId", restaurantController.getTableStatus);

module.exports = router;
