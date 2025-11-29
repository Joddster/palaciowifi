(() => {
  const config = typeof window !== "undefined" ? window.PalacioConfig || {} : {};

  const heroHeadline = document.getElementById("heroHeadline");
  const heroSubHeadline = document.getElementById("heroSubHeadline");
  const whatsappButton = document.getElementById("whatsappButton");
  const wifiButton = document.getElementById("wifiButton");
  const wifiModal = document.getElementById("wifiModal");
  const closeWifiModal = document.getElementById("closeWifiModal");
  const wifiSsid = document.getElementById("wifiSsid");
  const wifiPassword = document.getElementById("wifiPassword");
  const wifiQrString = document.getElementById("wifiQrString");
  const wifiJoinButton = document.getElementById("wifiJoinButton");
  const wifiQrImage = document.getElementById("wifiQrImage");

  const formatPhoneForWhatsApp = (number) => number.replace(/[^\d]/g, "");

  const buildWifiString = () => {
    const { ssid, password, security } = config.wifi || {};
    return `WIFI:T:${security || "WPA"};S:${ssid || ""};P:${password || ""};;`;
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Copied!");
    }
  };

  if (heroHeadline) {
    heroHeadline.textContent = config.brandName || heroHeadline.textContent;
  }

  if (heroSubHeadline) {
    heroSubHeadline.textContent = config.headline || heroSubHeadline.textContent;
  }

  if (whatsappButton && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      config.whatsappMessage || "Hola Palacio, necesito ayuda."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    whatsappButton.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener");
    });
  } else if (whatsappButton) {
    whatsappButton.disabled = true;
  }

  const wifiDetailsAvailable =
    config.wifi && config.wifi.ssid && config.wifi.password;

  if (wifiDetailsAvailable) {
    wifiSsid.textContent = config.wifi.ssid;
    wifiPassword.textContent = config.wifi.password;
    const wifiString = buildWifiString();
    wifiQrString.textContent = wifiString;
    if (wifiQrImage) {
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
        wifiString
      )}&size=300&margin=1`;
      wifiQrImage.src = qrUrl;
      wifiQrImage.alt = `QR code for ${config.wifi.ssid}`;
    }
  } else if (wifiButton) {
    wifiButton.disabled = true;
  }

  const toggleWifiModal = (open) => {
    if (!wifiModal) return;
    if (typeof wifiModal.showModal === "function") {
      open ? wifiModal.showModal() : wifiModal.close();
    } else {
      wifiModal.open = open;
      wifiModal.style.display = open ? "block" : "none";
    }
  };

  wifiButton?.addEventListener("click", () => toggleWifiModal(true));
  closeWifiModal?.addEventListener("click", () => toggleWifiModal(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleWifiModal(false);
    }
  });

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-copy-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        copyToClipboard(targetEl.textContent.trim());
      }
    });
  });

  wifiJoinButton?.addEventListener("click", () => {
    const text = `Wi-Fi SSID: ${config.wifi?.ssid}\nPassword: ${config.wifi?.password}`;
    copyToClipboard(text);
  });
})();

