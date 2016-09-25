import { Meteor } from 'meteor/meteor';

export const JqlMonitorUi = {
  refresh: function(monitorId, jiraUrl, jql) {
    console.log('call jira.search with jql: "' + jql + '" (monitor for "' + monitorId + '")');
    Meteor.call('jira.search', jiraUrl, jql, function onComplete(err, jqlMonitorData) {
      if (err) {
        console.error(err);
      } else {
        console.log(jqlMonitorData);
        var monitorEl = document.getElementById(monitorId);
        monitorEl.innerHTML = jqlMonitorData.asHtml;
        monitorEl.className = 'monitor monitor-' + jqlMonitorData.temperature;
        monitorEl.setAttribute('title', jqlMonitorData.issueKeys.toString().replace(',', ', '));
      }
    });
  }
};
