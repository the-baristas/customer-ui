

export const PHONE_REGEX = '1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?';
export const EMAIL_REGEX = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$';
export const PASSWORD_REGEX = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$';
export const STATE_REGEX = "(A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY])";
export const ZIPCODE_REGEX = "^[0-9]{5}(?:-[0-9]{4})?$";

const phoneValidator = new RegExp(PHONE_REGEX);
const emailValidator = new RegExp(EMAIL_REGEX);
const passwordValidator = new RegExp(PASSWORD_REGEX);
const stateValidator = new RegExp(STATE_REGEX);
const zipcodeValidator = new RegExp(ZIPCODE_REGEX);


export const checkEmailIsValid = (email) => {
    return emailValidator.test(email);
}

export const checkPhoneIsValid = (phone) => {
    return phoneValidator.test(phone)
}

export const checkStateIsValid = (state) => {
    return stateValidator.test(state);
}

export const checkZipcodeIsValid = (zip) => {
    return zipcodeValidator.test(zip);
}

export const checkPasswordIsValid = (password) => {
    return passwordValidator.test(password)
}