
import { promises as fs } from "fs";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse the jsdict file and save only the relevent information
const parse = async () => {
    const inputFilePath = join(__dirname, 'raw.json');
    const outputFilePath = join(__dirname, 'jmdict.json');
    
    const data = await fs.readFile(inputFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    const parsedData = jsonData.words.flatMap(word => {
        return word.kanji.map(kanji => {
            return {
                kanji: kanji.text,
                definitions: word.sense.flatMap(sense =>
                    sense.gloss.filter(gloss => gloss.lang === "eng").map(gloss => gloss.text)
                )
            }
        });
    })
    .reduce((acc, curr) => {
        if (!acc[curr.kanji]) {
            acc[curr.kanji] = [];
        }
        acc[curr.kanji].push(...curr.definitions);
        return acc;
    }, {});

    await fs.writeFile(outputFilePath, JSON.stringify(parsedData), 'utf8');
}

parse();