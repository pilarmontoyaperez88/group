<script setup lang="ts">

import { ref, computed } from 'vue';
 

const groupId = '01944aba-c972-71cf-8ece-d2b9bf2de93d';


    const bookingWindowStart = ref('2025-02-10T14:30:00');
    const bookingWindowEnd = ref('2025-02-10T14:30:00');
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

const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"];

const formatDateTimeline = (d: string | number | Date): string => {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAsString= months[date.getMonth()];
  return `${day} ${monthAsString}`;
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
         date: new Date(new Date(bookingWindowStart.value).getTime() - travelPeriodPreviousDays.value * 24 * 60 * 60 * 1000),
      },
      
      {
      label: 'Días posteriores (' + travelPeriodPostDays + ')',
      date: new Date(new Date(travelPeriodEnd.value).getTime() + travelPeriodPostDays.value * 24 * 60 * 60 * 1000),
    },
    ];

    return dates.sort((a, b) => +a.date - +b.date);
  });

  

  const getRangeOfDays = (startDate: Date, endDate: Date) => {
  const range = [];
  let currentDate = new Date(startDate);
  console.log("Generando rango de días desde:", startDate, "hasta:", endDate);

  while (currentDate <= endDate) {
    if (!isNaN(currentDate.getTime())) {
      range.push(new Date(currentDate)); 
    } else {
      console.warn("Fecha inválida detectada:", currentDate);
    }
    currentDate.setDate(currentDate.getDate() + 1); 
  }

  return range;
};

// esta computada nos da el rango de días a mostrar en la línea de tiempo
const rangeOfDays = computed(() => {
  console.log(rangeOfDays);
  
  const travelStartDate = new Date(travelPeriodStart.value); 
  const travelEndDate = new Date(travelPeriodEnd.value);
  const bookingStartDate = new Date(bookingWindowStart.value);

  
  const startDate = new Date(bookingStartDate);
  startDate.setDate(startDate.getDate() - travelPeriodPreviousDays.value);

  const endDate = new Date(travelEndDate);
  endDate.setDate(endDate.getDate() + travelPeriodPostDays.value);
   
  
  
  // const bookingRange = getRangeOfDays(bookingStartDate, bookingEndDate);
  // const travelRange = getRangeOfDays(startDate, endDate);

  const fullRange = getRangeOfDays(startDate, endDate); // Aquí usas la función getRangeOfDays

  // let fullRange = [...travelRange, ...bookingRange];
  // fullRange = fullRange.map(date => new Date(date));

  // fullRange = fullRange.filter((value, index, self) => 
  //   self.findIndex(date => 
  //     date.getDate() === value.getDate() && 
  //     date.getMonth() === value.getMonth() && 
  //     date.getFullYear() === value.getFullYear()) === index
  // );
  // fullRange = fullRange.filter(date => {
  //   return !(
  //     date >= bookingStartDate && date <= bookingEndDate && 
  //     (date >= startDate && date <= endDate) 
  //   );
  // });

  const uniqueRange = fullRange.filter((value, index, self) => 
    self.findIndex(date => 
      date.getDate() === value.getDate() && 
      date.getMonth() === value.getMonth() && 
      date.getFullYear() === value.getFullYear()) === index
  );

  uniqueRange.sort((a, b) => a.getTime() - b.getTime());
  return uniqueRange.map(date => formatDateTimeline(date));
 
  // fullRange.sort((a, b) => a.getTime() - b.getTime());
  // console.log("Rango ordenado:", fullRange);
  // return fullRange.map((date) =>formatDateTimeline(date) );
 
});

// Calcular la posición de la barra de la reserva (día de la reserva)
const bookingStartPosition = computed(() => {
  const totalDays = (new Date(travelPeriodEnd.value).getTime() - new Date(bookingWindowStart.value).getTime()) / (1000 * 3600 * 24);
  const offsetDays = (new Date(bookingWindowStart.value).getTime() - new Date(bookingWindowStart.value).getTime()) / (1000 * 3600 * 24);
  return (offsetDays / totalDays) * 100;
});

// Calcular la posición de la barra del viaje (días de viaje)
const travelStartPosition = computed(() => {
  const totalDays = (new Date(travelPeriodEnd.value).getTime() - new Date(bookingWindowStart.value).getTime()) / (1000 * 3600 * 24);
  const offsetDays = (new Date(travelPeriodStart.value).getTime() - new Date(bookingWindowStart.value).getTime()) / (1000 * 3600 * 24);
  return (offsetDays / totalDays) * 100;
});






  
</script>

<template>

<div class="timeline-container">
    <!-- Timeline Line -->
    <div class="timeline-line">
      <!-- Dinámicamente se agregarán los días numerados -->
      <div v-for="day in rangeOfDays" :key="day" class="timeline-day">
        <span class="day-label">{{ day }}</span>  
      </div>
    </div>
    
    <!-- Barra azul para la fecha de la reserva -->
    <div 
      v-if="bookingWindowStart" 
      class="timeline-bar timeline-bar-booking" 
      :style="{ left: bookingStartPosition + '%' }"
    ></div>
    
    <!-- Barra azul para el período del viaje -->
    <div 
      v-if="travelPeriodStart" 
      class="timeline-bar timeline-bar-travel" 
      :style="{ left: travelStartPosition + '%', width:  + '%' }"
    ></div>

      <!-- Mostrar las fechas formateadas debajo de la línea
      <div v-for="(event, index) in sortedDates" :key="index" class="event-label">
      <span>{{ formatDate(event.date) }}</span>
    </div> -->

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
  height: 100px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  width: 70%;
  height: 5px;
  background-color: black;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.timeline-day {
  position: relative;
  height: 10px;
}

.day-label {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
}

.timeline-bar {
  position: absolute;
  top: 20px;
  height: 10px;
}

.timeline-bar-booking {
  background-color: blue;
}

.timeline-bar-travel {
  background-color: lightblue;
}



</style>