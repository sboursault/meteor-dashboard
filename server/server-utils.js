import { Meteor } from 'meteor/meteor';

export const ServerUtils = {

  apiCall: function (url, options, callback) {

    if (!url)
      throw 'url is mandatory';

    // try…catch allows you to handle errors
    try {
      var response = HTTP.get(url, options).data;
      // Return the contents from the JSON response
      callback(null, response);
    } catch (error) {
      // If the API responded with an error message and a payload
      //console.log('ERROR: ' + JSON.stringify(error, null, 4));
      if (error.response) {
        var errorCode = error.response.statusCode;
        var errorMessage = error.response.content;
      // Otherwise use a generic error message
      } else {
        var errorCode = 500;
        var errorMessage = 'Cannot access the API';
      }
      // Create an Error object and return it via callback
      var myError = new Meteor.Error(errorCode, errorMessage);
      console.log('ERROR ' + errorCode + ': ' + errorMessage);
      callback(myError, null);
    }

  }
};



