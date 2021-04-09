const got = require("got");
const fs = require("fs");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

const mobileplayListID = "PL0cKRR9GVgpflUrCR4BNqbd8YAKFrKp5w";

const webplayListID = "PL0cKRR9GVgpfikqBWGkJ3P7T4oV7zEI8I";

const maxResults = 50;

const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&key=${API_KEY}&playlistId=`;

const mobilePlaylistUrl = `${playlistUrl}${mobileplayListID}`;

const webPlaylistUrl = `${playlistUrl}${webplayListID}`;

const videoURL = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet&key=${API_KEY}&id=`;

const mobileVideosFileName = "mobile-videos.json";

const webVideosFileName = "web-videos.json";

const parseResponse = (res) => {
  return res.map((item) => {
    return item;
  });
};

const writeToFile = (response, fileName) => {
  try {
    fs.writeFileSync(fileName, JSON.stringify(response, undefined, 2));
  } catch (err) {
    console.error(err);
  }
};

const getVideos = (playlistURL, fileName) => {
  got(playlistURL)
    .then((response) => {
      const parsedResponse = JSON.parse(response.body) || {};
      const allvideoIds = parsedResponse.items.map((item) => {
        return item.snippet.resourceId.videoId;
      });
      const detailedVideoUrl = `${videoURL}${allvideoIds.join(",")}`;
      got(detailedVideoUrl).then((res) => {
        const parsedRes = JSON.parse(res.body) || {};
        writeToFile(parseResponse(parsedRes.items), fileName);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

getVideos(mobilePlaylistUrl, mobileVideosFileName);

getVideos(webPlaylistUrl, webVideosFileName);
