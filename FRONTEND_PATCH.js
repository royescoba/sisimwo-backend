// ── 1. API base URL ───────────────────────────────────────────
// Change to your live server URL before deploying, e.g.:
//   const API_URL = "https://api.sisimwoestate.co.ke/api";
const API_URL = "http://localhost:5000/api";

async function checkout() {
    const items = Object.values(cart);
    if (items.length === 0) { showToast("Your cart is empty!"); return; }

    // Collect customer details via a simple prompt
    const customerName  = prompt("Your full name:");
    if (!customerName) return;
    const customerEmail = prompt("Your email address:");
    if (!customerEmail) return;
    const customerPhone = prompt("Your phone / WhatsApp (optional):") || "";

    // Payload matches the Order model exactly
    const payload = {
        customerName,
        customerEmail,
        customerPhone,
        items: items.map(i => ({
            id:       i.id,
            name:     i.name,
            category: i.category,
            price:    i.price,
            unit:     i.unit,
            qty:      i.qty,
        })),
    };

    try {
        const res = await fetch(`${API_URL}/orders`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
            showToast("Order placed! Check your email for confirmation.");
            cart = {};
            updateCartUI();
            toggleCart();
        } else {
            showToast(data.error || "Order failed. Please try again.");
        }
    } catch {
        showToast("Could not reach server. Is the backend running?");
    }
}

async function submitComment(e) {
    e.preventDefault();
    const name = document.getElementById("comment-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();
    if (!name || !text) return;

    try {
        const res = await fetch(`${API_URL}/comments`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ name, text }),  // field names match the model
        });

        const data = await res.json();

        if (res.ok) {
            // Prepend the saved comment to the UI
            comments.unshift({ name: data.name, text: data.text, date: data.date });
            renderComments();

            document.getElementById("comment-name").value = "";
            document.getElementById("comment-text").value = "";
            showToast("Thank you for your review!");
            document.getElementById("comments-container")
                .scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            showToast(data.error || "Failed to post comment.");
        }
    } catch {
        showToast("Could not reach server. Is the backend running?");
    }
}

async function loadCommentsFromDB() {
    try {
        const res = await fetch(`${API_URL}/comments`);
        if (!res.ok) return;
        const saved = await res.json();
        // Merge DB comments with defaultComments, avoiding duplicates by name+text
        saved.forEach(c => {
            const exists = comments.some(x => x.name === c.name && x.text === c.text);
            if (!exists) comments.push({ name: c.name, text: c.text, date: c.date });
        });
        renderComments();
    } catch {
        // Backend offline — defaultComments still show, no crash
    }
}
