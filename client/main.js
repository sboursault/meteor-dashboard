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
  (function() {
    var monitorRequisites = ['affectedVersion'];
    window.addEventListener('jiraQueryMonitor:baseFilter:update', function (e) {
      monitorRequisites._remove_(e.detail);
      if (monitorRequisites.length === 0) {
        window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:complete', {}));
      }
    });
  })();

  if (affectsVersionParam) {
    var regex = affectsVersionParam.replace('.', '\\.') + '(\\D.*)?$';
    Meteor.call('jira.versions', jiraUrl, jiraProject, regex,
      function onComplete(err, versions) {
        if (err) {
          console.error(err);
        } else {
          versions = (versions || []).map(function(version) { return '"' + version + '"' });
          console.log('found matching versions: ' + versions.toString());
          baseFilter = (baseFilter || '') + ' AND affectedVersion in (' + versions.toString() + ')';
          window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:update', {detail: 'affectedVersion'}));
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
  runMonitor: function() {
    var jiraQueryMonitor = this;
    window.addEventListener('jiraQueryMonitor:baseFilter:complete', function () {
      const filter = baseFilter + (jiraQueryMonitor.jql ? (' and ' + jiraQueryMonitor.jql) : '');
      JqlMonitorUi.refresh(jiraQueryMonitor.id, jiraUrl, filter);
    });
  },
  now: function() {
    const currentTime = new Date();
    return currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString();
  }
});

