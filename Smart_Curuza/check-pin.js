const bcrypt = require('bcrypt');

async function testPins() {
  const hash = '$2b$10$LpES4aLixBQSiA0xGfov6.4VicD9vd3.A/PDKqCsksO0i3j9xlaYG';
  const pins = ['0000', '1111', '1234', '123456', '2222', '0788'];
  
  for (const pin of pins) {
    if (await bcrypt.compare(pin, hash)) {
      console.log('PIN IS:', pin);
      process.exit(0);
    }
  }
  console.log('PIN NOT FOUND IN COMMON LIST');
}

testPins();
