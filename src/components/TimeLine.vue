<script setup lang="ts">

import { ref, computed } from 'vue';
 

const groupId = '01944aba-c972-71cf-8ece-d2b9bf2de93d';


    const bookingWindowStart = ref('2025-02-10T14:30:00');
    const bookingWindowEnd = ref('2025-02-28T14:30:00');
    const travelPeriodStart = ref('2025-03-01T14:30:00');
    const travelPeriodEnd = ref('2025-03-07T14:30:00');
    const travelPeriodPostDays = ref(3);
    const travelPeriodPreviousDays= ref(1);


     //TODO: Pasar a composable
 const formatDate = (d: string | number | Date): string => {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const sortedDates = computed(() => {
    const dates = [
      {
        label: 'Inicio de ventana de reserva',
        date: bookingWindowStart.value,
      },
      {
        label: 'Fin de ventana de reserva',
        date: bookingWindowEnd.value ,
      },
      {
        label: 'Inicio del viaje',
        date: travelPeriodStart.value ,
      },
      {
        label: 'Fin del viaje',
        date: travelPeriodEnd.value ,
      },
      {
        label:
          'Días previos (' + travelPeriodPreviousDays + ')',
         date: new Date(new Date(travelPeriodStart.value).getTime() - travelPeriodPreviousDays.value * 24 * 60 * 60 * 1000),
      },
      {
      label: 'Días posteriores (' + travelPeriodPostDays + ')',
      date: new Date(new Date(travelPeriodEnd.value).getTime() + travelPeriodPostDays.value * 24 * 60 * 60 * 1000),
    },
    ];

    return dates.sort((a, b) => +a.date - +b.date);
  });


const daysBetween = (startDate: string | Date, endDate: string | Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};


const getLineStyle = (item) => {
  const totalDuration = daysBetween(bookingWindowStart.value, travelPeriodEnd.value) + travelPeriodPostDays.value;
  const position = (daysBetween(bookingWindowStart.value, item.date) / totalDuration) * 100;
  return { left: `${position}%` };
};
const reservationBarStyle = computed(() => {
  const totalDuration = daysBetween(bookingWindowStart.value, travelPeriodEnd.value) + travelPeriodPostDays.value;
  const position = (daysBetween(bookingWindowStart.value, bookingWindowStart.value) / totalDuration) * 100;
  const width = (daysBetween(bookingWindowStart.value, bookingWindowEnd.value) / totalDuration) * 100;
  return { left: `${position}%`, width: `${width}%` };
});

const travelPeriodBarStyle = computed(() => {
  const totalDuration = daysBetween(bookingWindowStart.value, travelPeriodEnd.value) + travelPeriodPostDays.value;
  const position = (daysBetween(bookingWindowStart.value, travelPeriodStart.value) / totalDuration) * 100;
  const width = (daysBetween(travelPeriodStart.value, travelPeriodEnd.value) / totalDuration) * 100;
  return { left: `${position}%`, width: `${width}%` };
});




 



  
</script>

<template>

<div class="timeline-container">
    <!-- Barra negra para el rango de fechas -->
    <div class="timeline-bar">
      <!-- Iterar sobre sortedDates para crear líneas y etiquetas -->
      <div v-for="(item, index) in sortedDates" :key="index" class="timeline-line" :style="getLineStyle(item)">
        <span>{{ formatDate(item.date) }}</span>
      </div>
    </div>

    <!-- Barra de la reserva -->
    <div class="reservation-bar" :style="reservationBarStyle"></div>

    <!-- Barra del viaje -->
    <div class="travel-period-bar" :style="travelPeriodBarStyle"></div>
  </div>

  <div class="timeline">
  <div v-for="dates in sortedDates" :key="dates.label">
    <strong>{{ dates.label }}</strong> {{ formatDate(dates.date) }}
  </div>
</div>

</template>





<style  scoped>

.timeline-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.timeline-bar {
  position: absolute;
  width: 100%;
  height: 10px;
  background-color: #333;
}

.timeline-line {
  position: absolute;
  width: 2px;
  height: 16px;
  background-color: #fff;
  text-align: center;
  font-size: 10px;
  color: rgb(101, 180, 37);
}

.reservation-bar {
  position: absolute;
  height: 10px;
  background-color: #00aaff;
}

.travel-period-bar {
  position: absolute;
  height: 10px;
  background-color: #ff5733;
}



</style>