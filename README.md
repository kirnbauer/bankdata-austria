# bankdata-austria: Data and BIC Validator for Austrian Banks.

[![Lint, test and build](https://github.com/kirnbauer/bankdata-austria/actions/workflows/lint-test-build.yml/badge.svg)](https://github.com/kirnbauer/bankdata-austria/actions/workflows/lint-test-build.yml)  
This TypeScript/JavaScript library is based on the code from [baumerdev](https://github.com/baumerdev/bankdata-germany) and provides bank data for Austrian banks, including names and BIC/SWIFT codes. It can be used to improve user interfaces and forms, where users enter an IBAN and the library automatically populates the bank name and BIC fields.

Please note that this library does not serve as an IBAN validator.

- [Installation](#installation)
- [Usage](#usage)
- [Data Source](#data-source)
- [Package Version](#package-version)

## Installation

### Package Manager

To add this library to your project, use your package manager such as npm. It is recommended to install the latest version explicitly.

```sh
$ npm install --save bankdata-austria@latest
```

### Browser / CDN

If you just want the functions in your browser, you can include the following
pre-build file.

```html
<script src="https://cdn.jsdelivr.net/npm/bankdata-austria/dist/build/browser.js"></script>
```

## Usage

The npm package contains the code for ESM and CJS, so instead of `import`, as
shown in the usage examples below, you can use `require` as well.

### IBAN / Bank Details

You can get detailed information for a bank by BLZ, BBAN or IBAN.

Note: If you use the BBAN/IBAN function no verification takes place. It just
extracts the BLZ and checks if it exists.

```javascript
import {
  bankDataByBLZ,
  bankDataByBBAN,
  bankDataByIBAN,
} from "bankdata-austria";

bankDataByBLZ("19043");
bankDataByBBAN("02000123456");
bankDataByIBAN("AT872011102000123456");
// {
//   bankName: "Erste Bank der oesterreichischen Sparkassen AG",
//   bic: "GIBAATWWXXX",
//   blz: "20111"
// }
```

### Validation

You can validate BIC/Swift Codes. But even if those formats are international
standards this library only validates data for Austria and will return false
for all other countries.

```javascript
import { isValidBIC } from "bankdata-austria";

isValidBIC("MARKDEFF"); // true
isValidBIC("MARKDEFFXXX"); // true
isValidBIC("foobar"); // false (invalid format)
isValidBIC("BNPAFRPH"); // false (corrent but not a Austrian BIC)
```

### Browser / CDN

If you use the pre-build version, an object `bankdataAustria` is globally
defined on `window` containing the functions.

```javascript
bankdataAustria.bankDataByBLZ("10010010");
bankdataAustria.bankDataByBBAN("100100100000138301");
bankdataAustria.bankDataByIBAN("DE48100100100000138301");
bankdataAustria.isValidBIC("MARKDEFF");
```

## Data Source

Bank data is taken from the official website of
[Österreichische Nationalbank
](https://www.oenb.at/Statistik/Klassifikationen/SEPA-Zahlungsverkehrs-Verzeichnis.html).

## Package Version

The version numbers are based on [Semantic Versioning](https://semver.org/)
with modifications.

> 1.0.0

The first number representes the Major version. If this number increases there
are updates that may not be backward compatiple and you have to adjust your
code. That means the above version string is from major version **1**.

The first two digits of the second number stand for the year of the included
data and check digit methods. The third and fourth digit increase when there
are either minor version changes that are backward compatible or when new data
is included. That means the above version string is from year 20**22** and
has had a few minor updates, perhaps data updates for spring and summer.

The last number is for patches and bug fixes.

Since the data may change up to four times a year you should use a suitable
version string in your package.json. Since there will be only breaking changes
when the first number changes, you should be good with e.g. `"1.x"`
