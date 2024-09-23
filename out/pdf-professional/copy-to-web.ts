import * as data from "../../in/data.json";
import fs from "fs";
fs.cpSync("main.pdf", `../web/public/resume-${data.preName.toLowerCase()}-${data.lastName.toLowerCase()}.pdf`);