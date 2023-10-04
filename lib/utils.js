const libphonenumber = require('google-libphonenumber');
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

function phoneValidator(suspiciousPhoneNumber){
    try{
        // Parse the phone number
        const parsedNumber = phoneUtil.parseAndKeepRawInput(suspiciousPhoneNumber, null);

        // Check if the phone number is valid
        if (phoneUtil.isValidNumber(parsedNumber)) {

            // Get the country code
            const countryCode = phoneUtil.getRegionCodeForNumber(parsedNumber);
            const phoneNumber = phoneUtil.format(parsedNumber, libphonenumber.PhoneNumberFormat.E164);

            return {
                isValid: true,
                countryCode,
                phoneNumber,
            };
        } else {
            return {
                isValid: false,
                errorMessage: 'Invalid phone number',
            };
        }
        
    }catch(error){
        return {
            isValid: false,
            errorMessage: 'Error parsing phone number',
        };
    }
}


module.exports = { phoneValidator };
