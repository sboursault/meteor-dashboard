import { Meteor } from 'meteor/meteor';
import { ServerUtils } from '../../../imports/utils/server-utils.js';
import { JiraQueryMonitorData } from './monitor-data.js';

const httpOptions = {/*auth: '<user>:<passwd>'*/};

Meteor.methods({
  'jira.search': function (url, jql) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('jira.search: "' + jql + '"');
    jql = encodeURIComponent((jql || '') + ' order by priority');
    url += '/rest/api/2/search/?maxResults=20&jql=' + jql;
    var response = Meteor.wrapAsync(ServerUtils.apiCall)(url, httpOptions);
    return new JiraQueryMonitorData(url, response);
  },
  'jira.versions': function(url, project, regex) {
    this.unblock(); // avoid blocking other method calls from the same client
    console.log('jira.versions: "' + project + ' (regex: /' + regex + '/)"');
    url += '/rest/api/2/project/' + project + '/versions';
    const response = Meteor.wrapAsync(ServerUtils.apiCall)(url, httpOptions);
    return response.map(
      (version) => { return version.name }
    ).filter(
      (versionName) => { return versionName.match(new RegExp(regex)) }
    );
  }
});

