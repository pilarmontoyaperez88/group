<script setup lang="ts">

import { ref, computed } from 'vue';

const bookingWindowStart = ref('2025-02-10T14:30:00');
const bookingWindowEnd = ref('2025-02-10T14:30:00');
const travelPeriodStart = ref('2025-03-01T14:30:00');
const travelPeriodEnd = ref('2025-03-07T14:30:00');
const travelPeriodPostDays = ref(3);
const travelPeriodPreviousDays = ref(1);


const formatDateTimeline = (d: string | number | Date, withMonth: boolean = false): string => {

  const months = computed(() =>
    Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(2025, i, 1))
    )
  );
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAsString = months.value[date.getMonth()];
  const format = withMonth ? `${day} ${monthAsString}` : `${day}`;
  return format;
};


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
      date.getMonth() === value.getMonth()) === index);
  uniqueRange.sort((a, b) => a.getTime() - b.getTime());
  console.log("Rango de días:", uniqueRange);

  return uniqueRange;
})
// const rangeofdaysLabels = computed(() =>
//   rangeOfDays.value.map((date, index) => formatDateTimeline
//     (date, index === rangeOfDays.value.findIndex(d => d.getMonth() === date.getMonth())))
//     // .filter((label)=>label.startsWith('1'))

// )

const rangeofdaysLabels = computed(() => {
  const totalDays = rangeOfDays.value.length;
  const interval = calculateInterval(totalDays);

  return rangeOfDays.value.map((date, index) => {
    const isFirstOfMonth = index === rangeOfDays.value.findIndex(d => d.getMonth() === date.getMonth());
    if (index % interval === 0 || isFirstOfMonth) {
      return formatDateTimeline(date, isFirstOfMonth);
    }
    return '';
  });
});

const calculateInterval = (totalDays: number) => {
  if (totalDays > 60) return 10;
  if (totalDays > 30) return 5;
  if (totalDays > 15) return 2;
  return 1;
};

const getBooking = (day: Date) =>day >= new Date(bookingWindowStart.value) && day <= new Date(bookingWindowEnd.value);
const getTravel = (day: Date) => day >= new Date(travelPeriodStart.value) && day <= new Date(travelPeriodEnd.value);

// const patata= 3






</script>

<template>



  <div class="container-timeline">

    <div class="container">
      <div v-for="(day) in rangeOfDays" :key="day" :class="{ selected: getBooking(day) }">
        <span>&nbsp;</span>
      </div>
    
      <div v-for="(day) in rangeOfDays" :key="day" :class="{ selected: getTravel(day) }">
        <span>&nbsp;</span>
      </div>
    </div>

    
 <div class="timeline-line">
      <div v-for="(day, index) in rangeofdaysLabels" :key="index" 
      class="timeline-day" :data-label="day"  :class="{patata: index%2===0  }" 
      
       >
      </div>
    </div> 

  
  </div>





</template>






<style scoped>
.container-timeline {
  width: 100%;
  height: 150px;
  gap: 4px;
  background-color: white;
  display: flex;
  flex-direction: column;

}


.container {
  display: grid;
  grid-template-rows: 20px;
  grid-template-columns: repeat(v-bind('rangeOfDays.length'), 1fr);
}

.container .selected {
  background-color: gold;
}


.timeline-line {
  display: grid;
  grid-template-rows: 14px;
  grid-template-columns: repeat(v-bind('rangeOfDays.length'), 1fr);
  gap: 0px;
  width: 100%;
  padding: 0;
  border-radius: 5px;
  border: 1px solid red;

}
/* .patata.timeline-day{
display: none;
} */

/* rayas */
.timeline-day {
  position: relative;
  border: 0.1px solid black;
  /* grid-column: span v-bind(patata); */
}

.timeline-day::before {
  position: absolute;
  inset: 0;
  content: attr(data-label);
  font-size: 10px;
  white-space: wrap;
  text-align: center;
  line-height: 14px;
}





/* 
span.hide {
  opacity: 0;

} */

</style>