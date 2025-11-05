import {
  type RequestCustomOtpResponse,
  type RequestCustomOtpDto,
  type ValidateHieCustomOtpDto,
  type ValidateHieCustomOtpResponse,
} from '../types';

const baseUrl = 'https://ngx.ampath.or.ke/hie';

export async function requestCustomOtp(requestCustomOtpDto: RequestCustomOtpDto): Promise<RequestCustomOtpResponse> {
  const customOtpUrl = `${baseUrl}/client/send-custom-otp`;
  const resp = await fetch(customOtpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...requestCustomOtpDto }),
  });
  const data = await resp.json();
  return data;
}

export async function validateCustomOtp(
  validateHieCustomOtpDto: ValidateHieCustomOtpDto,
): Promise<ValidateHieCustomOtpResponse> {
  const validateOtpUrl = `${baseUrl}/client/validate-custom-otp`;
  const resp = await fetch(validateOtpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...validateHieCustomOtpDto }),
  });
  const data = await resp.json();
  return data;
}
