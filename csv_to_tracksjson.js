const fs = require("fs");

const inputFile = "tracks_editable.csv";
const outputFile = "tracks_updated.json";

const csv = fs.readFileSync(inputFile, "utf8").split("\n");

const headers = csv[0].split(",").map(h => h.replace(/"/g, ""));

const data = csv.slice(1).filter(line => line.trim() !== "");

const tracks = data.map(line => {
  const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, ""));

  const obj = {};
  headers.forEach((h, i) => obj[h] = values[i] || "");

  return {
    id: obj.id,
    title: obj.title,
    mode: obj.mode,
    answer: obj.answer,
    artistName: obj.artistName,
    artistImage: "",
    hintList: [obj.hint1, obj.hint2, obj.hint3],
    remixUrl: obj.remixUrl,
    originalSnippetUrl: obj.originalSnippetUrl
  };
});

fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2));

console.log("Updated JSON created: tracks_updated.json");