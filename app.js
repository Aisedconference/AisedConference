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

const callPaperFees = {
  "Academics / Entrepreneurs / Others": {
    Presenter: 1000,
    "Non-Presenter": 700
  },
  "Postgraduate Students": {
    Presenter: 850,
    "Non-Presenter": 350
  }
};

const scopusPublicationFees = {
  "Physical Presentation": 200,
  "Online Presentation": 150
};

const participantFees = {
  "HRD Corp Claimable": 1800,
  "General Admission": 1800,
  "Government Agencies": 1800
};

const payableEstimateCategories = ["call-papers", "participants"];
const hiddenEstimateCategories = ["invited-guests", "partners"];

const maxAttachmentSize = 8 * 1024 * 1024;

function getSavedForms() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch (error) {
    localStorage.removeItem(storageKey);
    return [];
  }
}

function makeReference(type) {
  const stamp = new Date();
  const date = stamp.toISOString().slice(2, 10).replaceAll("-", "");
  const suffix = String(stamp.getTime()).slice(-5);
  return `${type.slice(0, 3).toUpperCase()}-${date}-${suffix}`;
}

function saveForm(type, data, reference = makeReference(type), status = "local") {
  const items = getSavedForms();
  items.unshift({ reference, type, status, data: buildLocalReceipt(data), submittedAt: new Date().toISOString() });
  const recentItems = items.slice(0, 20);

  try {
    localStorage.setItem(storageKey, JSON.stringify(recentItems));
  } catch (error) {
    localStorage.removeItem(storageKey);
    localStorage.setItem(storageKey, JSON.stringify(recentItems.slice(0, 1)));
  }

  return reference;
}

function buildLocalReceipt(data) {
  const receipt = { ...data };

  if (receipt.attachments) {
    receipt.attachments = receipt.attachments.map(stripAttachmentData);
  }

  if (receipt.attachment) {
    receipt.attachment = stripAttachmentData(receipt.attachment);
  }

  return receipt;
}

