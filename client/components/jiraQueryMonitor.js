import { Template } from 'meteor/templating';

import './jiraQueryMonitor.html'

var jiraUrl = 'https://jira.atlassian.com';

Template.jiraQueryMonitor.helpers({
  yippeeKiYay: function (elementId, jql) {

    console.log('search in jira with "' + jql + '"');

    Meteor.call('searchInJira', jiraUrl, jql, function onComplete(err, data) {
      // The method call sets the Session variable to the callback value
      if (err) {
        console.error(err);
      } else {
        console.log(data);

        //var countIssuesPerPriority = function(data)
        var issuesPerPriority = {};
        for (const it of data.issues) {
          var priority = it.fields.priority;
          if (issuesPerPriority[priority.id])
            issuesPerPriority[priority.id].count++;
          else
            issuesPerPriority[priority.id] = {name: priority.name, count: 1};
        }

        var p = document.getElementById(elementId);

        var html = '';
        for (const prop in issuesPerPriority) {
          html += issuesPerPriority[prop].name + ': ' + issuesPerPriority[prop].count + '<br>'
        }
        p.innerHTML = html;
        if (issuesPerPriority[1])
          p.className = "label label-danger";
        else if (issuesPerPriority[2])
          p.className = "label label-warning";
        else if (issuesPerPriority[3])
          p.className = "label label-success";
      }
    });
  }
});
