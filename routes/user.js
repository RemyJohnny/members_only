const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

/* user routes. */
router.get("/sign-up", userController.signUp_get);

router.post("/sign-up", userController.signUp_post);

router.get("/log-in", userController.logIn_get);

router.post("/log-in", userController.logIn_post);

router.get("/join-club", userController.joinClub_get);

router.post("/join-club", userController.joinClub_post);

router.get("/log-out", userController.log_out);

module.exports = router;
