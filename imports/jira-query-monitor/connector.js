import { Meteor } from 'meteor/meteor';
import { ServerUtils } from '../utils/server-utils.js';

const httpOptions = {/*auth: '<user>:<passwd>'*/};

function JqlMonitorData(data) {
  const nbrOfIssuesPerPriority =
    (function() {
      var nbrOfIssuesPerPriority = {}, priority;
      for (const it of data.issues) {
        priority = it.fields.priority;
        if (nbrOfIssuesPerPriority[priority.id])
          nbrOfIssuesPerPriority[priority.id].issues.push(it.key);
        else
          nbrOfIssuesPerPriority[priority.id] = {name: priority.name, issues: [it.key]};
      }
      return nbrOfIssuesPerPriority;
    })();
  this.asHtml =
    (function() {
      var html = '';
      for (const prop in nbrOfIssuesPerPriority) {
        html += '<span>';
        html += nbrOfIssuesPerPriority[prop].name + ': ' + nbrOfIssuesPerPriority[prop].issues.length;
        html += '<span/><br>';
      }
      return html || 'No issues';
    })();
  this.temperature =
    (function() {
      if (nbrOfIssuesPerPriority[1])
        return 'danger';
      else if (nbrOfIssuesPerPriority[2] || nbrOfIssuesPerPriority[3])
        return 'warning';
      else
        return 'ok';
    })();
  this.issueKeys =
    (function() {
      var keys = [];
      for (const it of data.issues) {
        keys.push(it.key)
      }
      return keys;
    })();
}

Meteor.methods({
  'jira.search': function (url, jql) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('jira.search: "' + jql + '"');
    jql = encodeURIComponent((jql || '') + ' order by priority');
    url += '/rest/api/2/search/?maxResults=20&jql=' + jql;
    var response = Meteor.wrapAsync(ServerUtils.apiCall)(url, httpOptions);
    return new JqlMonitorData(response);
  },
  'jira.versions': function(url, project, regex) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('jira.versions: "' + project + ' (regex: /' + regex + '/)"');
    url += '/rest/api/2/project/' + project + '/versions';
    var response = Meteor.wrapAsync(ServerUtils.apiCall)(url, httpOptions);
    var versionNames = response.map(
      function keepOnlyVersionName(version) {return version.name}
    );
    return versionNames.filter(function (name) { return name.match(new RegExp(regex)) });
  }
});

