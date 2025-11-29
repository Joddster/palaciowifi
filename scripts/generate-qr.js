const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const config = require("../config");

const outputPath = path.join(
  __dirname,
  "..",
  config.qrAssetPath || "assets/qr-code.png"
);

async function ensureDir(targetPath) {
  const dir = path.dirname(targetPath);
  await fs.promises.mkdir(dir, { recursive: true });
}

async function createQrCode() {
  if (!config.landingUrl) {
    throw new Error("landingUrl is missing in config.js");
  }

  await ensureDir(outputPath);
  await QRCode.toFile(config.qrAssetPath ? outputPath : "assets/qr-code.png", config.landingUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: "#05090f",
      light: "#ffffffff"
    }
  });

  console.log(`QR code generated for ${config.landingUrl}`);
  console.log(`Saved at ${outputPath}`);
}

createQrCode().catch((error) => {
  console.error("Failed to generate QR code:", error.message);
  process.exit(1);
});

