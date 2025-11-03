export enum HieClientVerificationIdentifierType {
  NationalID = 'National ID',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number',
}

export type RequestCustomOtpDto = {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
};

export type RequestCustomOtpResponse = {
  message: string;
  sessionId: string;
  maskedPhone: string;
};

export type ValidateHieCustomOtpDto = {
  sessionId: string;
  otp: number | string;
  locationUuid: string;
};

export type ValidateHieCustomOtpResponse = {
  data: {
    identification_type: string;
    identification_number: string;
    status: HieOtpValidationStatus;
  };
  source?: string;
};

export type HieOtpValidationStatus = 'valid' | 'invalid';
