const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const docs = require('@googleapis/docs')
const { GoogleAuth } = require("google-auth-library");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive']; // full access
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';
// const KEY_FILE_PATH = './credentials.json';
const KEY_FILE_PATH = 'client_secret.json';

// init auth
// const auth = new GoogleAuth(
//   {
//     keyFile: KEY_FILE_PATH,
//     scope: SCOPES
//   }
// );
const auth = new docs.auth.GoogleAuth({
  keyFilename: 'credentials.json',
    // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: SCOPES
});

// const oauth2Client = new google.auth.OAuth2(
//   "361394322306-0f2r5hth18vg70649k20d5375cigcb2b.apps.googleusercontent.com",
//   "gAMxkdD5L6Gf6wdvViv1RPXi",
//   "https://pamforest.com"
// );

async function createAndUploadFile(auth) {
  const driveService = google.drive({version: 'v3', auth});

  // const driveService = google.drive({
  //   version: 'v3',
  //   auth: oauth2Client
  // });

  let fileMetaData = {
    'name': 'evio.json',
    'parents': ['1eBicj01k8My1Nn56Ffc6ngEsRa-CLc0a']
  }

  let media = {
    mimeType: 'application/json',
    body: {
      "test": "test"
    }
  }

  let response = await driveService.files.create({
    resource: fileMetaData,
    media: media,
    fields: 'id'
  });

  switch(response.status) {
    case 200:
      console.log('File create' + response.error)
      break;
    default:
      console.log('1111');
  }
}

createAndUploadFile();


// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), listFiles);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

function uploadFile(auth) {
  const drive = google.drive({version: 'v3', auth});

  var fileMetadata = {
    name: 'test.jpg', // file name that will be saved in google drive
  }
  var media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream('./hello-text.jpg'), // Reading the file
  };

  drive.files.create({
    media: media,
    resource: fileMetadata,
  }, function(err, file){
    console.log(err)
    if (err) {
      // Handle error
      console.error(err.msg);
    } else {
      console.log(file.data.id)
      // if file upload success then return the unique google drive id
    }
  })
 
}