import { Meteor } from 'meteor/meteor';


export const JqlMonitorUi = {
  refresh: function(monitorId, jiraUrl, jql) {
    console.log('search in jira with "' + jql + '" (' + monitorId + ')');
    /*p.addEventListener("receivedJqlResults", function(e) {
        if (e.monitorId === this.id) {
        }
    })*/
    Meteor.call('jira.search', jiraUrl, jql, function onComplete(err, jqlMonitorData) {
      if (err) {
        console.error(err);
      } else {
        console.log(jqlMonitorData);
         //document.dispatchEvent(new CustomEvent("receivedJqlResults", {monitorId: monitorId, results: data}));
        var monitorEl = document.getElementById(monitorId);
        monitorEl.innerHTML = jqlMonitorData.asHtml;
        monitorEl.className = 'monitor monitor-' + jqlMonitorData.temperature;
        monitorEl.setAttribute('title', jqlMonitorData.issueKeys.toString());
      }
    });
  }
};
