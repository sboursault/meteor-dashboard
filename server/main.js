import { Meteor } from 'meteor/meteor';
import { ServerUtils } from './server-utils.js';


Meteor.startup(() => {
  // code to run on server at startup
});

var jiraUrl = 'https://jira.atlassian.com';

Meteor.methods({
  // The method expects a valid IPv4 address
  'searchInJira': function (jql) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('Method.searchInJira for' + jql);
    var request = '/rest/api/2/search/?maxResults=10&jql=' + jql;
    var response = Meteor.wrapAsync(ServerUtils.apiCall)({url: jiraUrl + request});
    console.log('found ' + response.total + ' for ' + jql);
    return response;
  }
});




