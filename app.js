(() => {
  const config = typeof window !== "undefined" ? window.PalacioConfig || {} : {};

  // DOM Elements
  const headerTitle = document.getElementById("headerTitle");
  const headerDescription = document.getElementById("headerDescription");
  const whatsappButton = document.getElementById("whatsappButton");
  const wifiButton = document.getElementById("wifiButton");
  const wifiModal = document.getElementById("wifiModal");
  const closeWifiModal = document.getElementById("closeWifiModal");
  const wifiSsid = document.getElementById("wifiSsid");
  const wifiPassword = document.getElementById("wifiPassword");
  const wifiQrString = document.getElementById("wifiQrString");
  const wifiQrImage = document.getElementById("wifiQrImage");
  const wifiJoinButton = document.getElementById("wifiJoinButton");

  // Utility Functions
  const formatPhoneForWhatsApp = (number) => number.replace(/[^\d]/g, "");

  const buildWifiString = () => {
    const { ssid, password, security } = config.wifi || {};
    return `WIFI:T:${security || "WPA"};S:${ssid || ""};P:${password || ""};;`;
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed", err);
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showNotification("Copied to clipboard!");
    }
  };

  const showNotification = (message) => {
    // Simple notification - could be enhanced with a toast library
    const originalButtonText = wifiJoinButton?.textContent;
    if (wifiJoinButton && wifiJoinButton.textContent.includes("Copy All")) {
      wifiJoinButton.innerHTML = `<i class="fas fa-check"></i> ${message}`;
      setTimeout(() => {
        wifiJoinButton.innerHTML = `<i class="far fa-copy"></i> Copy All Wi-Fi Details`;
      }, 2000);
    } else {
      alert(message);
    }
  };

  // Update header from config
  if (headerTitle && config.brandName) {
    headerTitle.textContent = config.brandName;
  }

  if (headerDescription && config.headline) {
    headerDescription.textContent = config.headline;
  }

  // WhatsApp Button Setup
  if (whatsappButton && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      config.whatsappMessage || "Hola Palacio, necesito ayuda."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    whatsappButton.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  } else if (whatsappButton) {
    whatsappButton.disabled = true;
    whatsappButton.style.opacity = "0.5";
  }

  // WiFi Setup
  const wifiDetailsAvailable = config.wifi && config.wifi.ssid && config.wifi.password;

  if (wifiDetailsAvailable) {
    wifiSsid.textContent = config.wifi.ssid;
    wifiPassword.textContent = config.wifi.password;
    
    const wifiString = buildWifiString();
    wifiQrString.textContent = wifiString;
    
    // Generate WiFi QR code
    if (wifiQrImage) {
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
        wifiString
      )}&size=300&margin=1`;
      wifiQrImage.src = qrUrl;
      wifiQrImage.alt = `Wi-Fi QR code for ${config.wifi.ssid}`;
    }
  } else if (wifiButton) {
    wifiButton.disabled = true;
    wifiButton.style.opacity = "0.5";
  }

  // Modal Controls
  const toggleWifiModal = (open) => {
    if (!wifiModal) return;
    
    if (typeof wifiModal.showModal === "function") {
      if (open) {
        wifiModal.showModal();
      } else {
        wifiModal.close();
      }
    } else {
      // Fallback for browsers that don't support dialog
      wifiModal.open = open;
      wifiModal.style.display = open ? "block" : "none";
    }
  };

  // Event Listeners
  wifiButton?.addEventListener("click", () => {
    if (wifiDetailsAvailable) {
      toggleWifiModal(true);
    }
  });

  closeWifiModal?.addEventListener("click", () => toggleWifiModal(false));

  // Close modal on backdrop click
  wifiModal?.addEventListener("click", (e) => {
    if (e.target === wifiModal) {
      toggleWifiModal(false);
    }
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wifiModal?.open) {
      toggleWifiModal(false);
    }
  });

  // Copy buttons for individual credentials
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-copy-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        copyToClipboard(targetEl.textContent.trim());
        const icon = button.querySelector("i");
        if (icon) {
          icon.className = "fas fa-check";
          setTimeout(() => {
            icon.className = "far fa-copy";
          }, 2000);
        }
      }
    });
  });

  // Copy all WiFi details button
  wifiJoinButton?.addEventListener("click", () => {
    if (config.wifi) {
      const text = `Network (SSID): ${config.wifi.ssid}\nPassword: ${config.wifi.password}`;
      copyToClipboard(text);
    }
  });

  // Service card click tracking and modal opening
  const chefServiceModal = document.getElementById("chefServiceModal");
  const closeChefModal = document.getElementById("closeChefModal");
  const chefServiceCTA = document.getElementById("chefServiceCTA");

  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const service = card.getAttribute("data-service");
      const modalId = card.getAttribute("data-modal");
      
      console.log(`Service clicked: ${service}`);
      
      // Open modal if specified
      if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal && typeof modal.showModal === "function") {
          modal.showModal();
        } else if (modal) {
          modal.style.display = "block";
          modal.open = true;
        }
      }
    });
  });

  // Chef Service Modal Controls
  if (closeChefModal) {
    closeChefModal.addEventListener("click", () => {
      if (chefServiceModal) {
        if (typeof chefServiceModal.close === "function") {
          chefServiceModal.close();
        } else {
          chefServiceModal.style.display = "none";
          chefServiceModal.open = false;
        }
      }
    });
  }

  // Close modal on backdrop click
  chefServiceModal?.addEventListener("click", (e) => {
    if (e.target === chefServiceModal) {
      chefServiceModal.close();
    }
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chefServiceModal?.open) {
      chefServiceModal.close();
    }
  });

  // Chef Service CTA - Opens WhatsApp
  if (chefServiceCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book the Chef Service."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    chefServiceCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Massages Modal Controls
  const massagesModal = document.getElementById("massagesModal");
  const closeMassagesModal = document.getElementById("closeMassagesModal");
  const massagesCTA = document.getElementById("massagesCTA");

  if (closeMassagesModal) {
    closeMassagesModal.addEventListener("click", () => {
      if (massagesModal) {
        if (typeof massagesModal.close === "function") {
          massagesModal.close();
        } else {
          massagesModal.style.display = "none";
          massagesModal.open = false;
        }
      }
    });
  }

  // Close massages modal on backdrop click
  massagesModal?.addEventListener("click", (e) => {
    if (e.target === massagesModal) {
      massagesModal.close();
    }
  });

  // Massages CTA - Opens WhatsApp
  if (massagesCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Massage Service."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    massagesCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Scuba Diving Modal Controls
  const scubaModal = document.getElementById("scubaModal");
  const closeScubaModal = document.getElementById("closeScubaModal");
  const scubaCTA = document.getElementById("scubaCTA");

  if (closeScubaModal) {
    closeScubaModal.addEventListener("click", () => {
      if (scubaModal) {
        if (typeof scubaModal.close === "function") {
          scubaModal.close();
        } else {
          scubaModal.style.display = "none";
          scubaModal.open = false;
        }
      }
    });
  }

  // Close scuba modal on backdrop click
  scubaModal?.addEventListener("click", (e) => {
    if (e.target === scubaModal) {
      scubaModal.close();
    }
  });

  // Scuba CTA - Opens WhatsApp
  if (scubaCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Scuba Diving excursion."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    scubaCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Kiteboarding Modal Controls
  const kiteboardingModal = document.getElementById("kiteboardingModal");
  const closeKiteboardingModal = document.getElementById("closeKiteboardingModal");
  const kiteboardingCTA = document.getElementById("kiteboardingCTA");

  if (closeKiteboardingModal) {
    closeKiteboardingModal.addEventListener("click", () => {
      if (kiteboardingModal) {
        if (typeof kiteboardingModal.close === "function") {
          kiteboardingModal.close();
        } else {
          kiteboardingModal.style.display = "none";
          kiteboardingModal.open = false;
        }
      }
    });
  }

  kiteboardingModal?.addEventListener("click", (e) => {
    if (e.target === kiteboardingModal) {
      kiteboardingModal.close();
    }
  });

  if (kiteboardingCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book Kiteboarding lessons."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    kiteboardingCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Fishing Modal Controls
  const fishingModal = document.getElementById("fishingModal");
  const closeFishingModal = document.getElementById("closeFishingModal");
  const fishingCTA = document.getElementById("fishingCTA");

  if (closeFishingModal) {
    closeFishingModal.addEventListener("click", () => {
      if (fishingModal) {
        if (typeof fishingModal.close === "function") {
          fishingModal.close();
        } else {
          fishingModal.style.display = "none";
          fishingModal.open = false;
        }
      }
    });
  }

  fishingModal?.addEventListener("click", (e) => {
    if (e.target === fishingModal) {
      fishingModal.close();
    }
  });

  if (fishingCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Fishing excursion."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    fishingCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Freediving Modal Controls
  const freedivingModal = document.getElementById("freedivingModal");
  const closeFreedivingModal = document.getElementById("closeFreedivingModal");
  const freedivingCTA = document.getElementById("freedivingCTA");

  if (closeFreedivingModal) {
    closeFreedivingModal.addEventListener("click", () => {
      if (freedivingModal) {
        if (typeof freedivingModal.close === "function") {
          freedivingModal.close();
        } else {
          freedivingModal.style.display = "none";
          freedivingModal.open = false;
        }
      }
    });
  }

  freedivingModal?.addEventListener("click", (e) => {
    if (e.target === freedivingModal) {
      freedivingModal.close();
    }
  });

  if (freedivingCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Freediving course."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    freedivingCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Whales Modal Controls
  const whalesModal = document.getElementById("whalesModal");
  const closeWhalesModal = document.getElementById("closeWhalesModal");
  const whalesCTA = document.getElementById("whalesCTA");

  if (closeWhalesModal) {
    closeWhalesModal.addEventListener("click", () => {
      if (whalesModal) {
        if (typeof whalesModal.close === "function") {
          whalesModal.close();
        } else {
          whalesModal.style.display = "none";
          whalesModal.open = false;
        }
      }
    });
  }

  whalesModal?.addEventListener("click", (e) => {
    if (e.target === whalesModal) {
      whalesModal.close();
    }
  });

  if (whalesCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Whale Watching tour."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    whalesCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // ATV Rental Modal Controls
  const atvModal = document.getElementById("atvModal");
  const closeAtvModal = document.getElementById("closeAtvModal");
  const atvCTA = document.getElementById("atvCTA");

  if (closeAtvModal) {
    closeAtvModal.addEventListener("click", () => {
      if (atvModal) {
        if (typeof atvModal.close === "function") {
          atvModal.close();
        } else {
          atvModal.style.display = "none";
          atvModal.open = false;
        }
      }
    });
  }

  atvModal?.addEventListener("click", (e) => {
    if (e.target === atvModal) {
      atvModal.close();
    }
  });

  if (atvCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book an ATV rental or adventure tour."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    atvCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Facial Treatment Modal Controls
  const facialModal = document.getElementById("facialModal");
  const closeFacialModal = document.getElementById("closeFacialModal");
  const facialCTA = document.getElementById("facialCTA");

  if (closeFacialModal) {
    closeFacialModal.addEventListener("click", () => {
      if (facialModal) {
        if (typeof facialModal.close === "function") {
          facialModal.close();
        } else {
          facialModal.style.display = "none";
          facialModal.open = false;
        }
      }
    });
  }

  facialModal?.addEventListener("click", (e) => {
    if (e.target === facialModal) {
      facialModal.close();
    }
  });

  if (facialCTA && config.whatsappNumber) {
    const waNumber = formatPhoneForWhatsApp(config.whatsappNumber);
    const waMessage = encodeURIComponent(
      "Hola Palacio, I'd like to book a Facial Treatment."
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    
    facialCTA.addEventListener("click", () => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Newsletter form submission with Supabase
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterSuccess = document.getElementById("newsletterSuccess");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        subscribedAt: new Date().toISOString(),
      };

      try {
        // Try to use Supabase if available
        if (window.subscribeToNewsletter) {
          await window.subscribeToNewsletter(formData);
        } else {
          // Fallback: just log to console if Supabase isn't configured
          console.log("Newsletter signup (Supabase not configured):", formData);
          console.warn("To enable database storage, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel environment variables");
        }

        // Show success message
        newsletterForm.style.display = "none";
        newsletterSuccess.style.display = "block";
        newsletterSuccess.classList.add("active");

      } catch (error) {
        console.error("Newsletter signup error:", error);
        
        // Still show success to user even if database fails
        // (graceful degradation)
        newsletterForm.style.display = "none";
        newsletterSuccess.style.display = "block";
        newsletterSuccess.classList.add("active");
        
        // Log the error for debugging
        console.warn("Newsletter data was not saved to database. Error:", error.message);
      }
    });
  }
})();
