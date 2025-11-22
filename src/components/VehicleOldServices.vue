<template>
  <div class="about-container">
    <h1>Available Services</h1>

    <!-- Optional Phone Number -->
    <div class="phone-input">
      <label>
        Enter Phone Number (optional):
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="e.g. 919876543210"
        />
      </label>
    </div>

    <!-- Service Category Dropdown -->
    <div class="service-select">
      <label for="service">Select a Service:</label>
      <select id="service" v-model="selectedService">
        <option disabled value="">-- Select Service --</option>

        <optgroup
          v-for="(category, i) in services"
          :key="i"
          :label="category.title"
        >
          <option
            v-for="(sub, j) in category.subServices"
            :key="j"
            :value="sub"
          >
            {{ sub.name }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <button
        :disabled="!selectedService"
        @click="sendWhatsApp"
        class="whatsapp"
      >
        Send via WhatsApp
      </button>
      <button
        :disabled="!selectedService"
        @click="sendSMS"
        class="sms"
      >
        Send via SMS
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const phoneNumber = ref("");
const selectedService = ref("");

// === Services Data ===
const services = [
  {
    title: "RC Related Services",
    subServices: [
      {
        name: "Car/Bike RC Transfer",
        docs: [
          "Original RC",
          "Insurance Copy- xerox",
          "PUC xerox",
          "E Aadhar Card of buyer and seller both",
          "Pan Card of buyer and seller both",
          "Buyer Light bill",
          "2 chasis print",
          "for number 29 and 30 with signature",
          "Front photo of vehicle"
        ],
      },
      {
        name: "Truck RC Transfer",
        docs: [
          "Original RC",
          "Permit original",
          "Insurance Copy- xerox",
          "PUC xerox",
          "Fitness xerox",
          "Tax Xerox",
          "Chasis Photo",
          "Self-attested E Aadhar Card of buyer and seller both",
          "Self-attested Pan Card of buyer and seller both",
          "Self-attested Buyer's Light bill",
          "5 chasis print",
          "TTO form with signature",
          "Front photo of vehicle"
        ],
      },
      {
        name: "RC Duplicate",
        docs: [
            "RC xerox",
            "Vehicle number",
           "Police complaint Copy",
           "Insurance Xerox",
           "PUC Xerox",
            "Front photo of vehicle",
           "2 Chassis Print",
           "Owner needs to visit RTO office"
        ],
      },
    ],
  },
   {
    title: "Driving License Related Services",
    subServices: [
      {
        name: "New Driving License",
        docs: [
          "E aadhar card copy",
          "Pan card",
          "2 passport size photos",
          "User signature on plain paper"
        ],
      },
      {
        name: "Renew Driving License",
        docs: [
          "Original Driving License",
        ],
      },
      {
        name: "Duplicate Driving License",
        docs: [
          "License photo or license number",
          "E aadhar card copy",
          "Pan card",
        ],
      },
    ],
  },
  {
    title: "Vehicle Passing",
    subServices: [
      {
        name: "Vehicle Passing",
        docs: [
          "RC xerox",
          "Insurance Xerox",
          "PUC Xerox",
          "Tax Xertox"
        ],
      },
    ],
  },

];

// ✅ Common message generator
const generateMessage = (serviceName, docs) => {
  return (
    `Documents required for *${serviceName}*:\n\n` +
    docs.map((d, i) => `${i + 1}. ${d}`).join("\n") +
    "\n\nPlease share these for processing. Thank you!"
  );
};

// ✅ WhatsApp share
const sendWhatsApp = () => {
  if (!selectedService.value) return;
  const { name, docs } = selectedService.value;
  const message = generateMessage(name, docs);
  const encoded = encodeURIComponent(message);
  const url = phoneNumber.value
    ? `https://wa.me/${phoneNumber.value}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
  window.open(url, "_blank");
};

// ✅ SMS share
const sendSMS = () => {
  if (!selectedService.value) return;
  const { name, docs } = selectedService.value;
  const message = generateMessage(name, docs);
  const encoded = encodeURIComponent(message);
  const url = phoneNumber.value
    ? `sms:${phoneNumber.value}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.open(url, "_system");
};
</script>

<style scoped>
.about-container {
  max-width: 600px;
  margin: -10px auto;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phone-input,
.service-select {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
}

button.whatsapp {
  background: #25d366;
}

button.whatsapp:hover {
  background: #1ebe57;
}

button.sms {
  background: #007aff;
}

button.sms:hover {
  background: #005fcb;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.about-container {
  max-width: 90%;
  width: 100%;
  margin: 30px auto;
  padding: 25px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  /*overflow: visible;  ✅ ensures dropdowns can expand outside */
}

/* Prevent select box cutoff */
select {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: visible;
}

/* Responsive layout */
@media (max-width: 600px) {
  .about-container {
    padding: 15px;
    font-size: 14px;
  }

  select,
  input {
    font-size: 14px;
  }
}
</style>
