// ✅ Promo codes database representing allowed Telegram user IDs (for info routing)
const promoList = [
  { code: "6976365864" },  // Your Telegram ID
  { code: "1234567890" },  // Example ID
  { code: "9876543210" },
   { code: "5273788375" },
   { code: "7979664801" },
{ code: "6940101627" },
{ code: "6551769849" },
{ code: "6853136424" },
{ code: "7593407632" },
{ code: "7821615443" },
  // Add more allowed Telegram user IDs here
  
];

// ✅ Handle "Start Earning" click from index.html
function goToSignup() {
  const enteredCode = document.getElementById("promoCode").value.trim();

  const match = promoList.find(promo => promo.code === enteredCode);

  if (match) {
    // ✅ Redirect to signup.html with promo code representing Telegram user ID
    const url = `signup.html?promo=${encodeURIComponent(match.code)}`;
    window.location.href = url;
  } else if (enteredCode === "") {
    // ✅ No promo code entered, go to signup without params
    window.location.href = "signup.html";
  } else {
    // ❌ Invalid promo code (Telegram user ID) entered
    alert("Invalid promo code. Please make sure you received a valid invite.");
  }
}

// ✅ Scroll to promo section
function scrollToPromo() {
  document.getElementById("promo-section").scrollIntoView({ behavior: "smooth" });
}

// ✅ On the signup.html page, auto-fill promo input from URL param
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const promo = params.get("promo");
  if (promo) {
    const promoInput = document.getElementById("promoInput");
    if (promoInput) {
      promoInput.value = promo;
    }
  }
});