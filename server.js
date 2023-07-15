const http = require('https');
const axios = require('axios');
const https = require('https');


const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/lookup') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const requestData = JSON.parse(data);
      const licensePlate = requestData.licensePlate;
      const licenseState = requestData.licenseState;
      lookupLicensePlate(licensePlate, licenseState);
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const options = {
    method: 'GET',
    hostname: 'apibroker-license-plate-search-v1.p.rapidapi.com',
    path: '/license-plate-search?format=json&state=${licenseState}&plate=${licensePlate}',
    headers: {
      'X-RapidAPI-Key': '3c9e60fb1dmshec25838c52f693cp17550fjsn37bd7d522c31',
      'X-RapidAPI-Host': 'apibroker-license-plate-search-v1.p.rapidapi.com'
    }
  };


function lookupLicensePlate(licensePlate, licenseState) {
  const apiUrl = `https://apibroker-license-plate-search-v1.p.rapidapi.com/license-plate-search?format=json&state=${licenseState}&plate=${licensePlate}`;

  axios.get(apiUrl)
    .then(response => {
      const data = response.data;
      const result = {
        make: data.make,
        model: data.model
      };
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    })
    .catch(error => {

      console.error(error);
      const result = { error: 'An error occurred during the license plate lookup' };
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    });
}

const req = https.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});


