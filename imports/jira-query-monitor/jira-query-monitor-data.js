
export function JiraQueryMonitorData(url, data) {
  const nbrOfIssuesPerPriority =
    (function() {
      var nbrOfIssuesPerPriority = {}, priority;
      for (const it of data.issues) {
        priority = it.fields.priority;
        if (nbrOfIssuesPerPriority[priority.id])
          nbrOfIssuesPerPriority[priority.id].issues.push(it.key);
        else
          nbrOfIssuesPerPriority[priority.id] = {name: priority.name, issues: [it.key]};
      }
      return nbrOfIssuesPerPriority;
    })();
  this.asHtml =
    (function() {
      var html = '';
      for (const prop in nbrOfIssuesPerPriority) {
        html += '<span>';
        html += nbrOfIssuesPerPriority[prop].name + ': ' + nbrOfIssuesPerPriority[prop].issues.length;
        html += '<span/><br>';
      }
      const linkHref = url.replace('/rest/api/2/search/', '/issues/').replace(/maxResults=\d+&/i, '')
      return '<a href="' + linkHref + '">' + (html || '<span>No issues</span>') + '</a>';
    })();
  this.temperature =
    (function() {
      if (nbrOfIssuesPerPriority[1])
        return 'danger';
      else if (nbrOfIssuesPerPriority[2] || nbrOfIssuesPerPriority[3])
        return 'warning';
      else
        return 'ok';
    })();
  this.issueKeys =
    (function() {
      var keys = [];
      for (const it of data.issues) {
        keys.push(it.key)
      }
      return keys;
    })();
}