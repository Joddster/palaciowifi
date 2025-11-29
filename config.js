(function attachConfig(globalTarget) {
  const config = {
    brandName: "Palacio Guest Services",
    headline: "Stay connected during your visit",
    subHeadline: "Reach us instantly on WhatsApp or join the complimentary Wi‑Fi.",
    whatsappNumber: "+526121539351",
    whatsappMessage: "Hola Palacio, necesito ayuda con mi visita.",
    wifi: {
      ssid: "palacioblanco",
      password: "palaciowhite",
      security: "WPA2"
    },
    landingUrl: "https://palacioqr.vercel.app",
    qrAssetPath: "assets/qr-code.png"
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  } else {
    globalTarget.PalacioConfig = config;
  }
})(typeof window !== "undefined" ? window : globalThis);

