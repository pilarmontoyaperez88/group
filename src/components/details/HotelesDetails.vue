<script setup lang="ts">
import {IberValueLabel, IberCard } from 'iberostar-component-library';

const props = defineProps<{
  data?: {
    hotels?: {
      id: number;
      name?: string;
      rate: {
        name: string;
        rooms: { name: string; quotas: { quantity: number }[] }[];
      };
      isRateVAT: boolean;
    }[];
  };
  dataHotel?: { id: number; name: string }[];
}>();

const getHotelName = (hotelId: number) => {
  return props.dataHotel?.find((h) => h?.id === hotelId)?.name || 'Desconocido';
};

const getRoomNames = (rooms: { name: string }[]) => {
  return rooms.map((room) => room.name).join(' | ') || 'No disponible';
};

const getTotalRooms = (rooms: { quotas: { quantity: number }[] }[]) => {
  return rooms.reduce((total, room) => total + (room.quotas[0]?.quantity || 0), 0);
};
const getRateVATText = (isRateVAT: boolean) => (isRateVAT ? 'Sí' : 'No');
</script>

<template>
    <div class="container">
      <div v-for="(hotel, index) in data?.hotels" :key="index">
        <IberCard class="hotel-card">
            <div class="hotel-info-grid">
                <IberValueLabel label="Hotel" :value="getHotelName(hotel.id)" />
                <IberValueLabel label="Tipo de habitación" :value="getRoomNames(hotel.rate.rooms)" />
                <IberValueLabel label="Cantidad de habitaciones" :value="getTotalRooms(hotel.rate.rooms)" />
                <IberValueLabel label="Tipo de tarifa" :value="hotel.rate.name" />
                <IberValueLabel label="Tipo de impuesto sobre la tarifa" :value="getRateVATText(hotel.isRateVAT)" />
            </div>
        </IberCard>
      </div>
    </div>
  </template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(1fr, 1fr);
  gap: 16px;
  align-items: start;
  margin: 10px 10px;
  grid-template-rows: auto;
}

.hotel-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 12px;
  align-items: start ;
  grid-auto-rows: minmax(70px, auto);
}





</style>
