<script setup lang="ts">
import {IberValueLabel} from 'iberostar-component-library';

const props = defineProps<{
  data?: {
    idThresholdType?: number;
    thresholdValue?: number;
    idRateType?: number;
    promotions?: { promoCode: string; count: number }[];
  };
  ThresholdTypes?: Record<number, string>;
  rateTypes?: Record<number, string>;
}>();
const getThresholdValue = () => {
  if (!props.data?.thresholdValue || !props.data?.idThresholdType) return "No disponible";

  const unit = props.data.idThresholdType === 1 ? "%" : "Moneda";
  return `${props.data.thresholdValue} ${unit}`;
};
</script>

<template>
  <div class= "container">
    
    <IberValueLabel label=" Valor del umbral" :value="getThresholdValue() "/>
    <IberValueLabel label="Tipo de tarifa" :value="props.rateTypes?.[props.data?.idRateType]" />

    <div v-for="promo in props.data?.promotions" :key="promo.promoCode">
      <IberValueLabel label="Código promocional" :value="promo.promoCode" />
      <!-- <IberValueLabel label="Cupo de códigos promocionales" :value="promo.count" /> -->
    </div>
  </div>
</template>

<style scoped>

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
  margin: 10px 10px;
 
}


</style>
