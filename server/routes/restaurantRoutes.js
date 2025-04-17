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
router.get("/table", restaurantController.getTableDetails);
router.post("/table/reserve", restaurantController.reserveTable);

module.exports = router;
