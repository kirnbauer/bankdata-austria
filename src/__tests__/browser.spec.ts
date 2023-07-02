/*!
 * @jest-environment jsdom
 *
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

import "../browser";

/* eslint-disable @typescript-eslint/no-unsafe-call */
describe("browser", () => {
  it("adds function bankdataAustria.bankDataByBBAN to window", () => {
    expect(typeof window.bankdataAustria.bankDataByBBAN).toBe("function");
  });
  it("adds function bankdataAustria.bankDataByBLZ to window", () => {
    expect(typeof window.bankdataAustria.bankDataByBLZ).toBe("function");
  });
  it("adds function bankdataAustria.bankDataByIBAN to window", () => {
    expect(typeof window.bankdataAustria.bankDataByIBAN).toBe("function");
  });
  it("adds function bankdataAustria.isValidBIC to window", () => {
    expect(typeof window.bankdataAustria.isValidBIC).toBe("function");
  });
});
