export interface SmsGateway {
  sendSms(phoneNumber: string, message: string): Promise<boolean>;
}
