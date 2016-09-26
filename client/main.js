import { Template } from 'meteor/templating';
import { ClientUtils } from '../imports/utils/client-utils.js';
import { JqlMonitorUi } from '../imports/jira-query-monitor/ui.js';

import './main.html';

const jiraUrl = 'https://jira.atlassian.com';
const affectsVersionParam = ClientUtils.getUrlParams()['affectsVersion'];
const jiraProject = ''
var baseFilter = 'resolution = Unresolved';

const jiraQueryMonitorArray = [
  { monitorId: 'product1', title: 'product A', jql: 'assignee="copain"' },
  { monitorId: 'product2', title: 'product B', jql: 'priority in (Low)' },
  { monitorId: 'product3', title: 'product C', jql: 'priority in (High, Medium)' },
  { monitorId: 'product4', title: 'product D', jql: 'priority in (Medium, Low)' }
];

Template.body.onRendered(function () {
  if (affectsVersionParam) {
    var regex = affectsVersionParam.replace('.', '\\.') + '(\\D.*)?$';
    Meteor.call('jira.versions', jiraUrl, jiraProject, regex,
      function onComplete(err, versions) {
        if (err) {
          console.error(err);
        } else {
          versions = (versions || []).map(
            function decorate(version) {
              return '"' + version + '"';
            });
          console.log('found matching versions: ' + versions.toString());
          baseFilter = (baseFilter || '') + ' AND affectedVersion in (' + versions.toString() + ')';
          window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:update', {}));
        }
      }
    );
  } else {
    window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:update', {}));
  }
})

Template.body.helpers({
  affectsVersion: function() {
    return affectsVersionParam ? ('on ' + affectsVersionParam) : '';
  },
  jiraQueryMonitors: function() {
    return jiraQueryMonitorArray;
  },
  refreshMonitor: function() {
    var jiraQueryMonitor = this;
    var monitorId = jiraQueryMonitor.monitorId, jql = jiraQueryMonitor.jql;
    window.addEventListener('jiraQueryMonitor:baseFilter:update', function () {
      JqlMonitorUi.refresh(monitorId, jiraUrl, baseFilter + ( jql ? ' and ' + jql : ''));
    });
  },
});

