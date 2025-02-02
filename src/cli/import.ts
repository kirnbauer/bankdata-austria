/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * bankdata-austria
 * Copyright (C) 2025 Klaus Kirnbauer <bankdata-austria@kirnbauer.mozmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import csv from 'csv-parser';
import * as fs from 'fs';
import * as https from 'https';
import * as iconv from 'iconv-lite';
import * as path from 'path';

// Import the current bank data csv file and convert it to JSON files.
// This should be done after the Nationalbank releases new data multiple
// times a year. See:
// https://www.oenb.at/Statistik/Klassifikationen/SEPA-Zahlungsverkehrs-Verzeichnis.html

const downloadCsv = async (fileUrl: string, outputDir: string, outputFileName: string): Promise<string> => new Promise((resolve, reject) => {
      const parsedUrl = new URL(fileUrl);
      if (parsedUrl.protocol !== 'https:') {
          return reject(new Error('Error: Only HTTPS URLs are allowed!'));
      }

      const outputPath = path.join(__dirname, outputDir, outputFileName);
      if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`Downloading from: ${fileUrl} ...`);

      https.get(fileUrl, (response) => {
          if (response.statusCode !== 200) {
              return reject(new Error(`Download failed: ${response.statusCode} ${response.statusMessage}`));
          }

          const chunks: Buffer[] = [];

          response.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          response.on('end', () => {
              const rawData: Buffer = Buffer.concat(chunks);

              const utf8Data = iconv.decode(rawData, 'win1252');
              const cleanedData = removeHeaderLines(utf8Data);

              fs.writeFileSync(outputPath, cleanedData, 'utf-8');
              console.log(`File saved in UTF-8: ${outputPath}`);
              resolve(outputPath);
          });

      }).on('error', (err) => {
          reject(new Error(`Download error: ${err.message}`));
      });
  });

/**
* Removes all lines until and including 'SEPA-Verzeichnis-Abfrage vom xx.xx.xxxx'.
*/
const removeHeaderLines = (data: string): string => {
  const regex = /^(?:.*\r?\n)*?SEPA-Verzeichnis-Abfrage vom \d{2}\.\d{2}\.\d{4}.*\r?\n?/;
  return data.replace(regex, '');
};


const main = async () => {
  const url = 'https://www.oenb.at/docroot/downloads_observ/sepa-zv-vz_gesamt.csv'; 
  const outputDir = '../data';
  const outputFileName = 'sepa-zv-vz_gesamt.csv';
  try {
      const filePath = await downloadCsv(url, outputDir, outputFileName);
      console.log(`Processing CSV: ${filePath}`);

interface BankData {
  Bankenname: string;
  Bankleitzahl: string;
  SWIFTCode: string;
}

const csvFilePath = `${__dirname}/../data/sepa-zv-vz_gesamt.csv`;
const outputFilePath = `${__dirname}/../data/current.json`;

const bankData: BankData[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    const { Bankleitzahl, Bankenname, 'SWIFT-Code': SWIFTCode } = data;
    if (SWIFTCode) {
      const formattedBankleitzahl = Bankleitzahl.padStart(5, '0');
      bankData.push({ Bankenname, Bankleitzahl: formattedBankleitzahl, SWIFTCode });
    }
  })
  .on('end', () => {
    const formattedData: { [key: string]: [string, string] } = {};

    bankData.forEach((data) => {
      const { Bankleitzahl, Bankenname, SWIFTCode } = data;
      formattedData[Bankleitzahl] = [Bankenname, SWIFTCode];
    });

    const formattedJson = JSON.stringify(formattedData, null, 2);

    fs.writeFile(outputFilePath, formattedJson, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Conversion completed. JSON saved to:', outputFilePath);
    });
  });
} catch (error) {
  console.error(error);
}
};

main().catch(console.error);