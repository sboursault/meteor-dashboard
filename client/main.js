import { Template } from 'meteor/templating';

import './main.html';

Template.body.helpers({
  jiraQueryMonitors: [
    { id: 'product1', title: 'product A', jql: 'assignee="copain"' },
    { id: 'product2', title: 'product B', jql: '' },
    { id: 'product3', title: 'product C', jql: 'priority in (High, Medium)' },
    { id: 'product4', title: 'product D', jql: 'priority in (Medium, Low)' }
  ],
});
