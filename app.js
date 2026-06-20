const tracks = [
  "AI for Sustainable Development",
  "Sustainable Entrepreneurship",
  "Digital Transformation",
  "Diplomacy in the AI Era",
  "AI Policy and Ethics",
  "Green Economy",
  "Future Work",
  "Smart Cities",
  "Health and Human Security",
  "Global Collaboration"
];

const storageKey = "aisedConferencePublicForms";
const registrationState = {
  category: "",
  subsection: "",
  type: ""
};

function getSavedForms() {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

function saveForm(type, data) {
  const items = getSavedForms();
  const reference = `${type.slice(0, 3).toUpperCase()}-${String(Date.now()).slice(-6)}`;
  items.unshift({ reference, type, data, submittedAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(items));
  return reference;
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function bindForm(selector, type, statusSelector) {
  const form = document.querySelector(selector);
  const status = document.querySelector(statusSelector);
  if (!form || !status) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const reference = saveForm(type, readForm(form));
    status.textContent = `Thank you. Reference: ${reference}`;
    form.reset();
  });
}

function populateOptions() {
  const trackSelect = document.querySelector("#track-select");

  if (!trackSelect) {
    return;
  }

  tracks.forEach((track) => {
    const option = document.createElement("option");
    option.value = track;
    option.textContent = track;
    trackSelect.append(option);
  });
}

function buildField(name, label, type = "text", required = true, extra = "") {
  return `<label>${label}<input name="${name}" type="${type}" ${required ? "required" : ""} ${extra}></label>`;
}

function buildSelect(name, label, options, required = true) {
  return `
    <label>${label}
      <select name="${name}" ${required ? "required" : ""}>
        ${options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </label>
  `;
}

function getRegistrationLabel() {
  if (registrationState.category === "call-papers") {
    return `Call for Papers / ${registrationState.subsection} / ${registrationState.type}`;
  }

  if (registrationState.category === "participants") {
    return "Participants / HRD Corp Claimable / Corporate Sector / Government Agencies";
  }

  if (registrationState.category === "partners") {
    return `Partners / ${registrationState.type}`;
  }

  return "Invited Guests";
}

function renderRegistrationFields() {
  const fields = document.querySelector("#registration-fields");
  const summary = document.querySelector("#registration-summary");
  if (!fields || !summary) return;

  summary.textContent = getRegistrationLabel();

  const commonFields = [
    `<input type="hidden" name="registration_category" value="${registrationState.category}">`,
    `<input type="hidden" name="registration_subsection" value="${registrationState.subsection}">`,
    `<input type="hidden" name="registration_type" value="${registrationState.type}">`,
    buildSelect("title", "Title", ["Prof.", "Dr.", "Mr.", "Ms.", "Mrs.", "Dato'", "Datin", "Tan Sri", "Other"]),
    buildField("name", "Full name"),
    buildField("email", "Email", "email"),
    buildField("phone", "Contact number"),
    buildField("organisation", "Organisation"),
    buildField("position", "Position / Designation", "text", false)
  ];

  let routeFields = "";

  if (registrationState.category === "call-papers") {
    routeFields = `
      ${registrationState.type === "Presenter" ? `
        ${buildField("paper_title", "Paper title")}
        <label>Abstract<textarea name="abstract" rows="4" required></textarea></label>
        <label>Paper attachment<input name="paper_attachment" type="file" accept=".pdf,.doc,.docx" required></label>
        <p class="field-note">Attachment upload is prepared for Google Drive integration. Final online storage requires a connected Google Form or secure upload endpoint.</p>
      ` : `
        ${buildSelect("attendance_interest", "Attendance interest", ["Academic sessions", "Keynotes and forums", "Networking", "Full conference"])}
      `}
    `;
  }

  if (registrationState.category === "participants") {
    routeFields = `
      ${buildSelect("participant_sector", "Participant sector", ["HRD Corp Claimable", "Corporate Sector", "Government Agency"])}
      ${buildField("billing_contact", "Billing / HR contact", "text", false)}
      ${buildField("company_registration", "Company / agency registration no.", "text", false)}
    `;
  }

  if (registrationState.category === "invited-guests") {
    routeFields = `
      ${buildSelect("guest_type", "Invitation type", ["Royal / VIP Guest", "Speaker Guest", "Institutional Guest", "Media Guest", "Other"])}
      <label>Invitation note<textarea name="invitation_note" rows="4" placeholder="Protocol notes, dietary needs or assistant contact"></textarea></label>
    `;
  }

  if (registrationState.category === "partners") {
    routeFields = `
      ${buildField("partnership_contact", "Partnership contact person", "text", false)}
      ${buildField("website", "Organisation website", "url", false)}
      <label>Partnership interest<textarea name="partnership_interest" rows="4" placeholder="Tell us how your organisation would like to collaborate" required></textarea></label>
    `;
  }

  fields.innerHTML = `${commonFields.join("")}${routeFields}`;
}

function readRegistrationForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const fileInput = form.querySelector("input[type='file']");
  if (fileInput?.files?.[0]) {
    data.attachmentName = fileInput.files[0].name;
  }
  return data;
}

function initRegistrationWizard() {
  const wizard = document.querySelector("#registration-wizard");
  const form = document.querySelector("#registration-wizard-form");
  const status = document.querySelector("#registration-status");
  if (!wizard || !form || !status) return;

  const panels = [...wizard.querySelectorAll(".wizard-panel")];
  const progressItems = [...wizard.querySelectorAll(".wizard-progress span")];
  const steps = ["category", "subsection", "type", "form"];

  function showStep(step) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.step !== step;
    });
    progressItems.forEach((item, index) => {
      item.classList.toggle("active", index <= steps.indexOf(step));
    });
    status.textContent = "";
  }

  function clearActive(selector) {
    wizard.querySelectorAll(selector).forEach((button) => button.classList.remove("active"));
  }

  wizard.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.type === "submit") return;

    if (button.dataset.category) {
      registrationState.category = button.dataset.category;
      registrationState.subsection = "";
      registrationState.type = "";
      clearActive("[data-category]");
      button.classList.add("active");
      if (registrationState.category === "call-papers") {
        showStep("subsection");
      } else if (registrationState.category === "partners") {
        showStep("partner-type");
      } else {
        renderRegistrationFields();
        showStep("form");
      }
    }

    if (button.dataset.subsection) {
      registrationState.subsection = button.dataset.subsection;
      registrationState.type = "";
      clearActive("[data-subsection]");
      button.classList.add("active");
      showStep("type");
    }

    if (button.dataset.registrationType) {
      registrationState.type = button.dataset.registrationType;
      clearActive("[data-registration-type]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.partnerType) {
      registrationState.type = button.dataset.partnerType;
      clearActive("[data-partner-type]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.back) {
      if (button.dataset.back === "previous") {
        showStep(registrationState.category === "call-papers" ? "type" : registrationState.category === "partners" ? "partner-type" : "category");
      } else {
        showStep(button.dataset.back);
      }
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const reference = saveForm("registration", readRegistrationForm(form));
    status.textContent = `Thank you. Reference: ${reference}`;
    form.reset();
  });

  if (window.location.hash === "#partners") {
    registrationState.category = "partners";
    const partnerButton = wizard.querySelector('[data-category="partners"]');
    partnerButton?.classList.add("active");
    showStep("partner-type");
  }
}

populateOptions();
initRegistrationWizard();
bindForm("#speaker-form", "submission", "#speaker-status");
bindForm("#partner-form", "partner", "#partner-status");
