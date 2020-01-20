const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    // Prevent canvas has been tainted by cross-origin data error
    args: ["--disable-web-security"],
    devtools: false,
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(
    "https://www.volkskrant.nl/kijkverder/v/2020/dicht-bij-de-sterren-toen-dat-nog-kon~v84269/",
    { waitUntil: "networkidle0" }
  );

  // Accept cookie wall
  const btn = await page.$(".button.fjs-set-consent");
  if (btn) {
    await btn.click();
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }

  await page.addScriptTag({
    url: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
  });
  await page.addScriptTag({
    url: "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"
  });

  const result = await page.evaluate(() => {
    const canvas = document.createElement("canvas");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.width = 800;
    img.src =
      "https://www.volkskrant.nl/kijkverder/v/2020/dicht-bij-de-sterren-toen-dat-nog-kon~v84269/media/869ad68b92e54348ad5c6f1af165199a.jpg";

    console.log(img.textContent);
    document.write(img.textContent);

    img.addEventListener("load", e => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.border = "1px solid";

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      document.body.appendChild(canvas);
    });

    // Load the model.
    return cocoSsd
      .load()
      .then(model =>
        // detect objects in the image.
        model.detect(img)
      )
      .then(result => {
        const { bbox } = result[0];
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(bbox[0], bbox[1], bbox[2], bbox[3]);
        return result;
      });
  });

  console.log(result);

  //  await page.close();
  //  await browser.close();
})();
