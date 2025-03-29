const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/update_user", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      res.status(400).send({ success: false, error: "User not found" });
    } else {
      // Update session data
      req.session.userName = req.body.name;
      // ... update other session data ...

      res.send({ success: true, user: updatedUser });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

module.exports = router;