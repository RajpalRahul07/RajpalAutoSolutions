<template>
  <div class="container">
    <h1>Service Management</h1>

    <!-- === Service Selection === -->
    <div class="dropdown-section">
      <label>Select a Service:</label>
      <select v-model="selectedServiceIndex">
        <option v-for="(service, index) in services" :key="index" :value="index">
          {{ service.title }}
        </option>
      </select>

      <label>Select Sub-Service:</label>
      <select v-model="selectedSubServiceIndex">
        <option v-for="(sub, i) in selectedService?.subServices" :key="i" :value="i">
          {{ sub.name }}
        </option>
      </select>
    </div>

    <!-- === Optional Phone Number === -->
    <div class="input-section">
      <label>Phone Number (optional):</label>
      <input v-model="phoneNumber" type="text" placeholder="Enter phone number" />
    </div>

    <!-- === Action Buttons === -->
    <div class="button-section">
      <button @click="shareDocs('whatsapp')" class="whatsapp">Share Docs on WhatsApp</button>
      <button @click="shareDocs('sms')" class="sms">Share Docs via SMS</button>
    </div>

    <hr />

    <!-- === Add / Update Service === -->
    <div class="add-section">
      <h2>Add / Update Service</h2>
      <input v-model="newServiceTitle" placeholder="Service Title" />
      <input v-model="newSubServiceName" placeholder="Sub-Service Name" />
      <input v-model="newDocs"  placeholder="Documents (comma separated)" />
      <button @click="addOrUpdateService" class="saveService" >Save Service</button>
    </div>

    <hr />

    <!-- === Delete Section === -->
    <div class="delete-section">
      <h2>Delete Sub-Service</h2>
      <label>Select Service:</label>
      <select v-model="deleteServiceIndex">
        <option v-for="(service, index) in services" :key="index" :value="index">
          {{ service.title }}
        </option>
      </select>

      <label>Select Sub-Service to Delete:</label>
      <select v-model="deleteSubServiceIndex">
        <option v-for="(sub, i) in services[deleteServiceIndex]?.subServices" :key="i" :value="i">
          {{ sub.name }}
        </option>
      </select>

      <button @click="deleteSubService" class="deleteService">Delete</button>
    </div>

    <!-- === Delete Entire Service === -->
<div class="delete-service">
  <h2>Delete Entire Service</h2>
  <label>Select Service to Delete:</label>
  <select v-model="deleteFullServiceIndex">
    <option v-for="(service, index) in services" :key="index" :value="index">
      {{ service.title }}
    </option>
  </select>

  <button @click="deleteService" class="deleteService">Delete Service</button>
</div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// === Default Services Data ===
const defaultServices = [
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
          "Front photo of vehicle",
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
          "Front photo of vehicle",
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
          "Owner needs to visit RTO office",
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
          "User signature on plain paper",
        ],
      },
      {
        name: "Renew Driving License",
        docs: ["Original Driving License"],
      },
      {
        name: "Duplicate Driving License",
        docs: ["License photo or license number", "E aadhar card copy", "Pan card"],
      },
    ],
  },
  {
    title: "Vehicle Passing",
    subServices: [
      {
        name: "Vehicle Passing",
        docs: ["RC xerox", "Insurance Xerox", "PUC Xerox", "Tax Xerox"],
      },
    ],
  },
];

// === Reactive Data ===
const services = ref([]);
const selectedServiceIndex = ref(0);
const selectedSubServiceIndex = ref(0);
const phoneNumber = ref("");

const newServiceTitle = ref("");
const newSubServiceName = ref("");
const newDocs = ref("");

const deleteServiceIndex = ref(0);
const deleteSubServiceIndex = ref(0);

const selectedService = computed(() => services.value[selectedServiceIndex.value]);

