
const phoneValidator = new RegExp('1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?');
const emailValidator = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$');
const passwordValidator = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$');

export const checkEmailIsValid = (email) => {
    return emailValidator.test(email);
}

export const checkPhoneIsValid = (phone) => {
    return phoneValidator.test(phone)
}

export const checkPasswordIsValid = (password) => {
    return passwordValidator.test(password)
}