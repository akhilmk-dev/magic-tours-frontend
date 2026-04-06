const { isValidPhoneNumber, parsePhoneNumber } = require('libphonenumber-js');

const numbers = ['+9112345678', '+911234567', '+919876543210'];

numbers.forEach(num => {
    try {
        const parsed = parsePhoneNumber(num);
        console.log(`Number: ${num}`);
        console.log(`  IsValid: ${isValidPhoneNumber(num)}`);
        console.log(`  Type: ${parsed.getType() || 'unknown'}`);
        console.log(`  IsPossible: ${parsed.isPossible()}`);
        console.log('---');
    } catch (e) {
        console.log(`Number: ${num}`);
        console.log(`  Error: ${e.message}`);
        console.log('---');
    }
});
