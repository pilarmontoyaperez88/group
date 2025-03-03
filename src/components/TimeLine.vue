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
 
const formatDateTimeline = (d: string | number | Date, withMonth: boolean= false): string => {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAsString= months[date.getMonth()];
  const format = withMonth ? `${day} ${monthAsString}` : `${day}`
  return format;
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

const rangeOfDays = computed(() => {
  console.log(rangeOfDays);
  
  const travelEndDate = new Date(travelPeriodEnd.value);
  const bookingStartDate = new Date(bookingWindowStart.value);

  const startDate = new Date(bookingStartDate);
  startDate.setDate(startDate.getDate() - travelPeriodPreviousDays.value);

  const endDate = new Date(travelEndDate);
  endDate.setDate(endDate.getDate() + travelPeriodPostDays.value);
  
  const fullRange = getRangeOfDays(startDate, endDate); 

  const uniqueRange = fullRange.filter((value, index, self) => 
    self.findIndex(date => 
      date.getDate() === value.getDate() && 
      date.getMonth() === value.getMonth() && 
      date.getFullYear() === value.getFullYear()) === index
  );

  uniqueRange.sort((a, b) => a.getTime() - b.getTime());
  return uniqueRange.map( (date , index) => formatDateTimeline(date, index === uniqueRange.findIndex(d=> d.getMonth() === date.getMonth())));
 
});




const bookingStartPosition = computed(() => {
  const firstDay = new Date(rangeOfDays.value[0]);  
  const bookingStartDate = new Date(bookingWindowStart.value);

  // Encuentra la posición de bookingWindowStart en rangeOfDays
  const indexOfBookingStart = rangeOfDays.value.findIndex((date) => {
    return date === formatDateTimeline(bookingStartDate); 
  });

  if (indexOfBookingStart === -1) return 0;
  const position = (indexOfBookingStart / (rangeOfDays.value.length - 1)) * 100;
  console.log(`Booking start position: ${position}%`);
  return position;
});



const travelStartPosition = computed(() => {
  const firstDay = new Date(rangeOfDays.value[0]);  
  const travelStartDate = new Date(travelPeriodStart.value);  

  const indexOfTravelStart = rangeOfDays.value.findIndex((date) => {
    return date === formatDateTimeline(travelStartDate); 
  });
  console.log(indexOfTravelStart)

  if (indexOfTravelStart === -1) return 0;  
  const position = (indexOfTravelStart / (rangeOfDays.value.length - 1)) * 100;  
  console.log(`Travel start position: ${position}%`);
  return position;
});


  const travelWidth = computed(() => {
  const totalDays = (new Date(travelPeriodEnd.value).getTime() - new Date(travelPeriodStart.value).getTime()) / (1000 * 3600 * 24);
  const totalRange = rangeOfDays.value.length - 1;  
  return (totalDays / totalRange) * 100;  
  
});


console.log('Booking start position:', bookingStartPosition.value);
console.log('Travel start position:', travelStartPosition.value);






  
</script>

<template>

<div class="timeline-container">
  <div class="timeline-line">
    <div 
      v-for="(day, index) in rangeOfDays" 
      :key="index" 
      class="timeline-day"
    >
    <span 
  class="day-label" 
  :class="{ hide: index % 2 !== 0 }"
>
  {{ day }}
</span>
    </div>
  </div> 

  <div 
    v-if="bookingWindowStart" 
    class="timeline-bar timeline-bar-booking" 
    :style="{ left: bookingStartPosition + '%', width:'2%' }"
  >
Reserva</div>

  <div 
    v-if="travelPeriodStart" 
    class="timeline-bar timeline-bar-travel" 
    :style="{ left: travelStartPosition + '%', width: travelWidth + '%'  }"
  > Viaje</div>
</div> 







  <div class="timeline">
  <div v-for="dates in sortedDates" :key="dates.label">
    <strong>{{ dates.label }}</strong> {{ formatDate(dates.date) }}
  </div>
  </div>

</template>






<style scoped>

.timeline-container {
  position: relative;
  width: 100%;
  height: 150px;
  padding: 20px;
  background-color: #f0f0f0;
}


.timeline-line {
  position: relative;
  top: 50%;
  width: 70%;
  height: 6px;
  background-color: black;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 5px;
}

/* rayas */
.timeline-day {
  position: relative;
  width: 2px; 
  height: 10px; 
  background-color: black; 
  transform: translateX(-50%); 
}



/* days label */
.day-label {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  font-size: 12px;
  color: #333;
  white-space: wrap;
  text-align: center;
  margin-top: 4px;
}


span.hide {
  opacity: 0;
}



.month-label {
  position: absolute;
  bottom: -60px; 
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: black;
 
}

.timeline-bar {
  position: absolute;
  top: 60px;
  height: 10px;
  background-color: black;
  width: 10px; 
  z-index: 1;
  border-radius: 4px;

}




.timeline-bar-booking {
  background-color: #28a745;
}


.timeline-bar-travel {
  
  background-color: #17a2b8;
  top: 60px; 
  left: 76%;
  
 
}



</style>

