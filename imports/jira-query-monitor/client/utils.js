import { Meteor } from 'meteor/meteor';

export const JqlMonitorUiUtils = {
  refresh: function(monitorId, jiraUrl, jql) {
    console.log('call jira.search with jql: "' + jql + '" (monitor for "' + monitorId + '")');
    Meteor.call('jira.search', jiraUrl, jql, function onComplete(err, jqlMonitorData) {
      if (err)
        throw err;
      console.log(jqlMonitorData);
      var monitorEl = document.getElementById(monitorId);
      monitorEl.innerHTML = jqlMonitorData.asHtml;
      monitorEl.className = 'monitor monitor-' + jqlMonitorData.temperature;
      monitorEl.setAttribute('title', jqlMonitorData.issueKeys.toString().replace(',', ', '));
    });
  },
  fetchMatchingVersions: function(jiraUrl, jiraProject, version, callback) {
    const regex = version.replace('.', '\\.') + '(\\D.*)?$'; // regex to find versions like <version>.12
    Meteor.call('jira.versions', jiraUrl, jiraProject, regex,
      function onComplete(err, versions) {
        if (err)
          throw err;
        console.log('found matching versions: ' + versions.toString());
        callback(versions);
      }
    );
  },
  createFilterAffectsVersion: function(versions) {
    const array = (versions || []).map(function(version) { return '"' + version + '"' });
    return ' affectedVersion in (' + array.toString() + ') ';
  }
};
