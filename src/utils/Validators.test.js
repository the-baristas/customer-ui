import {checkEmailIsValid, checkPhoneIsValid, checkPasswordIsValid} from './Validators';

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