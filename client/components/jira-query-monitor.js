import { Template } from 'meteor/templating';

import './jira-query-monitor.html'

Template.jiraQueryMonitor.helpers({
  yippeeKiYay: function (monitorId, jql) {

    console.log('search in jira with "' + jql + '"');

    /*p.addEventListener("receivedJqlResults", function(e) {
    	if (e.monitorId === this.id) {
    	}
    })*/

    Meteor.call('searchInJira', jql, function onComplete(err, data) {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
         //document.dispatchEvent(new CustomEvent("receivedJqlResults", {monitorId: monitorId, results: data}));
        var nbrOfIssuesPerPriority = Template.jiraQueryMonitor.countIssuesPerPriority(data);
        var monitorEl = document.getElementById(monitorId);
        Template.jiraQueryMonitor.display(monitorEl, nbrOfIssuesPerPriority);
      }
    });
  },
});

Template.jiraQueryMonitor.countIssuesPerPriority = function(data) {
  var issuesPerPriority = {};
  for (const it of data.issues) {
   var priority = it.fields.priority;
   if (issuesPerPriority[priority.id])
     issuesPerPriority[priority.id].count++;
   else
     issuesPerPriority[priority.id] = {name: priority.name, count: 1};
  }
  return issuesPerPriority;
};

Template.jiraQueryMonitor.display = function(monitorEl, nbrOfIssuesPerPriority) {
  var html = '';
  for (const prop in nbrOfIssuesPerPriority) {
    html += nbrOfIssuesPerPriority[prop].name + ': ' + nbrOfIssuesPerPriority[prop].count + '<br>'
  }
  monitorEl.innerHTML = html;
  if (nbrOfIssuesPerPriority[1])
    monitorEl.className = "monitor monitor-danger";
  else if (nbrOfIssuesPerPriority[2])
    monitorEl.className = "monitor monitor-warning";
  else if (nbrOfIssuesPerPriority[3])
    monitorEl.className = "monitor monitor-success";
};
