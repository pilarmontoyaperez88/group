<script setup lang="ts">

import { ref, computed } from 'vue';

const bookingWindowStart = ref('2025-02-10T14:30:00');
const bookingWindowEnd = ref('2025-02-20T14:30:00');
const travelPeriodStart = ref('2025-03-01T14:30:00');
const travelPeriodEnd = ref('2025-03-07T14:30:00');
const travelPeriodPostDays = ref(3);
const travelPeriodPreviousDays = ref(3);


const formatDateTimeline = (d: string | number | Date, withMonth: boolean = false): string => {

  const months = computed(() =>
    Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(2025, i, 1)).replace(/^(\w)/, (match) => match.toUpperCase())
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


const rangeofdaysLabels = computed(() => {
  const totalDays = rangeOfDays.value.length;
  const interval = calculateInterval(totalDays);

  return rangeOfDays.value.map((date, index) => {
    const isFirstOfMonth = index === rangeOfDays.value.findIndex(d => d.getMonth() === date.getMonth());
    if (index % interval === 0 || isFirstOfMonth) {
      return formatDateTimeline(date, isFirstOfMonth);
    }
    return '';;
  });
});

const calculateInterval = (totalDays: number) => {
  if (totalDays > 60) return 10;
  if (totalDays > 30) return 5;
  if (totalDays > 15) return 2;
  return 1;
};

const getBooking = (day: Date) => day >= new Date(bookingWindowStart.value) && day <= new Date(bookingWindowEnd.value);
const getTravel = (day: Date) => day >= new Date(travelPeriodStart.value) && day <= new Date(travelPeriodEnd.value);

const getTravelPostDays = (day: Date) => {
  const travelEndDate = new Date(travelPeriodEnd.value);
  const postDaysEnd = new Date(travelEndDate);
  postDaysEnd.setDate(postDaysEnd.getDate() + travelPeriodPostDays.value);
  return day > travelEndDate && day <= postDaysEnd;
};

const getTravelPreviousDays = (day: Date) => {
  const travelStartDate = new Date(travelPeriodStart.value);
  const previousDaysStart = new Date(travelStartDate);
  previousDaysStart.setDate(previousDaysStart.getDate() - travelPeriodPreviousDays.value);
  return day < travelStartDate && day >= previousDaysStart;
};


const formatDateFull = (d: string | number | Date): string => {

  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return ` ${day}/${month}/${year}`;
};


const isFirstSelected = (day: Date, index: number, isTravel: boolean = false): boolean => {
  const previousDay = rangeOfDays.value[index - 1];
  const isFirst = isTravel
    ? (getTravel(day) || getTravelPreviousDays(day)) &&
    !(previousDay && (getTravel(previousDay) || getTravelPreviousDays(previousDay)))
    : getBooking(day) && !(previousDay && getBooking(previousDay));

  console.log(`Día: ${day}, Índice: ${index}, isTravel: ${isTravel}, Es primero: ${isFirst}`);
  return isFirst;
};


const isLastSelected = (day: Date, index: number, isTravel: boolean = false): boolean => {
  const nextDay = rangeOfDays.value[index + 1];
  if (isTravel) {
    if (getTravelPreviousDays(day)) {
      return !getTravelPreviousDays(nextDay);
    }
    if (getTravelPostDays(day)) {
      return !getTravelPostDays(nextDay);
    }
  } else {
    if (getBooking(day)) {
      return !getBooking(nextDay);
    }
  }
  return false;
};

</script>



<template>


  <div class="container-timeline">
    <div class="resume">
      <div class="booking-resume">
        <span class="point booking-point"></span>
        Reserva {{ formatDateFull(bookingWindowStart) }} - {{ formatDateFull(bookingWindowEnd) }}
      </div>
      <div class="travel-resume">
        <span class="point travel-point"></span>
        Viaje {{ formatDateFull(travelPeriodStart) }} - {{ formatDateFull(travelPeriodEnd) }}
      </div>
    </div>
    <div class="lines">
      <div class="container">

        <div class="booking">
          <div v-for="(day, index) in rangeOfDays" :key="day.getTime()" class="booking" :class="{
            selected: getBooking(day),
            'first-selected': isFirstSelected(day, index),
            'last-selected': isLastSelected(day, index),
          }">
            <span>&nbsp;</span>
          </div>
        </div>

        <div class="travel" v-for="(day, index) in rangeOfDays" :key="day" :class="{
          selected: getTravel(day),
          'post-days': getTravelPostDays(day), 'previous-days': getTravelPreviousDays(day),
          'first-selected': (getTravelPreviousDays(day) && isFirstSelected(day, index, true)),
          'last-selected': (getTravelPostDays(day) && isLastSelected(day, index, true)),

        }">


          <div v-if="getTravelPostDays(day)">1</div>
          <span v-if="getTravelPreviousDays(day)">1</span>


        </div>

      </div>
      <div class="timeline-line">
        <div v-for="(day, index) in rangeofdaysLabels" :key="index" class="timeline-day" :data-label="day">
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>
.container-timeline {
  width: 100%;
  height: 250px;
  overflow: auto;
  gap: 4px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
}

.container {
  display: grid;
  grid-template-rows: repeat(3, 20px);
  grid-template-columns: repeat(v-bind('rangeOfDays.length'), 1fr);
  border-radius: 8px;
}

.travel {
  position: relative;
}

.date-info {
  position: absolute;
  left: 50px;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 40, 85, 0.253);
  padding: 5px;
  border-radius: 5px;
  z-index: 1;
  white-space: nowrap;
  font-weight: bold;


}


.container .booking.selected {
  background-color: green;
  height: 30px; /* Igual que travel */
  position: relative;
  
  
}


.container .travel.selected {
  background-color: rgb(0 40 85/ 100%);
  margin-top: 1px;
  position: relative;
  height: 30px;
}

.container .travel.previous-days,
.travel.post-days {
  background-color: #6c849e;
  border: 0.5px solid white;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;

}

.container .booking.first-selected {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.container .booking.last-selected {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.container .travel.previous-days.first-selected {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.container .travel.post-days.last-selected {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.timeline-line {
  display: grid;
  grid-template-rows: 24px;
  grid-template-columns: repeat(v-bind('rangeOfDays.length'), 1fr);
  gap: 0px;
  width: 100%;
  padding: 0;
  border-radius: 8px;
  background-color: rgba(222, 222, 222, 0.815);
  margin-bottom: 30px;
  margin-top: 30px;

}

/* rayas */
.timeline-day {
  position: relative;
  border: 0.1px solid white;

}

.timeline-day::before {
  position: absolute;
  inset: 0;
  content: attr(data-label);
  font-size: 12px;
  white-space: wrap;
  text-align: center;
  line-height: 20px;
}


.resume {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 20px;

}

.resume-booking {
  border: 0.5px solid black;
}


.lines {
  margin: 30px;
  height: 150px;
}

.point {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.booking-point {
  background-color: green;
}

.travel-point {
  background-color: rgb(0, 40, 85);
}
</style>