const fs = require("fs");
const path = require("path");

// =====================================================
// EDIT THESE SETTINGS
// =====================================================
const MUSIC_FOLDER = "./SDB"; // folder containing your audio files
const OUTPUT_FILE = "./tracks.json";
const ORIGINAL_SNIPPET_FILE = "Same Damn Band - Original.mp3"; // change this to your real original file name

// Extensions to include
const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"]);

// If you later move files online, replace this with your real base URL.
// For now this script uses local relative paths.
const PUBLIC_BASE_URL = "./SDB";

function isAudioFile(fileName) {
  return AUDIO_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function cleanTitle(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function guessMode(fileName) {
  const lower = fileName.toLowerCase();

  if (lower.includes("style of") || lower.includes("in the style of")) {
    return "In the style of...";
  }

  return "The genre is...";
}

function guessAnswer(fileName) {
  const lower = fileName.toLowerCase();

  if (lower.includes("southern rock")) return "Southern Rock";
  if (lower.includes("texas country")) return "Texas Country";
  if (lower.includes("worship")) return "Contemporary Worship";
  if (lower.includes("country")) return "Country";
  if (lower.includes("pop rock")) return "Pop Rock";
  if (lower.includes("alt rock")) return "Alternative Rock";
  if (lower.includes("indie pop")) return "Indie Pop";
  if (lower.includes("edm")) return "EDM";
  if (lower.includes("acoustic")) return "Acoustic";

  return "TBD";
}

function guessArtistLane(fileName) {
  const lower = fileName.toLowerCase();

  if (lower.includes("southern rock")) return "Hello Texas lane";
  if (lower.includes("texas country")) return "Sawyer Price lane";
  if (lower.includes("worship")) return "Parsons Cross lane";
  if (lower.includes("alt rock")) return "Avery Ivey hard side";
  if (lower.includes("acoustic")) return "Avery Ivey soft side";

  return "TBD";
}

function buildHints(fileName) {
  const answer = guessAnswer(fileName);

  if (answer === "Southern Rock") {
    return [
      "Big guitars. Bigger swagger.",
      "This version leans grit over polish.",
      "It lives somewhere between country and rock."
    ];
  }

  if (answer === "Contemporary Worship") {
    return [
      "This one opens up emotionally instead of flexing attitude.",
      "The chorus feels built for a room full of voices.",
      "Think uplift, not edge."
    ];
  }

  if (answer === "Acoustic") {
    return [
      "Stripped down and more intimate.",
      "The lyric does more of the heavy lifting here.",
      "Less production, more song."
    ];
  }

  return [
    "Same song. Different costume.",
    "Listen to what changed around the lyric.",
    "The writing is the constant."
  ];
}

function main() {
  if (!fs.existsSync(MUSIC_FOLDER)) {
    console.error(`Folder not found: ${MUSIC_FOLDER}`);
    process.exit(1);
  }

  const allFiles = fs
    .readdirSync(MUSIC_FOLDER)
    .filter(isAudioFile)
    .sort((a, b) => a.localeCompare(b));

  if (allFiles.length === 0) {
    console.error("No audio files found in the folder.");
    process.exit(1);
  }

  const originalExists = allFiles.includes(ORIGINAL_SNIPPET_FILE);
  if (!originalExists) {
    console.warn(`Warning: original snippet file not found: ${ORIGINAL_SNIPPET_FILE}`);
    console.warn("The script will still run, but originalSnippetUrl may point to a file that does not exist yet.");
  }

  const remixFiles = allFiles.filter((file) => file !== ORIGINAL_SNIPPET_FILE);

  const tracks = remixFiles.map((fileName, index) => ({
    id: String(index + 1),
    title: cleanTitle(fileName),
    mode: guessMode(fileName),
    answer: guessAnswer(fileName),
    artistName: guessArtistLane(fileName),
    artistImage: "",
    hintList: buildHints(fileName),
    remixUrl: `${PUBLIC_BASE_URL}/${encodeURIComponent(fileName)}`,
    originalSnippetUrl: `${PUBLIC_BASE_URL}/${encodeURIComponent(ORIGINAL_SNIPPET_FILE)}`
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tracks, null, 2), "utf8");

  console.log(`Created ${OUTPUT_FILE}`);
  console.log(`Found ${allFiles.length} audio files total`);
  console.log(`Created ${tracks.length} game track entries`);
}

main();
