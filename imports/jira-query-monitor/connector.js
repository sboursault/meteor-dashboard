import { Meteor } from 'meteor/meteor';
import { ServerUtils } from '../utils/server-utils.js';

function JqlMonitorData(data) {
  this.nbrOfIssuesPerPriority =
    (function() {
      var nbrOfIssuesPerPriority = {}, priority;
      for (const it of data.issues) {
        priority = it.fields.priority;
        if (nbrOfIssuesPerPriority[priority.id])
          nbrOfIssuesPerPriority[priority.id].count++;
        else
          nbrOfIssuesPerPriority[priority.id] = {name: priority.name, count: 1};
      }
      return nbrOfIssuesPerPriority;
    }).call(this);
  this.asHtml =
    (function() {
    console.log(this.nbrOfIssuesPerPriority);
      var html = '';
      for (const prop in this.nbrOfIssuesPerPriority) {
        html += this.nbrOfIssuesPerPriority[prop].name + ': ' + this.nbrOfIssuesPerPriority[prop].count + '<br>';
      }
      return html || 'No issues';
    }).call(this);
  this.temperature =
    (function() {
      if (this.nbrOfIssuesPerPriority[2])
        return 'danger';
      else if (this.nbrOfIssuesPerPriority[3])
        return 'warning';
      else
        return 'ok';
    }).call(this);
}

Meteor.methods({
  // The method expects a valid IPv4 address
  'searchInJira': function (url, jql) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('Method.searchInJira for' + jql);
    var url = url + '/rest/api/2/search/?maxResults=10&jql=' + (jql ? encodeURIComponent(jql) : '');
    var options = {};
    // options.auth = '<user>:<password>';
    var response = Meteor.wrapAsync(ServerUtils.apiCall)(url, options);
    return new JqlMonitorData(response);
  }
});

