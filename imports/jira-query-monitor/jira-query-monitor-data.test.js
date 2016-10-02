import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';
import { JiraQueryMonitorData } from './jira-query-monitor-data.js';

const url = 'http://jira.atlassian.com';

if (Meteor.isServer) {
  describe('jira-quer-monitor', () => {
    describe('JiraQueryMonitorData', () => {
      it('calculates the temperature (danger)', () => {
        const apiResponse = { issues: [
          { key: 'ISSUE-1001', fields : { priority: { id: "1", name: "Blocker" } } },
          { key: 'ISSUE-1006', fields : { priority: { id: "3", name: "Major" } } }
        ]};
        expect(
          new JiraQueryMonitorData(url, apiResponse).temperature
        ).to.equal('danger');
      }),
      it('calculates a temperature (warning)', () => {
        const apiResponse = { issues: [
          { key: 'ISSUE-1006', fields : { priority: { id: "3", name: "Major" } } }
        ]};
        expect(
          new JiraQueryMonitorData(url, apiResponse).temperature
        ).to.equal('warning');
      }),
      it('calculates a temperature (ok)', () => {
        const apiResponse = { issues: [] };
        expect(
          new JiraQueryMonitorData(url, apiResponse).temperature
        ).to.equal('ok');
      })
    });
  });
}