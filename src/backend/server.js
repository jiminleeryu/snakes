const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
import {Db, MongoClient, ObjectId} from "mongodb";


require('dotenv').config(".env");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express.json());

app.post("/score", async (req, res) => {
    const collection = db.collection("scores");

    const scoreData = req.body;

    const newScore = {
      score: scoreData.score,
       createdAt: new Date()
    };

    try {
      await collection.insertOne(newScore);
      return res.json(newScore)
    } catch (e) {
      console.error("Error creating player:", e);
      return res.status(500).send();
    }
  });

function start() {
    const client = new MongoClient("mongodb+srv://jiminleeryu:FSAB@cluster0.n8ocn3q.mongodb.net/");
    client.connect()
        .then(() => {
            console.log('Connected successfully to server');
            db = client.db("database");
            app.listen(port, () => {
                console.log(`server started at http://localhost:${port}`);
            });
        })
        .catch(() => {
            console.log("Error connecting to mongoDB");
        });
}

start();