function stripAttachmentData(attachment) {
  if (!attachment) return attachment;
  const { data, ...safeAttachment } = attachment;
  return safeAttachment;
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

function buildRadioGroup(name, legend, options, required = true) {
  return `
    <fieldset class="radio-group">
      <legend>${legend}</legend>
      <div>
        ${options.map((option, index) => `
          <label>
            <input name="${name}" type="radio" value="${option}" ${required && index === 0 ? "required" : ""}>
            <span>${option}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `;
}

function getCallPaperFeeBreakdown(form) {
  const subsection = form.querySelector("[name='registration_subsection']")?.value || registrationState.subsection;
  const type = form.querySelector("[name='registration_type']")?.value || registrationState.type;
  const submitToScopus = form.querySelector("[name='submit_to_scopus']:checked")?.value || "";
  const scopusMode = form.querySelector("[name='scopus_presentation_mode']")?.value || "";
  const baseFee = callPaperFees[subsection]?.[type] || 0;
  const scopusFee = submitToScopus === "Yes" ? (scopusPublicationFees[scopusMode] || 0) : 0;
  const total = baseFee + scopusFee;

  return { subsection, type, submitToScopus, scopusMode, baseFee, scopusFee, total };
}

function hidePaymentEstimate({ estimateContainer, amountInput, breakdownInput }) {
  if (estimateContainer) estimateContainer.hidden = true;
  if (amountInput) amountInput.value = "";
  if (breakdownInput) breakdownInput.value = "";
}

function updateParticipantEstimate(form, estimateContainer, amountInput, breakdownInput, estimateAmount, estimateBreakdown) {
  const type = form.querySelector("[name='participant_sector']")?.value || registrationState.type;
  const total = participantFees[type] || 0;
  const breakdownText = total ? `${type}: RM${total.toLocaleString("en-MY")}` : "";

  if (estimateContainer) estimateContainer.hidden = false;
  if (estimateAmount) estimateAmount.textContent = total ? `RM${total.toLocaleString("en-MY")}` : "RM0";
  if (estimateBreakdown) estimateBreakdown.textContent = breakdownText;
  if (amountInput) amountInput.value = total ? String(total) : "";
  if (breakdownInput) breakdownInput.value = breakdownText;
}

function updateCallPaperEstimate(form) {
  if (!form) return;

  const estimateContainer = form.querySelector("[data-payable-estimate]");
  const scopusChoice = form.querySelector(".scopus-presentation-choice");
  const scopusModeSelect = form.querySelector("[name='scopus_presentation_mode']");
  const amountInput = form.querySelector("[name='estimated_payable_amount']");
  const breakdownInput = form.querySelector("[name='estimated_fee_breakdown']");
  const estimateAmount = form.querySelector("[data-estimate-amount]");
  const estimateBreakdown = form.querySelector("[data-estimate-breakdown]");

  if (
    hiddenEstimateCategories.includes(registrationState.category) ||
    !payableEstimateCategories.includes(registrationState.category)
  ) {
    hidePaymentEstimate({ estimateContainer, amountInput, breakdownInput });
    return;
  }

  if (registrationState.category === "participants") {
    updateParticipantEstimate(form, estimateContainer, amountInput, breakdownInput, estimateAmount, estimateBreakdown);
    return;
  }

  const { subsection, type, submitToScopus, scopusMode, baseFee, scopusFee, total } = getCallPaperFeeBreakdown(form);

  if (estimateContainer) estimateContainer.hidden = false;

  if (scopusChoice && scopusModeSelect) {
    const needsScopusMode = submitToScopus === "Yes";
    scopusChoice.hidden = !needsScopusMode;
    scopusModeSelect.required = needsScopusMode;
    if (!needsScopusMode) scopusModeSelect.value = "";
  }

  const baseText = baseFee
    ? `${subsection} ${type}: RM${baseFee.toLocaleString("en-MY")}`
    : "Please choose who is registering and Presenter / Non-Presenter.";
  const scopusText = submitToScopus === "Yes"
    ? scopusMode
      ? `SCOPUS indexed publication (${scopusMode}): RM${scopusFee.toLocaleString("en-MY")}`
      : ""
    : "SCOPUS indexed publication: RM0";
  const totalText = total ? `RM${total.toLocaleString("en-MY")}` : "RM0";
  const breakdownText = submitToScopus === "Yes" && !scopusMode
    ? ""
    : `${baseText}${baseFee && scopusText ? ` + ${scopusText}` : ""}`;

  if (estimateAmount) estimateAmount.textContent = totalText;
  if (estimateBreakdown) estimateBreakdown.textContent = breakdownText;
  if (amountInput) amountInput.value = total ? String(total) : "";
  if (breakdownInput) breakdownInput.value = breakdownText;
}

function getFieldLabel(input) {
  const label = input.closest("label");
  if (!label) return input.name;
  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  return textNode?.textContent.trim() || input.name;
}

function getRegistrationEndpoint() {
  return window.AISED_CONFIG?.registrationEndpoint || "";
}

function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    if (file.size > maxAttachmentSize) {
      reject(new Error("Attachment must be below 8MB."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: String(reader.result).split(",").pop()
      });
    });
    reader.addEventListener("error", () => reject(new Error("Could not read the attachment.")));
    reader.readAsDataURL(file);
  });
}

function getRegistrationLabel() {
  if (registrationState.category === "call-papers") {
    return `Call for Papers / ${registrationState.subsection}${registrationState.type ? ` / ${registrationState.type}` : ""}`;
  }

  if (registrationState.category === "participants") {
    return `Participants / ${registrationState.type}`;
  }

  if (registrationState.category === "partners") {
    return `Partners / ${registrationState.type}`;
  }

  if (registrationState.category === "invited-guests") {
    return `Invited Guests / ${registrationState.type}`;
  }

  return "Invited Guests";
}

function renderRegistrationFields() {
  const fields = document.querySelector("#registration-fields");
  const summary = document.querySelector("#registration-summary");
  if (!fields || !summary) return;

  summary.textContent = getRegistrationLabel();

  const registrationTypeField = registrationState.category === "call-papers"
    ? `<label>Presenter / Non-Presenter
        <select id="call-paper-registration-type" name="registration_type" required>
          <option value="">Please select</option>
          <option value="Presenter"${registrationState.type === "Presenter" ? " selected" : ""}>Presenter</option>
          <option value="Non-Presenter"${registrationState.type === "Non-Presenter" ? " selected" : ""}>Non-Presenter</option>
        </select>
      </label>`
    : `<input type="hidden" name="registration_type" value="${registrationState.type}">`;

  const registrationSubsectionField = registrationState.category === "call-papers"
    ? `<label>Who is registering?
        <select id="call-paper-audience" name="registration_subsection" required>
          <option value="">Please select</option>
          <option value="Academics / Entrepreneurs / Others"${registrationState.subsection === "Academics / Entrepreneurs / Others" ? " selected" : ""}>Academics / Entrepreneurs / Others</option>
          <option value="Postgraduate Students"${registrationState.subsection === "Postgraduate Students" ? " selected" : ""}>Postgraduate Students</option>
        </select>
      </label>`
    : `<input type="hidden" name="registration_subsection" value="${registrationState.subsection}">`;

  let commonFields = [
    `<input type="hidden" name="registration_category" value="${registrationState.category}">`,
    registrationSubsectionField,
    registrationTypeField,
    buildSelect("title", "Title", ["Prof.", "Dr.", "Mr.", "Ms.", "Mrs.", "Dato'", "Datin", "Tan Sri", "Other"]),
    buildField("name", "Full name", "text", true, `placeholder="e.g, John Smith"`),
    buildField("email", "Email", "email", true, `placeholder="e.g, name@example.com"`),
    buildField("phone", "Contact number", "tel", true, `placeholder="e.g, +60 12-345 6789"`),
    buildField("organisation", "Organisation", "text", true, `placeholder="e.g, Asia e University"`),
    buildField("position", "Position / Designation", "text", true, `placeholder="e.g, Director / Lecturer / Manager"`)
  ];

  let routeFields = "";

  if (registrationState.category === "call-papers") {
    if (registrationState.type === "Presenter" || registrationState.type === "Non-Presenter") {
      routeFields = `
        ${buildField("paper_title", "Paper title", "text", true, `placeholder="e.g, AI for Sustainable Entrepreneurship in ASEAN"`)}
        <label>Abstract<textarea name="abstract" rows="4" required placeholder="e.g, 250-300 word abstract summary"></textarea></label>
        ${buildRadioGroup("submit_to_scopus", "Submit to SCOPUS", ["Yes", "No"])}
        <div class="scopus-presentation-choice" hidden>
          <label>SCOPUS publication presentation mode
            <select name="scopus_presentation_mode">
              <option value="">Please select</option>
              <option value="Physical Presentation">Physical Presentation (+ RM200)</option>
              <option value="Online Presentation">Online Presentation (+ RM150)</option>
            </select>
          </label>
        </div>
        <label>Abstract / Full paper submission<input name="paper_attachment" type="file" accept=".pdf,.doc,.docx" required></label>
      `;
    } else {
      routeFields = `
        <div class="form-divider"><strong>Presenter status</strong><span>Please choose Presenter or Non-Presenter above to continue.</span></div>
      `;
    }
  }

  if (registrationState.category === "participants") {
    const selectedParticipantType = registrationState.type || "General Admission";
    const participantHiddenField = `<input type="hidden" name="participant_sector" value="${selectedParticipantType}">`;

    let participantFields = "";

    if (selectedParticipantType === "HRD Corp Claimable") {
      commonFields = commonFields.slice(0, 3);
      participantFields = `
        ${buildField("organisation", "1. Company Name", "text", true, `placeholder="e.g, ABC Training Sdn Bhd"`)}
        ${buildField("hrd_employer_id", "2. HRD Corp Employer Code", "text", true, `placeholder="e.g, NA if not registered with HRD Corp"`)}
        <label>3. HRD Corp Claimable Courses (HRD CC)
          <textarea name="hrd_claimable_course" rows="4" required placeholder="e.g, Pending for SBL-Khas application or N/A if not applying"></textarea>
        </label>
        <div class="form-divider"><strong>4. Participant Information</strong><span>Please provide the details of the participant attending the conference.</span></div>
        ${buildField("name", "A. Full Name", "text", true, `placeholder="e.g, John Smith"`)}
        ${buildField("participant_id_number", "B. MyKad / IC Number / Passport Number", "text", true, `placeholder="e.g, 900101-10-1234 or A12345678"`)}
        ${buildField("email", "C. Email Address", "email", true, `placeholder="e.g, participant@example.com"`)}
        ${buildField("phone", "D. Contact Number", "tel", true, `placeholder="e.g, 016-XXX"`)}
        ${buildField("position", "E. Position", "text", true, `placeholder="e.g, HR Manager"`)}
        <div class="form-divider"><strong>Company Contact Information</strong><span>Please provide contact details to ensure smooth communication, especially for HRD Corp matters.</span></div>
        ${buildField("billing_contact", "1. Contact Person", "text", true, `placeholder="e.g, Nurul Huda"`)}
        ${buildField("contact_person_position", "2. Contact Person's Position", "text", true, `placeholder="e.g, Training Coordinator"`)}
        ${buildField("billing_email", "3. Contact Person's Email Address", "email", true, `placeholder="e.g, hr@example.com"`)}
        ${buildField("billing_phone", "4. Contact Person's Phone Number", "tel", true, `placeholder="e.g, +60 12-345 6789"`)}
        <label>5. Company Address<textarea name="company_address" rows="4" required placeholder="e.g, Level 10, Menara ABC, Jalan Example, 50450 Kuala Lumpur"></textarea></label>
      `;
    } else if (selectedParticipantType === "Government Agencies") {
      participantFields = `
        ${buildField("department", "Department / unit", "text", true, `placeholder="e.g, Policy Planning Division"`)}
        ${buildField("billing_contact", "Administrative contact person", "text", true, `placeholder="e.g, Ahmad Zaki"`)}
        ${buildField("billing_email", "Administrative email", "email", true, `placeholder="e.g, admin@agency.gov.my"`)}
        ${buildField("reference_no", "Purchase order / reference no.", "text", true, `placeholder="e.g, PO-2026-001"`)}
        <label>Official notes<textarea name="participant_notes" rows="4" required placeholder="e.g, protocol, billing or approval notes"></textarea></label>
      `;
    } else {
      participantFields = `
        ${buildField("company_registration", "Company registration no.", "text", true, `placeholder="e.g, 202001234567"`)}
        ${buildField("billing_contact", "Billing contact person", "text", true, `placeholder="e.g, Michelle Tan"`)}
        ${buildField("billing_email", "Billing email", "email", true, `placeholder="e.g, finance@example.com"`)}
        ${buildField("reference_no", "Purchase order / reference no.", "text", true, `placeholder="e.g, PO-2026-001"`)}
        <label>Delegate notes<textarea name="participant_notes" rows="4" required placeholder="e.g, invoice, accessibility or other important notes"></textarea></label>
      `;
    }

    routeFields = `
      ${participantHiddenField}
      ${participantFields}
    `;
  }

  if (registrationState.category === "invited-guests") {
    routeFields = `
      <input type="hidden" name="guest_type" value="${registrationState.type}">
      ${registrationState.type === "Speakers" ? `
        <div class="portrait-guide">
          <strong>Professional Speaker Portrait</strong>
          <p>Please upload a clear head-and-shoulders photo suitable for the speaker profile.</p>
          <img src="assets/speaker-portrait-guide.jpg" alt="Speaker portrait photo examples">
          <input name="speaker_photo" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" required>
        </div>
        <div class="bio-guide">
          <strong>Short Speaker Biography</strong>
          <p>Please write 80-120 words in third person for the speaker profile, including current role, organisation, expertise, and one or two relevant achievements.</p>
          <textarea name="speaker_biography" rows="5" required placeholder="e.g, John Smith is a policy strategist at Example University. His work focuses on AI governance, sustainable entrepreneurship and regional innovation..."></textarea>
        </div>
      ` : `
        <label>Is there anything we need to take note<textarea name="invitation_note" rows="4" required placeholder="e.g, protocol notes, assistant contact or arrival details"></textarea></label>
      `}
    `;
  }

  if (registrationState.category === "partners") {
    commonFields = [
      `<input type="hidden" name="registration_category" value="${registrationState.category}">`,
      `<input type="hidden" name="registration_subsection" value="${registrationState.subsection}">`,
      `<input type="hidden" name="registration_type" value="${registrationState.type}">`,
      `<input type="hidden" name="title" value="">`,
      `<div class="form-divider"><strong>Organisation Details</strong><span>Please provide the official organisation information for this partnership registration.</span></div>`,
      buildField("organisation", "Organisation", "text", true, `placeholder="e.g, Asia e University"`),
      buildField("website", "Organisation website", "url", true, `placeholder="e.g, https://www.example.org"`),
      `<div class="form-divider"><strong>Organisation Representative</strong><span>Please provide the person in charge for this partnership registration.</span></div>`,
      buildField("name", "Representative / PIC name", "text", true, `placeholder="e.g, John Smith"`),
      buildField("position", "Position / Designation", "text", true, `placeholder="e.g, Director / Manager / Coordinator"`),
      buildField("email", "Representative / PIC email", "email", true, `placeholder="e.g, name@example.com"`),
      buildField("phone", "Representative / PIC contact number", "tel", true, `placeholder="e.g, +60 12-345 6789"`)
    ];

    routeFields = `
      <label>Partnership interest<textarea name="partnership_interest" rows="4" placeholder="e.g, strategic collaboration, media support or ecosystem partnership" required></textarea></label>
      <div class="form-divider"><strong>Partner Documents</strong><span>Please upload the files required for partnership confirmation.</span></div>
      <label>Organisation Logo<input name="organisation_logo" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,.svg" required></label>
      <label>Partner Acceptance Letter<input name="partner_acceptance_letter" type="file" accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg" required></label>
    `;
  }

  fields.innerHTML = `${commonFields.join("")}${routeFields}`;
  updateCallPaperEstimate(fields.closest("form"));
}

async function readRegistrationForm(form) {
  updateCallPaperEstimate(form);
  const data = Object.fromEntries(new FormData(form).entries());
  const fileInputs = Array.from(form.querySelectorAll("input[type='file']"));
  const attachments = [];

  for (const fileInput of fileInputs) {
    delete data[fileInput.name];

    if (fileInput.files?.[0]) {
      const payload = await fileToPayload(fileInput.files[0]);
      attachments.push({
        ...payload,
        field: fileInput.name,
        label: getFieldLabel(fileInput)
      });
    }
  }

  if (attachments.length) {
    data.attachments = attachments;
    data.attachmentName = attachments.map((attachment) => `${attachment.label}: ${attachment.name}`).join(" | ");
    data.attachment = attachments[0];
  }
  return data;
}

async function submitRegistration(data) {
  const reference = makeReference("registration");
  const payload = {
    reference,
    submittedAt: new Date().toISOString(),
    source: "AiSED website",
    registrationLabel: getRegistrationLabel(),
    ...data
  };
  const endpoint = getRegistrationEndpoint();

  if (!endpoint) {
    saveForm("registration", payload, reference, "local-only");
    return { reference, online: false };
  }

  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  saveForm("registration", payload, reference, "sent");
  return { reference, online: true };
}

function initRegistrationWizard() {
  const wizard = document.querySelector("#registration-wizard");
  const form = document.querySelector("#registration-wizard-form");
  const status = document.querySelector("#registration-status");
  if (!wizard || !form || !status) return;

  const panels = [...wizard.querySelectorAll(".wizard-panel")];
  const progressItems = [...wizard.querySelectorAll(".wizard-progress span")];
  const steps = ["category", "subsection", "form"];

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
      } else if (registrationState.category === "participants") {
        showStep("participant-type");
      } else if (registrationState.category === "invited-guests") {
        showStep("guest-type");
      } else if (registrationState.category === "partners") {
        showStep("partner-type");
      } else {
        renderRegistrationFields();
        showStep("form");
      }
    }

    if (button.dataset.subsection) {
      registrationState.subsection = button.dataset.subsection;
      clearActive("[data-subsection]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.openCallPaperForm !== undefined) {
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.registrationType) {
      registrationState.type = button.dataset.registrationType;
      clearActive("[data-registration-type]");
      button.classList.add("active");
      if (registrationState.category === "call-papers") {
        renderRegistrationFields();
        showStep("form");
      }
    }

    if (button.dataset.partnerType) {
      registrationState.type = button.dataset.partnerType;
      clearActive("[data-partner-type]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.participantType) {
      registrationState.subsection = button.dataset.participantType;
      registrationState.type = button.dataset.participantType;
      clearActive("[data-participant-type]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.guestType) {
      registrationState.subsection = button.dataset.guestType;
      registrationState.type = button.dataset.guestType;
      clearActive("[data-guest-type]");
      button.classList.add("active");
      renderRegistrationFields();
      showStep("form");
    }

    if (button.dataset.back) {
      if (button.dataset.back === "previous") {
        showStep(registrationState.category === "call-papers" ? "subsection" : registrationState.category === "participants" ? "participant-type" : registrationState.category === "invited-guests" ? "guest-type" : registrationState.category === "partners" ? "partner-type" : "category");
      } else {
        showStep(button.dataset.back);
      }
    }
  });

  form.addEventListener("change", (event) => {
    if (registrationState.category === "call-papers" && event.target.name === "registration_subsection") {
      registrationState.subsection = event.target.value;
      renderRegistrationFields();
      return;
    }

    if (registrationState.category === "call-papers" && event.target.name === "registration_type") {
      registrationState.type = event.target.value;
      renderRegistrationFields();
      return;
    }

    if (
      registrationState.category === "call-papers" &&
      (event.target.name === "submit_to_scopus" || event.target.name === "scopus_presentation_mode")
    ) {
      updateCallPaperEstimate(form);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    status.textContent = "Submitting...";

    try {
      const result = await submitRegistration(await readRegistrationForm(form));
      status.textContent = result.online
        ? `Thank you. Reference: ${result.reference}. Your confirmation email will be sent shortly.`
        : `Thank you. Reference: ${result.reference}. Submission is saved locally until the Google database endpoint is connected.`;
      form.reset();
    } catch (error) {
      status.textContent = error.message || "Submission could not be completed. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });

  if (window.location.hash === "#partners") {
    registrationState.category = "partners";
    const partnerButton = wizard.querySelector('[data-category="partners"]');
    partnerButton?.classList.add("active");
    showStep("partner-type");
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("category") === "call-papers") {
    registrationState.category = "call-papers";
    const callPapersButton = wizard.querySelector('[data-category="call-papers"]');
    callPapersButton?.classList.add("active");

    const requestedSubsection = params.get("subsection");
    const requestedType = params.get("type");

    if (requestedSubsection) {
      registrationState.subsection = requestedSubsection;
    }

    if (requestedType) {
      registrationState.type = requestedType;
    }

    if (registrationState.subsection || registrationState.type) {
      renderRegistrationFields();
      showStep("form");
      return;
    }

    showStep("subsection");
  }
}

populateOptions();
initRegistrationWizard();
bindForm("#speaker-form", "submission", "#speaker-status");
bindForm("#partner-form", "partner", "#partner-status");
