// https://blog.angulartraining.com/tutorial-how-to-create-custom-angular-elements-55aea29d80c5
// https://www.techiediaries.com/angular-elements-web-components/

const fs = require("fs-extra");
const concat = require("concat");
(async function build() {
  const files = [
    "dist/leafletComponent/runtime.js",
    "dist/leafletComponent/polyfills.js",
    "dist/leafletComponent/scripts.js",
    "dist/leafletComponent/main.js"
  ];
  await fs.ensureDir("elements");
  await concat(files, "elements/leaflet-component.js");
  await fs.copyFile("dist/leafletComponent/styles.css", "elements/styles.css");
  await fs.copyFile("src/runner.html", "elements/runner.html");
  await fs.copy("dist/leafletComponent/assets/", "elements/");
})();
