/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * bankdata-austria
 * Copyright (C) 2023 Klaus Kirnbauer <mail@kirnbauer.dev>
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

import csv from "csv-parser";
import * as fs from "fs";
import * as iconv from 'iconv-lite';

// Import the current bank data text file and convert it to JSON files.
// This should be done after the Nationalbank releases new data multiple
// times a year. See:
// https://www.oenb.at/Statistik/Klassifikationen/SEPA-Zahlungsverkehrs-Verzeichnis.html

interface BankData {
  Bankenname: string;
  Bankleitzahl: string;
  SWIFTCode: string;
}

const csvFilePath = `${__dirname}/../data/sepa-zv-vz_gesamt.csv`;
const outputFilePath = `${__dirname}/../data/current.json`;

const bankData: BankData[] = [];

fs.createReadStream(csvFilePath)
  .pipe(iconv.decodeStream('latin1'))
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
