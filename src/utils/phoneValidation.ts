export const isPhoneNumberValid = (phoneNumber: string): boolean => {
    const phoneRegex = /^\+?[0-9]{9,}$/;
    return phoneRegex.test(phoneNumber);
}