const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

const buddySchema = new mongoose.Schema({
    name: String,
    age: Number,
    destination: String,
    travelDate: String,
    interests: String
});

const TravelBuddy = mongoose.model("TravelBuddy", buddySchema);

app.post("/add", async (req, res) => {
    try {
        const buddy = new TravelBuddy(req.body);
        await buddy.save();

        res.json({
            message: "Travel Buddy added successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/buddies", async (req, res) => {
    try {
        const buddies = await TravelBuddy.find();
        res.json(buddies);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/search/:destination", async (req, res) => {
    try {
        const buddies = await TravelBuddy.find({
            destination: {
                $regex: req.params.destination,
                $options: "i"
            }
        });

        res.json(buddies);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected");

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });