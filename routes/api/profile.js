const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Portfolio = require("../../models/Trade");

const validateProfileInput = require("../../validation/profile");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};

    profileFields.user = req.user.id;

    if (req.body.website || req.body.website === "")
      profileFields.website = req.body.website;
    if (req.body.location || req.body.location === "")
      profileFields.location = req.body.location;
    
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        new Profile(profileFields)
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      }
    });
  }
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() =>
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        Portfolio.findOneAndRemove({ user: req.user.id }).then(() =>
          res.json({ success: true })
        )
      )
    );
  }
);

module.exports = router;
