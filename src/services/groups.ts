import type { GroupListDTO, MeetingPlannerDTO } from '../types/groups';
import type { PaginationParams } from '../types/pagination';

import axios from 'axios';
const api = import.meta.env.VITE_API_PATH + '/group';
axios.defaults.headers.common['Access-Control-Expose-Headers'] = 'X-Pagination';
const idCompany = 1;

const getGroups = (pagination: PaginationParams<GroupListDTO>) =>
  useAPIPagination<GroupListDTO[], GroupListDTO>(
    (params) =>
      axios.get(api + '/', {
        params: { ...params, idCompany },
      }),
    pagination,
  );
const getGroup = () =>
  useAPI<GroupDTO>((...params) => {
    const [id] = params;
    return axios.get(`${api}/${id as string}`);
  });

const getMeetingPlanners = () =>
  useAPI<MeetingPlannerDTO[]>((...params) => {
    const [id] = params;
    return axios.get(`${api}/meetingPlanner/${id as string}`);
  });

const createGroup = () =>
  useAPI<GroupDTO>((...params) => axios.post(api, ...params));

export const groupsService = {
  getGroups,
  getGroup,
  getMeetingPlanners,
  createGroup,
};
