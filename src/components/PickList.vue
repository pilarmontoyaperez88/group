<script setup lang="ts">

import { IberButton, IberCard, IberInput } from 'iberostar-component-library';
import { ref, computed, defineProps, defineModel, onMounted, onUnmounted} from 'vue';
import List from './List.vue';

const props = withDefaults(
  defineProps<{
    items: Record<string, unknown>[];
    idField?: string;
    labelField?: string;
    titleItems?: { type: String, default: "Items disponibles" },
    titleSelected?: { type: String, default: "Items seleccionados" }
  }>(),
  {
    idField: 'id',
    labelField: 'name',
  }
);

const search = defineModel<string>('search', {
  required: false,
  default: '',
});



const filteredItems = computed(() => {
  return props.items.filter(item =>
    item[props.labelField].toLowerCase().includes(search.value.toLowerCase()) &&
    !selectedItems.value.some(selected => selected[props.idField] === item[props.idField])
  );
});

const selectedItems = defineModel<Record<string, unknown>[]>('selected', {
  required: false,
  default: () => [],
});


const selectedItem = ref<Record<string, unknown> | null>(null);
const selectItem = (item: Record<string, unknown>) => {
  selectedItem.value = { ...item };
};
const moveToSelected = () => {
  if (selectedItem.value) {
    selectedItems.value = [...selectedItems.value, selectedItem.value];
    selectedItem.value = null;
  }
};
const moveToAvailable = () => {
  if (selectedItem.value) {
    selectedItems.value = selectedItems.value.filter(
      (item) => item[props.idField] !== selectedItem.value![props.idField]
    );
    selectedItem.value = null;
  }
};

const isSmallScreen = ref(window.innerWidth < 650);
  const updateScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 650;
  };

  onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>

  <IberCard>

    <div class="header">
      <IberInput clearable icon="search" label="Búsqueda" 
      placeholder="Escriba para buscar un hotel"
      v-model="search"
       />

    </div>
    <div class="container-list">
      <div class="container">
        
        
        <div class="items">
          <h2>{{ titleItems }}</h2>
          
          

          <List :items="filteredItems" :idField="props.idField" :labelField="props.labelField"
            :selectedItem="selectedItem" :selectItem="selectItem" :moveItem="moveToSelected" listType="available" />

        </div>
        <div class="buttons">

          <IberButton class="icon-right"
          :icon="isSmallScreen ? 'keyboard_double_arrow_down' : 'keyboard_double_arrow_right'"
          @click="moveToSelected" />
          <IberButton class="icon-left" 
          :icon="isSmallScreen ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_left'" 
          @click="moveToAvailable" />
        </div>
        
        
        <div class="items">
          <h2>{{ titleSelected }}</h2>
          

          <List :items="selectedItems"  :idField="props.idField" :labelField="props.labelField"
            :selectedItem="selectedItem" :selectItem="selectItem" :moveItem="moveToAvailable" listType="selected" />

        </div>

      </div>
    </div>
  </IberCard>


</template>

<style scope>
.container {

  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  background-color: var(--background-color);
}



.container-list {
  container-type: inline-size;
}

.header {
  display: flex;
  flex-direction: row;
}

h2 {
  border: 1px, black;
}

/* .items h2 {
  position: sticky;
  top: 0;
  background-color: var(--background-color);
  padding: 10px 0;
  margin: 0;
  text-align: center;
  z-index: 10;
  border-bottom: 1px solid #ccc; 
} */


.items {
  width: 100%;
  max-height: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: var(--background-color);
  border-radius: 8px;
  overflow: auto;

}



.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 80px;
  flex: 1;

}
@container (width < 650px) {
  .container {
    flex-wrap: wrap;
  }
  .buttons{
   flex-direction: row;
   flex: 1;
   justify-content: center;
   width: 100%;
   gap: 10px;
  }
  .buttons button {
    flex-basis: 100%; 
  }
}



.post {
  container-type: inline-size;
}
</style>
