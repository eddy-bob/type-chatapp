export const geocoder = async (payload: [number, string]) => {
       const NodeGeocoder = require('node-geocoder');
       const options = {
              provider: 'google',
              apiKey: 'AIzaSyB2D1wwqCbO6dxeYKIBeEisPgiR0QEhpgc', // Google Premier
              formatter: null // 'gpx', 'string', ...
       };

       const geocoder = NodeGeocoder(options);
       const res = await geocoder.geocode(
              [payload[0], payload[1]]
       );
       return res
}