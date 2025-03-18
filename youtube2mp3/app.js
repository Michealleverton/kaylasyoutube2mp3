const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
  const videoID = req.body.videoID;
  console.log("Received video ID:", videoID);

  if (videoID === undefined || videoID === "" || videoID === null) {
    console.log("Invalid video ID");
    return res.render("index", {
      success: false,
      message: "Please enter a valid video ID",
    });
  } else {
    try {
      console.log("Fetching data from API...");
      const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_API_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_API_HOST,
        },
      });

      const fetchResponse = await fetchAPI.json();
      console.log("API response:", fetchResponse);

      if (fetchResponse.status === "ok") {
        console.log("Fetching success");
        return res.render("index", {
          success: true,
          song_title: fetchResponse.title,
          song_link: fetchResponse.link,
        });
      } else {
        console.log("Fetching failed:", fetchResponse.msg);
        return res.render("index", {
          success: false,
          message: fetchResponse.msg,
        });
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      return res.render("index", {
        success: false,
        message: "An error occurred while processing your request. Please try again later.",
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});