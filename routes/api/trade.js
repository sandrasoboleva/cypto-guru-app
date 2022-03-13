const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Portfolio = require("../../models/Trade");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then(portfolio => res.json(portfolio))
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  "/create-portfolio",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const portfolioFields = {};
    portfolioFields.user = req.user.id;
    portfolioFields.currencyArray = [];
    portfolioFields.walletValue = 0;
    portfolioFields.walletDifference = "0.00";
    myCoins = [];

    Portfolio.findOne({ user: req.user.id }).then(portfolio => {
      if (!portfolio) {

        new Portfolio(portfolioFields)
          .save()
          .then(portfolio => res.json(portfolio));
      } else {
        console.log("Empty portfolio already created");
      }
    });
  }
);

router.post(
  "/update-currency-array",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { currencyArray: req.body },
      { new: true }
    )
      .then(portfolio => res.json(portfolio))
      .catch(err => console.log(err));
  }
);

router.post(
  "/update-my-coins-array",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { myCoins: req.body },
      { new: true }
    )
      .then(updatedCoinsList => res.json(updatedCoinsList))
      .catch(err => console.log(err));
  }
);

router.post(
  "/update-wallet",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body.walletDifference);
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      {
        walletValue: req.body.value,
        walletDifference: req.body.walletDifference
      },
      { new: true }
    )
      .then(updatedWalletValue => res.json(updatedWalletValue))
      .catch(err => console.log(err));
  }
);

router.post(
  "/update-wallet-value-difference",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { walletDifference: req.body.value },
      { new: true }
    )
      .then(updatedWalletValueDifference =>
        res.json(updatedWalletValueDifference)
      )
      .catch(err => console.log(err));
  }
);

module.exports = router;
