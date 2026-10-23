/*
 * Contact form — sends through EmailJS (same service, template and fields as before:
 * name, email, message), with proper validation, a sending state, on-page
 * success/error messages and a hidden spam trap.
 */
(function () {
    "use strict";

    const PUBLIC_KEY = "n62Zq_2oUHH99CvCd";
    const SERVICE_ID = "service_lirdqis";
    const TEMPLATE_ID = "template_l6qeefq";
    const MIN_FILL_MS = 3000; // bots submit instantly; people take longer than 3s

    const form = document.getElementById("contactForm");
    if (!form) return;

    // EmailJS loads just before this file (deferred); it may be missing if a blocker stopped it.
    if (window.emailjs) window.emailjs.init(PUBLIC_KEY);

    const button = form.querySelector(".submitBtn");
    const status = form.querySelector(".form-status");
    const trap = form.querySelector('input[name="website"]');
    const buttonText = button.textContent;
    const openedAt = Date.now();
    let sending = false;

    function showStatus(type, text) {
        status.textContent = text;
        status.className = "form-status form-status--" + type;
        status.hidden = false;
    }

    function setSending(on) {
        sending = on;
        button.disabled = on;
        button.textContent = on ? "Sending…" : buttonText;
        form.setAttribute("aria-busy", on);
    }

    // Clear an old message as soon as someone starts typing again.
    form.addEventListener("input", () => {
        if (!sending && !status.hidden && status.classList.contains("form-status--error")) {
            status.hidden = true;
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (sending) return;

        // Trim first so a message of just spaces doesn't count as filled in.
        ["name", "email", "message"].forEach((id) => {
            const field = form.elements[id];
            field.value = field.value.trim();
        });

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Spam trap: real visitors never see or fill the hidden field.
        // Pretend it worked so bots don't retry.
        if (trap.value || Date.now() - openedAt < MIN_FILL_MS) {
            form.reset();
            showStatus("success", "Thanks! Your message has been sent. I'll get back to you soon.");
            return;
        }

        if (!window.emailjs) {
            showStatus("error", "The form couldn't load. If you use an ad or script blocker, please allow this site and try again.");
            return;
        }

        const params = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value,
        };

        setSending(true);
        status.hidden = true;

        try {
            await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
            form.reset();
            showStatus("success", "Thanks! Your message has been sent. I'll get back to you soon.");
        } catch (err) {
            console.error("EmailJS error:", err);
            showStatus("error", "Your message didn't send. Please check your connection and try again.");
        } finally {
            setSending(false);
        }
    });
})();
