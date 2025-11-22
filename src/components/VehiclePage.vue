<template>
  <div class="app-container">
    <h1>Vehicle Service Entry</h1>

    <form @submit.prevent class="form-container">
      <label>
        User Name:
        <input v-model="userName" type="text" required />
      </label>
      <label>
        User Phone Number:
        <input v-model="UserPhoneNumber" type="number"  min="0" required />
      </label>
      <label>
        Vehicle Number:
        <input v-model="vehicleNumber" type="text" required />
      </label>
      <label>
        Vehicle Type:
         <select v-model="VehicleType">
          <option disabled value="">Select vehicle</option>
          <option>Truck</option>
          <option>Car</option>
          <option>Bike</option>
        </select>
      </label>

      <label>
        Required Vehicle Service:
        <select v-model="serviceType" @change="handleServiceChange">
          <option disabled value="">Select service</option>
          <option>Vehicle passing</option>
          <option>Rc Transfer</option>
          <option>New Driving License</option>
          <option>Renew Driving License</option>

          <option>Others</option>
        </select>
      </label>

      <label v-if="serviceType === 'Others'">
        Enter Service Type:
        <input v-model="customService" type="text" />
      </label>

      <label>
        Service Charge:
        <input v-model.number="serviceCharge" type="number" min="0" />
      </label>

      <label>
        Amount Paid:
        <input v-model.number="amountPaid" type="number" min="0" />
      </label>

      <label>
        Outstanding Amount:
        <input :value="outstandingAmount" type="number" readonly />
      </label>

      <button type="submit" @click="sendWhatsAppMessage" :disabled="!isFormComplete">Send WhatsApp Message</button>
      <button type="submit" class="sms" @click="sendSMS" :disabled="!isFormComplete">Send SMS</button>
    </form>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const userName = ref("");
const UserPhoneNumber = ref("");
const vehicleNumber = ref("");
const serviceType = ref("");
const customService = ref("");
const VehicleType = ref("");
const serviceCharge = ref(0);
const amountPaid = ref(0);

// ✅ Check if all fields are filled
const isFormComplete = computed(() => {
  return (
    userName.value.trim() &&
    String(UserPhoneNumber.value).trim() &&
    vehicleNumber.value.trim() &&
    serviceType.value.trim() &&
    VehicleType.value.trim() &&
    String(serviceCharge.value).trim() &&

    // Include customService only when "Others" is selected
    (serviceType.value !== 'Others' || customService.value.trim())
  )
})

const outstandingAmount = computed(() => {
  return serviceCharge.value - amountPaid.value;
});

const handleServiceChange = () => {
  if (serviceType.value !== "Others") {
    customService.value = "";
  }
};

const saveToHistory = (vehicleNumber, username, phone, service, amount, paid, outstanding) => {
  const entry = {
    vehicleNumber,
    username,
    phone,
    service,
    amount,
    paid,
    outstanding,
    date: new Date().toISOString(),
  }

  const existing = JSON.parse(localStorage.getItem('serviceHistory')) || []
  existing.push(entry)
  localStorage.setItem('serviceHistory', JSON.stringify(existing))
}

const buildMessage = () => {
  const requiredService =
    serviceType.value === 'Others' ? customService.value : serviceType.value
    saveToHistory(vehicleNumber.value,userName.value, UserPhoneNumber.value, requiredService, serviceCharge.value, amountPaid.value, outstandingAmount.value)

  return `Hello *${userName.value}*. Your *${requiredService}* request for vehicle type *${VehicleType.value}* and number *${vehicleNumber.value}* has been received. Amount paid: *Rs. ${amountPaid.value}/-*. Outstanding Amount:  *Rs. ${outstandingAmount.value}/-*. \nThank You!\nRajpal Insurance and RTO consultancy.\nSushil Rajpal(Pinto).\n+91 9819893648 | +91 8454904094`;
}

const sendWhatsAppMessage = () => {
  // const requiredService =
  //   serviceType.value === "Others" ? customService.value : serviceType.value;
  // const message = `Hello ${userName.value}. your ${requiredService} request for vehicle type ${VehicleType.value} and number ${vehicleNumber.value} has been received. Amount paid: ${amountPaid.value}. Outstanding Amount: ${outstandingAmount.value}. \nThank You!\nRajpal Insurance and RTO consultancy.\nSushil Rajpal(Pinto).\n+91 9819893648 | +91 8454904094`;

  const encodedMessage = encodeURIComponent(buildMessage());
  const whatsappURL = `https://wa.me/91${UserPhoneNumber.value}?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
};
// SMS function
const sendSMS = () => {
  // const requiredService =
  //   serviceType.value === "Others" ? customService.value : serviceType.value;

  // const message = `Hello ${userName.value}. your ${requiredService} request for vehicle type ${VehicleType.value} and number ${vehicleNumber.value} has been received. Amount paid: ${amountPaid.value}. Outstanding Amount: ${outstandingAmount.value}. \nThank You!\nRajpal Insurance and RTO consultancy.\nSushil Rajpal(Pinto).\n+91 9819893648 | +91 8454904094`;

  const encodedMessage = encodeURIComponent(buildMessage());
  const smsURL = `sms:91${UserPhoneNumber.value}?body=${encodedMessage}`;
  // window.open(smsURL, "_blank");
  window.open(smsURL, "_system");
};
</script>

<style scoped>
.app-container {
  max-width: 400px;
  margin: -10px auto;
  padding: 20px;
  border-radius: 10px;
  background: #f7f7f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
   margin-bottom: 110px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}
input,
select,
button {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  background: #25d366;
  color: white;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.sms {
  background: #2a8fe2;
  color: white;
  cursor: pointer;
}
/* button:hover {
  background: #e0f52a;
} */
</style>