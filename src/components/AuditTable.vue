<script setup lang="ts">
import {ref, computed} from 'vue'
//   import { auditsService } from '@/services/audits';
  GroupActionType
  import type {
    TableHeader,
    TableMetaOptions,
  } from 'iberostar-component-library';
import { GroupActionType } from '../types/groups';
  defineProps<{ id: string }>();
  //   const initialPagination = {
  //     pageSize: 5,
  //     page: 1,
  //     orderBy: 'name',
  //     orderDirection: 1,
  //   };
  const { isLoading, data, execute } =
    auditsService.getGroupAudits(/*props.id, initialPagination*/);

  const formatDate = (d: unknown): unknown => {
    const date = new Date(d as string | number | Date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatEnum = (enu: GroupActionType): string => {
    const label = ref('SIN ESPECIFICAR');
    switch (enu) {
      case GroupActionType.Creacion:
        label.value = 'CREACIÓN';
        break;
      case GroupActionType.Modificacion:
        label.value = 'MODIFICACION';
        break;
      case GroupActionType.Baja:
        label.value = 'BAJA';
        break;
      case GroupActionType.CreacionCodigoPromocional:
        label.value = 'CREACIÓN CÓDIGO PROMOCIONAL';
        break;
      case GroupActionType.ModificacionCodigoPromocional:
        label.value = 'MODIFICACIÓN CÓDIGO PROMOCIONAL';
        break;
      case GroupActionType.MeetingPlannerAsociado:
        label.value = 'ASOCIADO MEETING PLANNER';
        break;
      case GroupActionType.ModificacionMeetingPlannerAsociado:
        label.value = 'CAMBIO DE MEETING PLANNER';
        break;
      case GroupActionType.RegistroFactura:
        label.value = 'REGISTRO FACTURA';
        break;
      case GroupActionType.DescargaFactura:
        label.value = 'DESCARGA FACTURA';
        break;
      case GroupActionType.PublicacionAPIN:
        label.value = 'PUBLICACIÓN PIN';
        break;
      case GroupActionType.PublicacionCRM:
        label.value = 'PUBLICACIÓN CRM';
        break;
      case GroupActionType.PublicacionCMS:
        label.value = 'PUBLICACIÓN CMS';
        break;
      default:
        break;
    }
    return label.value;
  };

  const headers = ref<TableHeader[]>([
    {
      id: 1,
      displayName: 'Fecha y hora',
      field: 'dateTime',
      fixed: true,
      format: formatDate,
    },
    {
      id: 2,
      displayName: 'Tipo de accion',
      field: 'actionType',
      format: formatEnum,
    },
    {
      id: 3,
      displayName: 'Acción',
      field: 'action',
    },
    {
      id: 4,
      displayName: 'Usuario',
      field: 'userName',
    },
  ]);

  const meta = computed<TableMetaOptions>(() => ({
    serverSide: true,
  }));
</script>
<template>
  <IberPanel
    hide-switch
    :loading="isLoading"
    title="Auditorias"
    @update:expand.once="execute(id)"
  >
    <div class="audit-container">
      <IberTable :data :headers :loading="isLoading" :meta />
    </div>
  </IberPanel>
</template>
<style scoped>
  div.audit-container {
    width: 100%;
  }
</style>