// === Load & Persist Data ===
onMounted(() => {
  try {
    const saved = localStorage.getItem("servicesData");
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      services.value = parsed;
    } else {
      services.value = defaultServices;
      localStorage.setItem("servicesData", JSON.stringify(defaultServices));
    }
  } catch (err) {
    services.value = defaultServices;
  }
});

watch(
  services,
  (val) => {
    localStorage.setItem("servicesData", JSON.stringify(val));
  },
  { deep: true }
);

// === Common Message Creator ===
const createMessage = (service, subService) => {
  const docList = subService.docs.map((doc, i) => `${i + 1}. ${doc}`).join("%0A");
  return `Documents required for *${subService.name}* under *${service.title}*:%0A${docList}\n\nPlease share these for processing. Thank you!\nRajpal Insurance and RTO consultancy.\nSushil Rajpal(Pinto).\n+91 9819893648 | +91 8454904094`;
};

// === Share Docs ===
const shareDocs = (type) => {
  const service = selectedService.value;
  const subService = service.subServices[selectedSubServiceIndex.value];
  const msg = createMessage(service, subService);

  if (type === "whatsapp") {
    const url = phoneNumber.value
      ? `https://wa.me/${phoneNumber.value}?text=${msg}`
      : `https://wa.me/?text=${msg}`;
    window.open(url, "_blank");
  } else if (type === "sms") {
   // if (!phoneNumber.value) return alert("Please enter a phone number for SMS");
    const smsUrl =phoneNumber.value
      ? `sms:${phoneNumber.value}?body=${decodeURIComponent(msg)}`
      : `sms:?body=${decodeURIComponent(msg)}`;
    window.open(smsUrl, "_system");
  }
};

// === Add or Update Service ===
const addOrUpdateService = () => {
  const title = newServiceTitle.value.trim();
  const subName = newSubServiceName.value.trim();
  const docsArray = newDocs.value.split(",").map((d) => d.trim()).filter(Boolean);
  if (!title || !subName || docsArray.length === 0) return alert("Please fill all fields");

  let service = services.value.find((s) => s.title.toLowerCase() === title.toLowerCase());
  if (!service) {
    services.value.push({ title, subServices: [{ name: subName, docs: docsArray }] });
  } else {
    const existing = service.subServices.find(
      (ss) => ss.name.toLowerCase() === subName.toLowerCase()
    );
    if (existing) existing.docs = docsArray;
    else service.subServices.push({ name: subName, docs: docsArray });
  }

  newServiceTitle.value = "";
  newSubServiceName.value = "";
  newDocs.value = "";
};

// === Delete SubService ===
const deleteSubService = () => {
  const sIndex = deleteServiceIndex.value;
  const subIndex = deleteSubServiceIndex.value;
  if (!services.value[sIndex]?.subServices[subIndex]) return;
  if (confirm("Are you sure you want to delete this sub-service?")) {
    services.value[sIndex].subServices.splice(subIndex, 1);
  }
};

const deleteFullServiceIndex = ref(0);

const deleteService = () => {
  const index = deleteFullServiceIndex.value;
  const service = services.value[index];
  if (!service) return alert("Please select a valid service to delete.");

  if (confirm(`Are you sure you want to delete "${service.title}" and all its sub-services?`)) {
    services.value.splice(index, 1);
  }
};
</script>

<style scoped>
.container {
  max-width: 95%;
  width: 800px;
  margin: -70px auto;
  font-family: Arial, sans-serif;
  padding: 16px;
  box-sizing: border-box;
   margin-bottom: 110px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

.delete-service {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}
select,
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.button-section {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

}
.whatsapp {
  background-color: #25d366;
  color: white;
}
.sms {
  background-color: #1a73e8;
  color: white;
}
.add-section,
.delete-section {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}
hr {
  margin-top: 30px;
}

.saveService {
  background-color: #25d366;
  color: white;
  margin-top: 10px;
}

.deleteService {
  background-color: #ff0000;
  color: white;
  margin-top: 10px;
}

@media (max-width: 600px) {
  .button-section {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
