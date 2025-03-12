<script setup lang="ts">

import {IberValueLabel} from 'iberostar-component-library';

const props = defineProps<{
  data?: {
    receiverInvoiceMails?: string;
    isPartialPayment?: boolean;
    splitPayment?: {
      firstPaymentFee: number;
      lastPaymentFeeDate: string;
      idPaymentFeeType: number;
    };
  };
  paymentFeeTypes?: Record<number, string>;
}>();


const formatDate = (date?: string) => {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
};

const getFirstPaymentValue = () => {
  const { splitPayment } = props.data || {};

  if (!splitPayment) return 'N/A';
  const firstPaymentFee = Number(splitPayment.firstPaymentFee);

  const { idPaymentFeeType } = splitPayment;

  switch (idPaymentFeeType) {
    case 1:
      return `${firstPaymentFee}%`;
    case 2:
      return `${firstPaymentFee}Moneda`;
    case 3:
      return `${firstPaymentFee} ${firstPaymentFee === 1 ? 'noche' : 'noches'}`;
    default:
      return 'N/A';
  }
};
</script>

<template>
  <div class="container">
    <IberValueLabel class="item1" label="Pago fraccionado" :value="props.data?.isPartialPayment ? 'Sí' : 'No'" />
    <IberValueLabel class="item2" label="Fecha máxima de pago"
      :value="formatDate(props.data?.splitPayment?.lastPaymentFeeDate)" />
    <IberValueLabel class="item3" label="Primer pago" :value="getFirstPaymentValue()" />
    <IberValueLabel class="item4" label="Correos de facturación" :value="props.data?.receiverInvoiceMails" />

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

.item4{
  grid-column: span 3;
  justify-content: start;
}
</style>
