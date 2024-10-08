import * as cheerio from "cheerio";
import path from "node:path";

const inputPath = path.join(process.cwd(), "input.txt");
const outputDir = path.join(process.cwd(), "output");

const inputFile = Bun.file(inputPath);
const input = await inputFile.text();

const $ = cheerio.load(input);
const sources = Array.from($("img")).map((image) => ({
  url: image.attribs.src,
  name: image.attribs.alt,
}));

const desiredSize = "w1080-h1080";
const updatedSources = sources.map((image) => {
  const newUrl = image.url.split("=")[0] + "=" + desiredSize;

  return {
    ...image,
    url: newUrl,
  };
});

for (const source of updatedSources) {
  console.log(`Downloading ${source.name}.png`);
  const response = await fetch(source.url);
  const blob = await response.blob();

  await Bun.write(`${outputDir}/${source.name}.png`, blob);
}
