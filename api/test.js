const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/path/to/your-secret-key.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});