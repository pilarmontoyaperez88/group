<script setup lang="ts">
import { computed, ref } from "vue";
// console.log('Rango', rangeOfDays)
// const rangeStart = rangeOfDays.value[0];
// const rangeEnd = rangeOfDays.value[rangeOfDays.value.length - 1];


// const totalDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 3600 * 24)) + 1;
// const bookingStart = new Date(bookingWindowStart.value);
// const bookingEnd = new Date(bookingWindowEnd.value);

// const travelStart = new Date(travelPeriodStart.value);
// const travelEnd = new Date(travelPeriodEnd.value);

// const bookingDuration = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 3600 * 24)) + 1;
// const travelDuration = Math.ceil((travelEnd.getTime() - travelStart.getTime()) / (1000 * 3600 * 24)) + 1;

// const bookingPercentage = (bookingDuration / totalDays) * 100;
// const travelPercentage = (travelDuration / totalDays) * 100;

// const bookingStartPercentage = ((bookingStart.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * 100;

// const travelStartPercentage = ((travelStart.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * 100;

// Datos estáticos
const bookingWindowStart = ref('2025-02-10T14:30:00');
const bookingWindowEnd = ref('2025-02-10T14:30:00');
const travelPeriodStart = ref('2025-03-01T14:30:00');
const travelPeriodEnd = ref('2025-03-07T14:30:00');
const travelPeriodPostDays = ref(3);
const travelPeriodPreviousDays = ref(1);

const today = new Date();

// Convertir las fechas a tipo Date
const startBooking = ref(new Date(bookingWindowStart.value));
const endBooking = ref(new Date(bookingWindowEnd.value));
const startTravel = ref(new Date(travelPeriodStart.value));
const endTravel = ref(new Date(travelPeriodEnd.value));

// Cálculos reactivos
const todayIndex = computed(() => {
  return dateMarkers.value.findIndex(
    (date) => formatDate(date) === formatDate(today)
  );
});

const extendTravel = computed(() => {
  return new Date(endTravel.value.getTime() + (1 + travelPeriodPostDays.value) * 24 * 60 * 60 * 1000);
});

const bookingDays = computed(() =>
  Math.ceil((endBooking.value.getTime() - startBooking.value.getTime()) / (1000 * 60 * 60 * 24))
);

const travelDays = computed(() =>
  Math.ceil((endTravel.value.getTime() - startTravel.value.getTime()) / (1000 * 60 * 60 * 24))
);

const timelineDays = computed(
  () =>
    Math.ceil((extendTravel.value.getTime() - startBooking.value.getTime()) / (1000 * 60 * 60 * 24)) + 3
);

const bookingWidth = computed(
  () => `${((bookingDays.value + 1) / timelineDays.value) * 100}%`
);

const travelWidth = computed(
  () => `${((travelDays.value + 1) / timelineDays.value) * 100}%`
);

const addPreDaysWidth = computed(() => {
  return `${(travelPeriodPreviousDays.value / timelineDays.value) * 100}%`;
});

const addPostDaysWidth = computed(() => {
  return `${(travelPeriodPostDays.value / timelineDays.value) * 100}%`;
});

const totalTavelWidth = (
  parseFloat(addPostDaysWidth.value) +
  parseFloat(addPreDaysWidth.value) +
  parseFloat(travelWidth.value)
);

const adjustedStartBooking = computed(() => {
  return new Date(startBooking.value.getTime() - 2 * 24 * 60 * 60 * 1000); // Restar 2 días
});

const dateMarkers = computed(() => {
  const markers: Date[] = [];
  let currentDate = new Date(adjustedStartBooking.value);
  let monthDate = new Date(adjustedStartBooking.value);
  monthDate.setDate(1);

  if (timelineDays.value <= 40) {
    for (let i = 0; i < timelineDays.value; i++) {
      markers.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    while (monthDate < extendTravel.value) {
      markers.push(new Date(monthDate));
      monthDate.setMonth(monthDate.getMonth() + 1);
    }
  }
  return markers;
});

const marginOffsetBooking = computed(() => (100 / timelineDays.value) * 2);
const marginOffsetTravel = computed(() => (100 / timelineDays.value) * 1);

// Función de formato de fecha
const formatDate = (d: string | number | Date): string => {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTimeline = (d: string | number | Date, withMonth: boolean = false): string => {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(2025, i, 1))
  );
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAsString = months[date.getMonth()];
  const format = withMonth ? `${day} ${monthAsString}` : `${day}`;
  return format;
};
</script>

