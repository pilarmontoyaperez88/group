<script setup lang="ts">


const props = defineProps<{
  items: Record<string, unknown>[];
  idField: string;
  labelField: string;
  selectedItem: Record<string, unknown> | null;
  selectItem: (item: Record<string, unknown>) => void;
  moveItem: (item: Record<string, unknown>) => void;
  listType: 'available' | 'selected';
}>();

const handleClick = (item: Record<string, unknown>) => {
  props.selectItem(item);
};

const handleDblClick = (item: Record<string, unknown>) => {
  props.moveItem(item);
};
</script>

<template>
  <div class="list-container">
    <div class="list" v-for="item in items" :key="item[props.idField as string]" 
      :class="{ 'selected-item': props.selectedItem && props.selectedItem[props.idField] === item[props.idField] }" 
      @click="handleClick(item)" 
      @dblclick="handleDblClick(item)">
      {{ item[props.labelField] }}
    </div>
  </div>
</template>

<style scoped>


.list {
  padding: 5px;
  cursor: pointer;
}

.list:nth-child(even):hover,
.list:nth-child(odd):hover {
  background-color: var(--table-background-hover);
}

.list:nth-child(even) {
  background-color: var(--table-even-background);
}

.list:active {
  background-color: var(--table-background-selected);
}

.selected-item {
  background-color: var(--table-background-selected);
}
</style>
