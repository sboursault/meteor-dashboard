import { Template } from 'meteor/templating';
import { ClientUtils } from '../../../imports/utils/client-utils.js';
import { JqlMonitorUi } from '../../../imports/jira-query-monitor/ui.js';


// jiraUrl is the url of your jira instance
const jiraUrl = 'https://jira.atlassian.com';

// baseFilter will serve as a prefix for all your seearch queries
var baseFilter = 'resolution = Unresolved';

// jiraQueryMonitorArray defines the filters you want to monitor
const jiraQueryMonitorArray = [
  { id: 'product1', title: 'product A', jql: 'assignee="copain"' },
  { id: 'product2', title: 'product B', jql: 'priority in (Low)' },
  { id: 'product3', title: 'product C', jql: 'priority in (High, Medium)' },
  { id: 'product4', title: 'product D', jql: 'priority in (Medium, Low)' }
];

// affectsVersionParam is used to add a an 'affectedVersion' criteria to the baseFilter.
// this parameter is optional.
const affectsVersionParam = ClientUtils.getUrlParams()['affectsVersion'];
// jiraProject is required to use the affectsVersionParam
const jiraProject = ''

Template.body.onRendered(function () {
  (function() {
    var monitorRequisites = [];
    if (affectsVersionParam && jiraProject) { // TODO:DRY
      monitorRequisites.push('affectedVersion');
    }
    window.addEventListener('jiraQueryMonitor:baseFilter:update', function (e) {
      monitorRequisites._remove_(e.detail);
      if (monitorRequisites.length === 0) {
        window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:complete', {}));
      }
    });
  })();
  if (affectsVersionParam && jiraProject) {
    JqlMonitorUi.fetchMatchingVersions(jiraUrl, jiraProject, affectsVersionParam,
      function onSuccess(versions) {
        baseFilter = (baseFilter || '') + ' and ' + JqlMonitorUi.createFilterAffectsVersion(versions);
        window.dispatchEvent(new CustomEvent('jiraQueryMonitor:baseFilter:update', {detail: 'affectedVersion'}));
      });
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
    const jiraQueryMonitor = this;
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

