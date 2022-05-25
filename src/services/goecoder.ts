export const geocoder = async (payload: Number) => {
       const NodeGeocoder = require('node-geocoder');
       const options = {
              provider: 'Mapquest',
              apiKey: 'EU7u1m3DSST6cDeun4unv2bGQSWinRQM', // Google Premier
              formatter: null // 'gpx', 'string', ...
       };

       const geocoder = NodeGeocoder(options);

       const res = await geocoder.geocode(payload);
       return res
}