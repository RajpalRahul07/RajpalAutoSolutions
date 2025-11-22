<template>
  <div class="history-page">
    <h1>Service History</h1>

    <!-- 🔍 Search Section -->
    <div class="filter-section">
      <input v-model="searchQuery" placeholder="Search by name or phone..." />

    </div>

    <!-- 🧾 Table -->
    <div v-if="filteredHistory.length === 0" class="empty">
      No matching records found.
    </div>

    <div v-else class="history-table">
      <table>
        <thead>
          <tr>
            <th>Vehicle Number</th>
            <th>User Name</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Outstanding</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredHistory" :key="index">
            <td>{{ entry.vehicleNumber }}</td>
            <td>{{ entry.username }}</td>
            <td>{{ entry.phone }}</td>
            <td>{{ entry.service }}</td>
            <td>{{ entry.amount }}</td>
            <td>{{ entry.paid }}</td>
            <td>{{ entry.outstanding }}</td>
            <td>{{ formatDate(entry.date) }}</td>
            <td>
              <button @click="markAsPaid(index)" class="mark-paid-btn" v-if="entry.outstanding > 0">Mark Paid</button>
              <button @click="deleteEntry(index)" class="delete-btn">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="clearHistory" class="clear-btn">Clear All History</button>
    <button @click="exportToCSV" class="export-btn">Export CSV</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// === State ===
const history = ref([])
const searchQuery = ref('')

// === Load from localStorage ===
onMounted(() => {
  const stored = localStorage.getItem('serviceHistory')
  if (stored) history.value = JSON.parse(stored)
})

// === Computed filtered list ===
const filteredHistory = computed(() => {
  if (!searchQuery.value.trim()) return history.value
  const q = searchQuery.value.toLowerCase()
  return history.value.filter(
    (h) =>
      h.username.toLowerCase().includes(q) ||
      (h.phone && h.phone.toString().includes(q))  ||
    (h.vehicleNumber && h.vehicleNumber.toLowerCase().includes(q))
  )
})

// === Format date ===
const formatDate = (dateStr) => new Date(dateStr).toLocaleString()

// === Mark as Paid ===
const markAsPaid = (index) => {
  const item = history.value[index]
  item.paid = item.amount
  item.outstanding = 0
  saveHistory()
}

// === Delete individual entry ===
const deleteEntry = (index) => {
  if (confirm('Delete this record?')) {
    history.value.splice(index, 1)
    saveHistory()
  }
}

// === Save to localStorage ===
const saveHistory = () => {
  localStorage.setItem('serviceHistory', JSON.stringify(history.value))
}

// === Clear all history ===
const clearHistory = () => {
  if (confirm('Are you sure you want to clear all history?')) {
    localStorage.removeItem('serviceHistory')
    history.value = []
  }
}

// === Export to CSV ===
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
const exportToCSV = async () => {
  if (history.value.length === 0) {
    alert('No data to export.')
    return
  }

  const headers = ['Vehicle Number', 'User Name', 'Phone', 'Service', 'Amount', 'Paid', 'Outstanding', 'Date']
  const rows = history.value.map((h) => [
    h.vehicleNumber,
    h.username,
    h.phone,
    h.service,
    h.amount,
    h.paid,
    h.outstanding,
    h.date
  ])
 const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const fileName = `service_history_${new Date().toISOString().slice(0, 10)}.csv`

  // ✅ Detect environment
  const isNative = Capacitor.isNativePlatform()

  if (isNative) {
    // --- 📱 For Android / iOS builds ---
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: csvContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
      alert(`CSV saved successfully in Documents folder as ${fileName}`)
    } catch (error) {
      console.error('Error saving file:', error)
      alert('Failed to save CSV file.')
    }
  } else {
    // --- 💻 For browsers ---
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    alert('CSV exported successfully.')
  }
}
</script>

<style scoped>
.history-page {
  max-width: 950px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.filter-section {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filter-section input {
  width: 70%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.export-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 100px auto;
}

.export-btn:hover {
  background: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

th {
  background: #f2f2f2;
}

.mark-paid-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.mark-paid-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  /* margin-bottom: 100px auto; */
}

.delete-btn:hover {
  background: #c82333;
}

.clear-btn {
  margin-top: 20px;
  background: #d9534f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

.empty {
  text-align: center;
  color: gray;
  margin-top: 30px;
}
</style>
