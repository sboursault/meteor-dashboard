
import { Meteor } from 'meteor/meteor';

export const ServerUtils = {

  apiCall: function (request, callback) {

    // TODO : assert request.url is not null

    if (!request.url)
      throw 'request.url is mandatory';

    console.log('GET ' + request);
    // try…catch allows you to handle errors
    try {
      var response = HTTP.get(request.url).data;
      // Return the contents from the JSON response
      callback(null, response);
    } catch (error) {
      // If the API responded with an error message and a payload
      if (error.response) {
        var errorCode = error.response.data.code;
        var errorMessage = error.response.data.message;
      // Otherwise use a generic error message
      } else {
        var errorCode = 500;
        var errorMessage = 'Cannot access the API';
      }
      // Create an Error object and return it via callback
      var myError = new Meteor.Error(errorCode, errorMessage);
      callback(myError, null);
    }

  }
};



