import type { HotelDTO, RateDTO, RoomDTO } from '../types/groups';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_PATH;
const idCompany = 1;

const getHotels = () =>
  useAPI<HotelDTO[]>((...params) =>
    axios.get(`/hotel/${idCompany}/active`, {
      params,
    }),
  );

const getRate = () =>
  useAPI<RateDTO[]>((...params) => {
    const [hotelId] = params;
    return axios.get(`/rate/${hotelId as string}`);
  });

const getRooms = () =>
  useAPI<RoomDTO[]>((...params) =>
    axios.get('/room/getByHotelAndRates', {
      params: params[0],
    }),
  );

export const hotelService = {
  getHotels,
  getRooms,
  getRate,
};