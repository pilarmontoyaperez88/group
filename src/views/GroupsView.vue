<script setup lang="ts">
import { computed, ref} from 'vue'
import { IberButton } from 'iberostar-component-library';
import TimeLine from '../components/TimeLine.vue';
import type { GroupDatesDTO } from '../types/groups';






   




</script>

<template>

<div class="container-group">
    
      
        <IberButton
          icon="arrow_back"
          outlined
          text="Volver al listado"
          
        />
        <IberButton
         
          icon="edit"
          outlined
          text="Editar grupo"
          
        />


        
        <IberButton
         
          icon="delete"
          outlined
          text="Dar de baja"
        />
        
        <IberButton
          
          icon="upload"
          text="Publicar grupo"
          
        />

    </div>



<TimeLine
      />



    
  </template>
  <style scoped>
    
  </style>
  