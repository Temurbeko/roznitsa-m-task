<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Bitcoin Price Tracker</h1>
    
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="option in periodOptions"
          :key="option.value"
          @click="setPeriod(option.value)"
          :class="[
            'px-4 py-2 rounded',
            currentPeriod === option.value 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
      
      <div v-if="currentPeriod === 'custom'" class="flex flex-wrap gap-4 my-4">
        <div>
          <label class="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            v-model="customStartDate"
            class="border rounded px-2 py-1"
            @change="fetchPriceData"
          />
        </div>
        <div>
          <label class="block text-sm mb-1">End Date</label>
          <input
            type="date"
            v-model="customEndDate"
            class="border rounded px-2 py-1"
            @change="fetchPriceData"
          />
        </div>
      </div>
    </div>
    
    <div class="bg-white p-4 rounded shadow-md">
      <h2 class="text-xl mb-4">Price Chart</h2>
      <ClientOnly>
        <BitcoinPriceChart :chartData="chartData" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BitcoinPriceChart from '~/components/BitcoinPriceChart.vue'

const priceData = ref([])
const currentPeriod = ref('week')
const customStartDate = ref(formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
const customEndDate = ref(formatDate(new Date()))
const isLoading = ref(false)

const periodOptions = [
  { value: 'day', label: '24 Hours' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'custom', label: 'Custom Range' }
]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function setPeriod(period) {
  currentPeriod.value = period
  fetchPriceData()
}

async function fetchPriceData() {
  isLoading.value = true
  
  try {
    let url = `/api/bitcoin-prices?period=${currentPeriod.value}`
    
    if (currentPeriod.value === 'custom') {
      url += `&start=${customStartDate.value}&end=${customEndDate.value}`
    }
    
    const response = await fetch(url)
    const result = await response.json()
    
    if (result.success) {
      priceData.value = result.data
    } else {
      console.error('Failed to fetch price data:', result.error)
    }
  } catch (error) {
    console.error('Error fetching price data:', error.message)
  } finally {
    isLoading.value = false
  }
}

const chartData = computed(() => {
  return {
    labels: priceData.value.map(item => {
      const date = new Date(item.timestamp)
      return date.toLocaleString()
    }),
    datasets: [
      {
        label: 'Price (USD)',
        data: priceData.value.map(item => item.price_usd),
        borderColor: '#1E88E5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        borderWidth: 2,
        fill: true
      }
    ]
  }
})

onMounted(() => {
  fetchPriceData()
})
</script>