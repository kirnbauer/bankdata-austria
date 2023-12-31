/**
 * bankdata-austria
 * Copyright (C) 2023 Klaus Kirnbauer
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

import currentBank from "../../data/current.json";
import {
  bankDataByBBAN,
  bankDataByBLZ,
  bankDataByIBAN,
  Banks,
  isBICInData,
  myBankData,
} from "../../lib/data";

describe("current.json", () => {
  // Safeguard that there are enough converted entries.
  it("contains more than 500 entries", () => {
    expect(Object.keys(currentBank as Banks).length).toBeGreaterThan(500);
  });
});

describe("bankDataByBLZ", () => {
  Object.keys(myBankData).forEach((blz) => {
    const blzData = myBankData[blz];
    const blzObject = { bankName: blzData[0], bic: blzData[1], blz };
    it(`returns correct data for BLZ ${blz}`, () => {
      expect(bankDataByBLZ(String(blz))).toEqual(blzObject);
    });
  });

  it("returns null for unknown BLZ 12345", () => {
    expect(bankDataByBLZ("12345")).toEqual(null);
  });
  it("returns null for unknown BLZ 00000", () => {
    expect(bankDataByBLZ("00000")).toEqual(null);
  });
  it("returns null for BLZ 1234567 (not 5 digits)", () => {
    expect(bankDataByBLZ("1234567")).toEqual(null);
  });
  it("returns null for BLZ 123_5678 (invalid char)", () => {
    expect(bankDataByBLZ("123_5678")).toEqual(null);
  });
});

describe("isBICInData", () => {
  it("returns true for BIC RZOOAT2L777", () => {
    expect(isBICInData("RZOOAT2L777")).toEqual(true);
  });
  it("returns true for BIC BUNDATWWXXX", () => {
    expect(isBICInData("BUNDATWWXXX")).toEqual(true);
  });
  it("returns true for BIC GIBAATWW", () => {
    expect(isBICInData("GIBAATWW")).toEqual(true);
  });

  it("returns false for invalid BIC format", () => {
    expect(isBICInData("1")).toEqual(false);
  });
  it("returns false for unknown BIC AAAADE00000", () => {
    expect(isBICInData("AAAADE00000")).toEqual(false);
  });
});

describe("bankDataByBBAN", () => {
  it("returns data for BBAN", () => {
    expect(bankDataByBBAN("2011100003429660")).toEqual({
      bankName: "Erste Bank der oesterreichischen Sparkassen AG",
      bic: "GIBAATWWXXX",
      blz: "20111",
    });
  });
  it("returns null for BBAN null (not a string)", () => {
    expect(bankDataByBBAN(null)).toEqual(null);
  });
  it("returns null for BBAN with invalid format", () => {
    expect(bankDataByBBAN("0")).toEqual(null);
  });
  it("returns null for BBAN with unknown BLZ", () => {
    expect(bankDataByBBAN("123456780000000000")).toEqual(null);
  });
  it("returns null for BBAN with unknown BLZ", () => {
    expect(bankDataByBBAN("000000000000000000")).toEqual(null);
  });
  /*  it("returns data for BBAN with unknown BLZ but disabled validation", () => {
    expect(bankDataByBBAN("100000000000000000")).not.toEqual(null);
  });*/
});

describe("bankDataByIBAN", () => {
  it("returns data for IBAN null (not a string)", () => {
    expect(bankDataByIBAN("AT022011100003429660")).toEqual({
      bankName: "Erste Bank der oesterreichischen Sparkassen AG",
      bic: "GIBAATWWXXX",
      blz: "20111",
    });
  });
  it("returns null for IBAN null (wrong country)", () => {
    expect(bankDataByIBAN("DE00100000000000000001")).toEqual(null);
  });
  it("returns null for IBAN null (not a string)", () => {
    expect(bankDataByIBAN(null)).toEqual(null);
  });
  it("returns null for IBAN with invalid format", () => {
    expect(bankDataByIBAN("0")).toEqual(null);
  });
  it("returns null for IBAN with unknown BLZ", () => {
    expect(bankDataByIBAN("AT00123456780000000000")).toEqual(null);
  });
  it("returns null for IBAN with unknown BLZ", () => {
    expect(bankDataByIBAN("AT00000000000000000000")).toEqual(null);
  });
});
