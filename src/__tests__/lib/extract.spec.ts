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

import { extractBLZFromBBAN } from "../../lib/extract";

describe("extractBLZFromBBAN", () => {
  it("extracts BLZ 20111 from BBAN 2011100003429660", () => {
    expect(extractBLZFromBBAN("2011100003429660")).toEqual("20111");
  });

  it("cannot extract data from invalid BBAN (wrong format)", () => {
    expect(extractBLZFromBBAN("1022050000092907021")).toEqual(null);
  });

  it("cannot extract data from invalid BBAN format (wrong length)", () => {
    expect(extractBLZFromBBAN("10220500000929070")).toEqual(null);
  });
});
