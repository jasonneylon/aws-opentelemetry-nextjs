const fs = require('fs');

export async function handler(event) {
  fs.readdirSync('/var/task/').forEach(file => {
    console.log(file);
  });
  console.log('Hello, World!');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
};
