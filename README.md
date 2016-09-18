# meteor-dashboard

Meteor-dashboard is a sample application to show how to pick data from external apis to generate a dashboard.

Let's say we want to monitor some jira issues based on some filters, we can get something like the following picture :

![sample_dashboard](./sample_dashboard.png "sample_dashboard")

Meteor-dashboard is based on https://www.meteor.com/ (Many thanks Captain Obvious !)

## Run metor-monitor

To run the application, you need first to install meteor : https://www.meteor.com/install

    git clone
    cd meteor-dashboard
    meteor

and open your browser to http://localhost:3000/


## First steps

In `client/main.js`, define the filters you want to monitor:

    Template.body.helpers({
      jiraQueryMonitors: [
        { id: 'product1', title: 'product A', jql: 'product = "product A"' },
        { id: 'product2', title: 'product B', jql: 'product = "product B"' },
        { id: 'product3', title: 'product C', jql: 'product = "product C"' },
        { id: 'product4', title: 'product D', jql: 'product = "product D"' }
      ],
    });

In `client/main.html`, define the main template:

    <head>
      <title>My dashboard</title>
    </head>
    <body>
      <div class="container theme-showcase" role="main">
        <h1 class="page-header">Issues detected</h1>
        <div class="row">
          {{#each jiraQueryMonitors}}
            {{> jiraQueryMonitor}}
          {{/each}}
        </div>
      </div>
    </body>

In `server/jira-connector.js`, define the url for your jira instance:

    var jiraUrl = 'https://jira.atlassian.com';

## To do

- implement jenkins connector

## Resources
https://www.meteor.com/tutorials/blaze/creating-an-app
https://www.discovermeteor.com/blog/a-guide-to-meteor-templates-data-contexts/
https://dzone.com/articles/integrating-external-apis-your
https://docs.atlassian.com/jira/REST/cloud/
