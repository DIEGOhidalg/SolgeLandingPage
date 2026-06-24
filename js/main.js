const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".fade-up");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const mobileMenu = document.querySelector("#mobileMenu");
const whatsappBase = "https://wa.me/56950692595?text=";
const defaultWhatsAppMessage = "Hola Solge Ambiental, quiero el Sello HuellaChile para mi empresa.";

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const target = targetId && targetId !== "#" ? document.querySelector(targetId) : null;
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (mobileMenu && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getInstance(mobileMenu);
      instance?.hide();
    }
  });
});

function setFieldError(field, message) {
  const feedback = field.parentElement.querySelector(".field-error");
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  if (feedback) feedback.textContent = message;
}

function clearFieldError(field) {
  const feedback = field.parentElement.querySelector(".field-error");
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  if (feedback) feedback.textContent = "";
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
  const cleaned = value.replace(/[^\d+]/g, "");
  return /^(?:\+?56)?9\d{8}$/.test(cleaned);
}

function setFormStatus(message = "", type = "") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = type ? `form-status form-status--${type} mb-3` : "form-status mb-3";
}

function setSubmitting(isSubmitting) {
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "Enviando..." : "Enviar solicitud";
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormStatus();

  const fields = {
    names: form.querySelector("#names"),
    whatsapp: form.querySelector("#whatsapp"),
    email: form.querySelector("#email"),
    company: form.querySelector("#company"),
    teamSize: form.querySelector("#team-size"),
    message: form.querySelector("#message"),
  };

  let isValid = true;

  [
    [fields.names, "Cuéntanos tu nombre para poder responderte."],
    [fields.whatsapp, "Déjanos un WhatsApp chileno para contactarte."],
    [fields.email, "Necesitamos un correo para enviarte información."],
    [fields.company, "Indica el nombre de tu empresa."],
    [fields.teamSize, "Indica cuántas personas trabajan en tu empresa."],
  ].forEach(([field, message]) => {
    if (!field.value.trim()) {
      setFieldError(field, message);
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });

  if (fields.whatsapp.value.trim() && !validatePhone(fields.whatsapp.value)) {
    setFieldError(fields.whatsapp, "Ingresa un número chileno válido, por ejemplo +56 9 1234 5678.");
    isValid = false;
  }

  if (fields.email.value.trim() && !validateEmail(fields.email.value)) {
    setFieldError(fields.email, "Ingresa un correo válido, por ejemplo nombre@empresa.cl.");
    isValid = false;
  }

  if (fields.teamSize.value.trim() && Number(fields.teamSize.value) < 1) {
    setFieldError(fields.teamSize, "Ingresa un número de personas mayor a cero.");
    isValid = false;
  }

  if (!isValid) return;

  try {
    setSubmitting(true);
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "No pudimos enviar tu solicitud. Inténtalo nuevamente o escríbenos por WhatsApp.");
    }

    form.reset();
    setFormStatus("Solicitud enviada. Te contactaremos pronto para revisar el proceso de Diploma y Sello HuellaChile.", "success");
  } catch (error) {
    setFormStatus(error.message, "error");
  } finally {
    setSubmitting(false);
  }
});

document.querySelectorAll(".whatsapp-action").forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message || defaultWhatsAppMessage;
    window.open(whatsappBase + encodeURIComponent(message), "_blank", "noopener");
  });
});
