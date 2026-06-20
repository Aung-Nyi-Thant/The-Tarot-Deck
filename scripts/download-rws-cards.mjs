import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { tarotCards } from "../src/tarotDeck.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cardsDir = join(__dirname, "../public/cards");

mkdirSync(cardsDir, { recursive: true });

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, fileName) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VelvetArcanaTarotApp/1.0",
      },
    });

    if (response.status !== 429) return response;

    const delay = 1200 + attempt * 1800;
    console.log(`rate-limit ${fileName}; waiting ${delay}ms`);
    await wait(delay);
  }

  return fetch(url, {
    headers: {
      "User-Agent": "VelvetArcanaTarotApp/1.0",
    },
  });
}

async function downloadCard(card) {
  const fileName = basename(card.image);
  const destination = join(cardsDir, fileName);

  if (existsSync(destination)) {
    return { fileName, status: "exists" };
  }

  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=900`;
  const response = await fetchWithRetry(url, fileName);

  if (!response.ok || !response.body || !response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Could not download ${fileName}: ${response.status} ${response.statusText}`);
  }

  await finished(Readable.fromWeb(response.body).pipe(createWriteStream(destination)));
  return { fileName, status: "downloaded" };
}

let downloaded = 0;
let existing = 0;

for (const card of tarotCards) {
  const result = await downloadCard(card);
  if (result.status === "downloaded") downloaded += 1;
  if (result.status === "exists") existing += 1;
  console.log(`${result.status.padEnd(10)} ${result.fileName}`);
  await wait(350);
}

console.log(`Done. ${downloaded} downloaded, ${existing} already present.`);
