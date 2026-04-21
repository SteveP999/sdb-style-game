const fs = require("fs");

const inputFile = "tracks_editable.csv";
const outputFile = "tracks_updated.json";

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

const raw = fs.readFileSync(inputFile, "utf8").replace(/^\uFEFF/, "");
const lines = raw.split(/\r?\n/).filter(line => line.trim() !== "");

if (lines.length < 2) {
  console.error("CSV is empty or only contains headers.");
  process.exit(1);
}

const headers = parseCsvLine(lines[0]).map(h => h.trim());

const tracks = lines.slice(1).map(line => {
  const values = parseCsvLine(line);
  const row = {};

  headers.forEach((header, index) => {
    row[header] = (values[index] || "").trim();
  });

  return {
    id: row.id || "",
    title: row.title || "",
    mode: row.mode || "",
    answer: row.answer || "",
    artistName: row.artistName || "",
    rankGroup: row.rankGroup ? Number(row.rankGroup) : 3,
    artistImage: row.artistImage || "",
    logoImage: row.logoImage || "",
    originalArt: row.originalArt || "",
    hintList: [
      row.hint1 || "",
      row.hint2 || "",
      row.hint3 || ""
    ],
    remixUrl: row.remixUrl || "",
    originalSnippetUrl: row.originalSnippetUrl || ""
  };
});

fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2), "utf8");

console.log(`JSON created: ${outputFile}`);
console.log(`Tracks exported: ${tracks.length}`);
