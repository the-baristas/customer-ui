import {checkEmailIsValid, checkPhoneIsValid, checkPasswordIsValid, checkZipcodeIsValid, checkStateIsValid} from './Validators';

it("check email validator works", () => {
    expect(checkEmailIsValid('valid@email.com')).toBeTruthy();
    expect(checkEmailIsValid('valid2@aaasddfgh.gov')).toBeTruthy();
    expect(checkEmailIsValid('no')).toBeFalsy();
    expect(checkEmailIsValid('invalidvalid@email.')).toBeFalsy();
})

it("check phone validator works", () => {
    expect(checkPhoneIsValid('8885551111')).toBeTruthy();
    expect(checkPhoneIsValid('7573340001')).toBeTruthy();
    expect(checkPhoneIsValid('no')).toBeFalsy();
    expect(checkPhoneIsValid('22243')).toBeFalsy();
    expect(checkPhoneIsValid('1111111111')).toBeFalsy();
})

it("check password validator works", () => {
    expect(checkPasswordIsValid('ValidPassword#444')).toBeTruthy();
    expect(checkPasswordIsValid('P@ssW0rd')).toBeTruthy();
    expect(checkPasswordIsValid('no')).toBeFalsy();
    expect(checkPasswordIsValid('thisislongenoughbutstillno')).toBeFalsy();
    expect(checkPasswordIsValid('StillNoGoAway55')).toBeFalsy();
    expect(checkPasswordIsValid('@@@no###^^NO')).toBeFalsy();
    expect(checkPasswordIsValid('No9$')).toBeFalsy();
})

it("check ZIP code validator works", () => {
    expect(checkZipcodeIsValid('12345')).toBeTruthy();
    expect(checkZipcodeIsValid('99999')).toBeTruthy();
    expect(checkZipcodeIsValid('no')).toBeFalsy();
    expect(checkZipcodeIsValid('123456789')).toBeFalsy();
    expect(checkZipcodeIsValid('1234')).toBeFalsy();
})

it("check state validator works", () => {
    expect(checkStateIsValid('CA')).toBeTruthy();
    expect(checkStateIsValid('NY')).toBeTruthy();
    expect(checkStateIsValid('no')).toBeFalsy();
    expect(checkStateIsValid('nonono')).toBeFalsy();
    expect(checkStateIsValid('ZJ')).toBeFalsy();
})