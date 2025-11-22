<template>
  <div class="container">
    <h2>Vehicle Sale Management</h2>

    <!-- Add Vehicle Form -->
    <div class="form">
      <label>Make:</label>
      <input v-model="vehicle.make" placeholder="Enter Make" />

      <label>Model:</label>
      <input v-model="vehicle.model" placeholder="Enter Model" />

      <label>Variant:</label>
      <input v-model="vehicle.variant" placeholder="Enter Variant" />

      <label>Number of Owners:</label>
      <input v-model="vehicle.owners" placeholder="Enter number of owners" />

      <label>Km Driven:</label>
      <input v-model="vehicle.km" placeholder="Enter KM driven" />

      <label>Fuel Type:</label>
      <input v-model="vehicle.fuel" placeholder="Enter fuel type" />

      <label>Insurance Valid Upto:</label>
      <input type="date" v-model="vehicle.insurance" />

      <label>PUC Valid Upto:</label>
      <input type="date" v-model="vehicle.puc" />

      <label>Upload Images:</label>
      <input type="file" multiple @change="onFileChange" />

      <button @click="saveVehicle">Save Vehicle</button>
    </div>

    <hr />

    <!-- Saved Vehicles -->
    <h3>Saved Vehicles</h3>
    <div v-if="vehicles.length === 0">
      <p>No vehicles saved yet.</p>
    </div>

    <div v-for="(v, index) in vehicles" :key="v.id" class="vehicle-card">
      <div class="images">
        <img v-for="(img, i) in v.images" :key="i" :src="img" alt="Vehicle" />
      </div>
      <p><strong>{{ v.make }} {{ v.model }} ({{ v.variant }})</strong></p>
      <p>Owners: {{ v.owners }} | Km: {{ v.km }} | Fuel: {{ v.fuel }}</p>
      <p>Insurance: {{ v.insurance }} | PUC: {{ v.puc }}</p>

      <textarea
        v-model="v.additionalInfo"
        placeholder="Add extra info (optional)"
      ></textarea>

      <button @click="shareIndividual(v)">Share This Vehicle</button>
      <button @click="deleteVehicle(index)">Delete</button>
    </div>

    <div v-if="vehicles.length > 1">
      <hr />
      <button class="share-all" @click="shareAllVehicles">
        Share All Vehicles
      </button>
    </div>
  </div>
</template>

<script>
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";

export default {
  name: "VehicleSale",
  data() {
    return {
      vehicle: {
        make: "",
        model: "",
        variant: "",
        owners: "",
        km: "",
        fuel: "",
        insurance: "",
        puc: "",
        images: [],
      },
      vehicles: [],
    };
  },
  mounted() {
    const saved = localStorage.getItem("vehicles");
    if (saved) this.vehicles = JSON.parse(saved);
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files;
      this.vehicle.images = [];
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.vehicle.images.push(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    saveVehicle() {
      if (!this.vehicle.make || !this.vehicle.model) {
        alert("Please enter Make and Model");
        return;
      }
      const id = Date.now();
      this.vehicles.push({ id, ...this.vehicle, additionalInfo: "" });
      localStorage.setItem("vehicles", JSON.stringify(this.vehicles));
      this.vehicle = {
        make: "",
        model: "",
        variant: "",
        owners: "",
        km: "",
        fuel: "",
        insurance: "",
        puc: "",
        images: [],
      };
      alert("Vehicle saved!");
    },

    deleteVehicle(index) {
      this.vehicles.splice(index, 1);
      localStorage.setItem("vehicles", JSON.stringify(this.vehicles));
    },

    async convertImagesToFiles(images, vehicleId) {
      const fileUris = [];
      for (let i = 0; i < images.length; i++) {
        const base64Data = images[i].split(",")[1]; // strip prefix
        const fileName = `vehicle_${vehicleId}_${i}.jpg`;

        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
        });

        fileUris.push(result.uri);
      }
      return fileUris;
    },

    //Hi   rahul rajpal
    async shareIndividual(v) {
      const text = `🚗 *Vehicle Details:*\n
Make: ${v.make}\nModel: ${v.model}\nVariant: ${v.variant}\nOwners: ${v.owners}\nKm Driven: ${v.km}\nFuel: ${v.fuel}\nInsurance: ${v.insurance}\nPUC: ${v.puc}\n${
        v.additionalInfo ? "\n📘 Notes: " + v.additionalInfo : ""
      }\n\nAvailable for Sale!`;

      try {
        const fileUris = await this.convertImagesToFiles(v.images, v.id);

        await Share.share({
          title: "Vehicle Info",
          text: text,
          files: fileUris,
          dialogTitle: "Share Vehicle Details",
        });
      } catch (err) {
        console.error("Error sharing:", err);
        alert("Unable to share this vehicle.");
      }
    },

    async shareAllVehicles() {
      if (this.vehicles.length === 0) return;

      let text = "🚘 *All Available Vehicles:*\n\n";
      const allFiles = [];

      for (const v of this.vehicles) {
        text += `➡️ ${v.make} ${v.model} (${v.variant})\nOwners: ${v.owners} | Km: ${v.km} | Fuel: ${v.fuel}\nInsurance: ${v.insurance} | PUC: ${v.puc}\n`;
        if (v.additionalInfo) text += `Notes: ${v.additionalInfo}\n`;
        text += "\n";
        const files = await this.convertImagesToFiles(v.images, v.id);
        allFiles.push(...files);
      }

      try {
        await Share.share({
          title: "All Vehicles",
          text: text,
          files: allFiles,
          dialogTitle: "Share All Vehicles",
        });
      } catch (err) {
        console.error("Error sharing all vehicles:", err);
        alert("Unable to share all vehicles.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
  margin-top: -30px ;
  margin-bottom: 100px;
}
.form input {
  display: block;
  margin: 8px auto;
  padding: 8px;
  width: 90%;
}
.vehicle-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.vehicle-card img {
  width: 100px;
  height: 80px;
  margin: 4px;
  object-fit: cover;
  border-radius: 6px;
}
.vehicle-card textarea {
  width: 90%;
  margin: 8px 0;
  padding: 6px;
  border-radius: 6px;
}
button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:first-of-type {
  background-color: #25d366;
  color: white;
}
button:nth-of-type(2) {
  background-color: #d9534f;
  color: white;
}
.share-all {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
}
</style>
