const fs = require("fs");

const inputFile = "tracks.json";
const outputFile = "tracks_editable.csv";

const tracks = JSON.parse(fs.readFileSync(inputFile, "utf8"));

const headers = [
  "id",
  "title",
  "mode",
  "answer",
  "artistName",
  "hint1",
  "hint2",
  "hint3",
  "remixUrl",
  "originalSnippetUrl"
];

const rows = tracks.map(track => [
  track.id,
  track.title,
  track.mode,
  track.answer,
  track.artistName,
  track.hintList?.[0] || "",
  track.hintList?.[1] || "",
  track.hintList?.[2] || "",
  track.remixUrl,
  track.originalSnippetUrl
]);

const csv = [
  headers.join(","),
  ...rows.map(row => row.map(val => `"${(val || "").replace(/"/g, '""')}"`).join(","))
].join("\n");

fs.writeFileSync(outputFile, csv);

console.log("CSV created: tracks_editable.csv");