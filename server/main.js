// source : https://dzone.com/articles/integrating-external-apis-your

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  // The method expects a valid IPv4 address
  'searchInJira': function (url, jql) {

    // avoid blocking other method calls from the same client
    this.unblock();

    console.log('Method.searchInJira for' + jql);

    // "https://jira.atlassian.com/rest/api/2/search/?callback=JSON_CALLBACK";
    var apiUrl = url + '/rest/api/2/search/?maxResults=10&jql=' + jql;
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    console.log('found ' + response.total + ' for ' + jql);
    return response;
  }
});

var apiCall = function (apiUrl, callback) {

  console.log('GET ' + apiUrl);
  // try…catch allows you to handle errors
  try {
    var response = HTTP.get(apiUrl).data;
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
