import { Template } from 'meteor/templating';
import { JqlMonitorUi } from '../imports/jira-query-monitor/ui.js';

import './main.html';

const jiraUrl = 'https://jira.atlassian.com';

Template.body.helpers({
  jiraQueryMonitors: [
    { monitorId: 'product1', title: 'product A', jql: 'assignee="copain"' },
    { monitorId: 'product2', title: 'product B', jql: '' },
    { monitorId: 'product3', title: 'product C', jql: 'priority in (High, Medium)' },
    { monitorId: 'product4', title: 'product D', jql: 'priority in (Medium, Low)' }
  ],
  refreshMonitor: function() {
    JqlMonitorUi.refresh(this.monitorId, jiraUrl, this.jql);
  }
});
