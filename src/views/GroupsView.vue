<script setup lang="ts">
import { computed, ref } from 'vue'
import { IberButton, IberAccordeon, IberCard } from 'iberostar-component-library';
import TimeLine from '../components/TimeLine.vue';

import mockData from '../assets/data/mockData.json';
import { GroupStatusType } from '../types/groups';
import type { RateDTO, QuotaDTO } from '../types/groups';
import TimeLine2 from '../components/TimeLine2.vue';


const data = ref(mockData);
const dataHotel = ref(mockData.hotels);
const rates = ref();
const rooms = ref();

const props = defineProps<{
  id: string;
}>()

const formatDate = (d: string | number | Date): string => {

  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} `;
};

const countryNames = { // hay que añadir más paises, pero creo que en groups ya hay una funcion para esto.
  "ES": "España",
  "DE": "Alemania",
  "FR": "Francia",
  "US": "Estados Unidos",
  "GE": "Georgia",
};

const getCountryName = (countryCode: string) => {
  return countryNames[countryCode] || countryCode;
};

const groupTypeNames = {
  1: "Leisure",
  2: "Mice",
  3: "Deportes",
  4: "Bodas"
};

const paymentFeeTypes = {
  1: 'Porcentaje',
  2: 'Valor',
  3: 'Noche'
};

const rateTypes = {
  1: 'Web',
  2: 'IRate'
};

const ThresholdTypes =
{
  1: 'Porcentaje',
  2: 'Valor'
}
</script>

<template>
  <div class="background-container">




    <IberCard>
      <div class="container-group">

        <div class="group-name">{{ data.name }}</div>
        <div class="boton-container">
          <IberButton icon="arrow_back" outlined text="Volver al listado" />
          <IberButton icon="edit" outlined text="Editar grupo" />
          <IberButton icon="delete" outlined text="Dar de baja" />
          <IberButton icon="upload" text="Publicar grupo" />
        </div>




      </div>
    </IberCard>

    <hr />


    <IberCard>
      <div class="data-container">
        <div>
          <strong>Pais </strong>
          <span>{{ getCountryName(data?.idCountry) }}</span>
        </div>
        <div>
          <strong>Tipo de grupo: </strong>
          <span>{{ groupTypeNames[data?.idType] || "Desconocido" }}</span>
        </div>
        <div>
          <strong>Nombre del comercial: </strong>
          <span>{{ data?.adminNameIBH }}</span>
        </div>
        <div>
          <strong>Email del comercial: </strong>
          <span>{{ data?.adminEmailIBH }}</span>
        </div>
        <div>
          <strong>Meeting planner: </strong>
          <span>{{ data?.meetingPlanner?.name }}</span>
        </div>
        <div>
          <strong>My room: </strong>
          <input type="checkbox" :checked="data?.isMyRoom" disabled class="custom-checkbox">
          <span class="checkbox-label">{{ data?.isMyRoom ? '' : '✗' }}</span>
        </div>
        <div>
          <strong>Web de landing: </strong>
          <span>{{ data?.landingPage }}</span>
        </div>

      </div>
    </IberCard>

    <TimeLine />
    <!-- <TimeLine2/> -->

    <div class="data-container">

      <IberCard>
        FACTURACIÓN
        <div>
          <strong>Correos de facturación: </strong>
          <span>{{ data?.receiverInvoiceMails }}</span>
        </div>
        <div>
          <strong>Pago fraccionado: </strong>
          <input type="checkbox" :checked="data?.isPartialPayment" disabled class="custom-checkbox">
        </div>
        <div>
          <strong>Primer pago: </strong>
          <span>{{ data?.splitPayment.firstPaymentFee }}</span>
        </div>
        <div>
          <strong>Fecha máxima de pago: </strong>
          <span>{{ formatDate(data?.splitPayment.lastPaymentFeeDate) }}</span>
        </div>
        <div>
          <strong>Tipo de cuota: </strong>
          <span>{{ paymentFeeTypes[data?.splitPayment.idPaymentFeeType] }}</span>
          <!--tipo de cuota es porcentaje/ Valor=2, noche=3-->
        </div>
      </IberCard>

      




      <IberCard>
        TARIFAS
        <div>
          <strong>Tipo de umbral: </strong>
          <span>{{ ThresholdTypes[data?.idThresholdType] }}</span> <!-- porcentaje o value -->
        </div>
        <div>
          <strong>Valor del umbral: </strong>
          <span>{{ data?.thresholdValue }}</span> <!-- Se refiere al porcentaje de la ocupacion?  -->
        </div>
        <div>
          <strong>Tipo de tarifa: </strong>
          <span>{{ rateTypes[data?.idRateType] }}</span> <!-- aqui habrá dos opciones: 1=Web o 2= IRate -->
        </div>

        <div v-for="promo in data?.promotions">
          <div>
            <strong>Codigo promocional: </strong>
            <span>{{ promo.promoCode }}</span>
          </div>
          <div>
            <strong>Cupo de códigos promocionales: </strong>
            <span>{{ promo.count }}</span>
          </div>
        </div>
      </IberCard>

      <IberCard v-for="(hotel, index) in data?.hotels" :key="index" class="hotel-card">

        <div>
          <strong>Hotel: </strong>
          <span>{{dataHotel?.find((h) => h?.id === hotel?.id)?.name || hotel.name}}</span>
        </div>


        <div class="rooms">
          <div>
            <strong>Tipo de habitación: </strong>
            <span>{{hotel.rate.rooms.map(room => room.name).join(' | ')}}</span>
          </div>
          <div>
            <strong>Cantidad de habitaciones: </strong>
            <span>{{hotel.rate.rooms.reduce((total, room) => total + room.quotas[0].quantity, 0)}}</span>
          </div>
          <br />
        </div>


        <div>
          <strong>Tipo de tarifa: </strong>
          <span>{{ hotel.rate.name }}</span>
        </div>


        <div>
          <strong>Tipo de impuesto sobre la tarifa: </strong>
          <input type="checkbox" :checked="hotel.isRateVAT" disabled class="custom-checkbox">
        </div>
      </IberCard>






    </div>
  </div>

</template>











<style scoped>
.background-container {
  background-color: #BFE2FB;
  min-height: 100vh;
  padding: 20px;

}

.container-group {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  max-width: 1200px;

}

.boton-container {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  flex-wrap: nowrap;
}

.group-name {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: 1.5rem;
  font-weight: bold;
}

.data-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  /* Separación entre filas */
  padding: 10px;
}

.data-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-left: 35px;

}

strong {
  color: #808080;
  /* Color gris para el texto dentro de <strong> */
}

span {
  margin-left: 15px;
  /* Añade separación entre <strong> y <span> */
}
</style>