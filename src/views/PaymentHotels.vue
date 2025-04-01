<script setup lang="ts">
import { IberCard, IberButton } from 'iberostar-component-library';
import PickList from '../components/PickList.vue';
import { mockHotels } from '../assets/data/mockHotels';


</script>
<template>

<IberCard>

    <div class="header">
        <h2> Hoteles con envios a PIN</h2>

<div class="iberButtons">
      <IberButton icon="save" text="Guardar" />
      <IberButton icon="cancel" text="Cancelar" />
    </div>

    </div>

</IberCard>

<PickList :items="mockHotels" :id-field="id" :label-field="name" 
    titleItems="Hoteles disponibles" 
    titleSelected="Hoteles activos a PIN"
    />
</template>
<style scope>
.header{

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    
}

.iberButtons{
    display: flex;
    justify-content: space-between; 
    gap: 20px; 
    
}
</style>