

export interface GroupListDTO {
  // id: UUID;
  name: string;
  status: GroupStatusType;
  travelPeriodStart: Date;
  travelPeriodEnd: Date;
  meetingPlannerName?: string;
  hotel: string;
  promotionalCode?: string;
  [key: string]: unknown;
}

export enum GroupStatusType {
  'EDITION' = 1, //Edicion
  'PUBLISHED' = 2, //Publicado no se permite editar permite el cambio edicion
  'INACTIVE' = 3, //Baja no se permite editar. se acabo el royo
  //FALLIDO****
  // PUBLICANDO no puede pasar a edicion.. bloquea
}

export interface GroupDTO {
  id?: string;
  name?: string;
  idCompany?: number;
  idType?: GroupType;
  idCountry?: number;
  adminNameIBH?: string;
  adminNameEmail?: string;
  landingPage?: string | null;
  isMyRoom?: boolean;
  receiverInvoiceMails?: string;
  idThresholdType?: ThresholdType;
  thresholdValue?: number;
  isPartialPayment?: boolean;
  idRateType?: RateType;
  status?: GroupStatusType;
  quotas?: HotelQuotaDTO[];
  splitPayment?: SplitPaymentDTO;
  dates?: GroupDatesDTO;
  promoOffers?: PromotionDTO;
  promotion?: PromotionDTO;
  meetingPlanner?: MeetingPlannerDTO;
  audits?: AuditDTO[];
  meetingPlannerId?: string;
  provisionalBookings?: ProvisionalBookingDTO[];
  userName: string;
}

export interface QuotaDTO {
  idGroup?: string;
  id?: string;
  idHotel?: string;
  idRoomType?: string;
  idRate?: number;
  roomCount?: number;
  isRateVAT?: boolean;
  quotaDate?: string;
}

export interface SplitPaymentDTO {
  id?: string;
  idGroup?: string;
  idPaymentFeeType?: PaymentFeeType;
  firstPaymentFee?: number;
  lastPaymentFeeDate?: string;
}

export interface GroupDatesDTO {
  id?: string;
  idGroup?: string;
  minStay?: number;
  releases?: number;
  bookingWindowStart?: string;
  bookingWindowEnd?: string;
  travelPeriodStart?: string;
  travelPeriodEnd?: string;
  travelPeriodPreviousDays?: number;
  travelPeriodPostDays?: number;
}

export interface PromotionDTO {
  id?: string;
  idGroup?: string;
  promoCode?: string;
  count?: number;
}

export interface MeetingPlannerDTO {
  id?: string;
  name?: string;
  email?: string;
  status?: boolean;
  account?: string;
}

export interface AuditDTO {
  id?: string;
  groupId?: string;
  userName?: string;
  dateTime?: string;
  action?: string;
  actionType?: GroupActionType;
}

export enum GroupActionType {
  Creacion = 1,
  Modificacion = 2,
  PublicacionAPIN = 3,
  PublicacionCRM = 4,
  PublicacionCMS = 5,
  Baja = 6,
  CreacionCodigoPromocional = 7,
  ModificacionCodigoPromocional = 8,
  RegistroFactura = 9,
  DescargaFactura = 10,
  MeetingPlannerAsociado = 11,
  ModificacionMeetingPlannerAsociado = 12,
}

export enum GroupType {
  Leisure = 1,
  Mice = 2,
  Sports = 3,
  Wedding = 4,
}

export enum RateType {
  iRate = 1,
  Web = 2,
}

export enum PaymentFeeType {
  Percentage = 1,
  Value = 2,
  Night = 3,
}

export enum ThresholdType {
  Percentage = 1,
  Value = 2,
}

export interface HotelDTO {
  id: string;
  name?: string;
  abbreviation?: string;
}
export interface RateDTO {
  rateId: number;
  rateName: string;
}
export interface RoomDTO {
  hotelId: string;
  rateId: number;
  rateDesc: string;
}

export interface ProvisionalBookingDTO {
  bookingCode: string;
  groupId: string;
  bookingStartDate: Date;
  bookingEndDate: Date;
  idHotel: string;
  idRoomType: string;
  idRate: number;
}

export interface OfferDTO {
  id: string;
  name: string;
}

export interface HotelQuotaDTO {
  id: string;
  name: string;
  rates: {
    id: number;
    name: string;
    rooms?: {
      id: string;
      name: string | number;
      quotas?: {
        startDate: Date;
        endDate: Date;
        quantity: number;
      }[];
    }[];
  }[];
}