<template>
  <div class="app-container">
    <div
      class="range-booking"
      v-if="parseFloat(bookingWidth) > 10"
      :style="{ width: bookingWidth, marginLeft: `${marginOffsetBooking}%` }"
    >
      <span>{{ formatDate(startBooking) }}</span> -
      <span>{{ formatDate(endBooking) }}</span>
    </div>

    <div class="legen-booking" v-else>
      <div
        class="range-booking"
        :style="{ width: bookingWidth, marginLeft: `${marginOffsetBooking}%` }"
      >
        <div class="content-icon"></div>
      </div>
      <div class="">
        <div class="label-legen-booking">
          <span
            >{{ formatDate(startBooking) }} -
            {{ formatDate(endBooking) }}</span
          >
        </div>
      </div>
    </div>

    <div class="text-booking">Reserva</div>

    <div class="timeline-container">
      <div class="markers-container">
        <div v-for="(date, index) in dateMarkers" :key="index" class="marker">
          <span class="marker-label">{{ formatDateTimeline(date, true) }}</span>
          <span class="marker-line"></span>
          <div v-if="index === todayIndex" class="today-marker">
            <span class="today-label">Hoy</span>
          </div>
        </div>
      </div>

      <div class="range-timeline">
        <div class="add-timeline"></div>
      </div>
    </div>

    <div class="text-travel">Viaje</div>

    <div class="add-days-range-travel">
      <div class="total-width-travel" :style="{width: `${totalTavelWidth}%`, marginRight: `${marginOffsetTravel}%` }"></div>

      <span class="prev-add-days" :style="{ width: addPreDaysWidth }">{{ travelPeriodPreviousDays }}</span>

      <div
        class="range-travel"
        v-if="parseFloat(travelWidth) > 10"
        :style="{ width: travelWidth }"
      >
        <span>{{ formatDate(startTravel) }}</span> -
        <span>{{ formatDate(endTravel) }}</span>
      </div>

      <div
        class="range-travel legen-travel"
        v-else
        :style="{ width: travelWidth }"
      >
        <div class="content-icon"></div>
        <div class="label-legen-travel">
          <span
            >{{ formatDate(startTravel) }} - 
            {{ formatDate(endTravel) }}
          </span>
        </div>
      </div>
      <span
        class="post-add-days"
        :style="{
          width: addPostDaysWidth,
          marginRight: `${marginOffsetTravel}%`
        }"
      >
        {{ travelPeriodPostDays }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.app-container {
  position: relative;
  font-family: roboto, helvetica neue light, helvetica neue, helvetica, arial,
    lucida grande, sans-serif;
  font-size: 1vw;
  width: 80%;
  height: 150px;
  margin: 0 auto;
  margin-top: 50px;
}
.text-booking,
.text-travel {
  position: absolute;
  left: -150px;
}
.range-timeline {
  width: 100%;
}
.add-timeline {
  width: 110%;
  height: 10px;
  background-color: rgb(11, 11, 11);
  border-radius: 10px;
  margin-left: -5%;
}
.range-booking,
.range-travel {
  display: flex;
  min-width: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #1d99f1;
  font-size: 12px;
  height: 20px;
  color: rgb(250, 250, 250);
  border-radius: 10px;
  z-index: 2;
}
.add-days-range-travel {
  display: flex;
  justify-content: flex-end;
}
.post-add-days,
.prev-add-days {
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: white;
  height: 20px;
  z-index: 1;
  align-items: center;
}
.total-width-travel{
  background-color: #64baf7;
  border-radius: 10px;
  height: 20px;
  position: absolute;
}
.timeline-container {
  width: 100%;
  margin-top: 30px;
  margin-bottom: 20px;
}
.markers-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  width: 100%;
  position: relative;
}
.marker {
  display: flex;
  flex-direction: column;
  position: relative;
}
.marker-label {
  font-size: 0.6vw;
  white-space: nowrap;
  transform: translateX(-50%);
  position: absolute;
  top: -15px;
}
.marker-line {
  height: 10px;
  width: 2px;
  background-color: black;
}
.today-marker {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}
.today-marker::before {
  content: "";
  width: 8px;
  height: 8px;
  background-color: rgb(255, 238, 0);
  border-radius: 50%;
  top: -12px;
}
.today-label {
  font-size: 0.7vw;
  color: rgb(7, 7, 7);
  font-weight: bold;
  margin-top: 2px;
}
.label-legen-travel,
.label-legen-booking {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.8vw;
  padding: 5px;
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.legen-booking {
  display: flex;
  gap: 20px;
}
.label-legen-travel {
  top: 120px;
  right: 10px;
}
.legen-booking:hover .label-legen-booking,
.legen-travel:hover .label-legen-travel {
  visibility: visible;
  opacity: 1;
}
.content-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

</style>
