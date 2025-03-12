<script setup lang="ts">
import { ref, markRaw} from 'vue'
import { IberButton, IberCard, IberTabs, IberValueLabel } from 'iberostar-component-library';
import TimeLine from '../components/TimeLine.vue';
import type { Tab } from 'iberostar-component-library';
import mockData from '../assets/data/mockData.json';


// import { GroupStatusType } from '../types/groups';
// import type { RateDTO, QuotaDTO } from '../types/groups';

import FacturacionDetails from '../components/details/FacturacionDetails.vue';
import TarifasDetails from '../components/details/TarifasDetails.vue';
import HotelesDetails from '../components/details/HotelesDetails.vue';



const data = ref(mockData);
const dataHotel = ref(mockData.hotels);
// const rates = ref();
// const rooms = ref();

// const props = defineProps<{
//   id: string;
// }>()


const formatDate = (d: string | number | Date): string => {

  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
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


const tabs = ref<Tab[]>([
    {
      id: 'billing',
      title: 'FACTURACIÓN',
      component: markRaw(FacturacionDetails) ,
      props: {
      data: data.value, 
      paymentFeeTypes: paymentFeeTypes, 
      },
      
    },
    {
      id: 'rate',
      title: 'TARIFAS',
      component: markRaw(TarifasDetails),
      props: {
      data: data.value,
      ThresholdTypes: ThresholdTypes,
      rateTypes: rateTypes,
      },
      
    },
    {
      id: 'promos',
      title: 'HOTELES', 
      component: markRaw(HotelesDetails),
      props: {
      data: data.value, 
      dataHotel: dataHotel.value, 
      },          
    },

  
    
  ]);

  const getIsMyRoomText = (isMyRoom: boolean) => (isMyRoom ? 'Sí' : 'No');
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

    <hr/>


    <IberCard>

      <div class="data-container">
        <IberValueLabel label="Pais" :value="getCountryName(data?.idCountry)" />
        <IberValueLabel label="Tipo de grupo" :value="groupTypeNames[data?.idType] || 'Desconocido'" />
        <IberValueLabel label="Nombre del comercial" :value="data?.adminNameIBH" />
        <IberValueLabel label="Email del comercial" :value="data?.adminEmailIBH" />
        <IberValueLabel label="Meeting planner" :value="data?.meetingPlanner?.name" />
        
        <IberValueLabel label="My room" :value="getIsMyRoomText(data?.isMyRoom)">
          
        </IberValueLabel>

        <IberValueLabel label="Web de landing" :value="data?.landingPage" />
      </div>
      
    </IberCard>
<hr/>
    <TimeLine />
<hr/>

    <IberTabs join :tabs="tabs" />

    

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
  margin: 2px

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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px;
}

.data-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-left: 35px;

}


</style>