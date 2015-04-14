/* Express */
var express = require('express');
var app = express();

/* App settings */
app.set('port', process.env.PORT || 8008);

/* Middleware */
var compression = require('compression');

app.use(compression())
   .use(express.static(__dirname + '/public'));

/* GitHub API */
var GithubApi   = require('github');
var github = new GithubApi({
  version: '3.0.0',
  protocol: 'https'
});

/* Utils */
if (process.env.NODE_ENV !== 'production') {
  var clc = require('cli-color');
}

var parseCommit = function(commits) {
}

var getCommits = function(data) {
  var results = [];
  // For each event...
  for (var i = 0; i < data.length; i++) {
    if (data[i].payload && data[i].payload.commits) {
      // For each commit...
      for (var j = 0; j < data[i].payload.commits.length; j++) {
        var o = {};
        o.email   = data[i].payload.commits[j].author.email;
        o.message = data[i].payload.commits[j].message;
        results.push(o);
      }
    }
  }
  return results;
}

/* Routes */
app.get('/', function(req, res) {
  github.events.getFromUser({ user: 'kronion' }, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(err);
    }
    else {
      res.send(getCommits(data));
    }
  });
});


if (process.env.NODE_ENV !== 'production') {
  console.log("Git Commitment listening on port " + clc.green(app.get('port')));
}
app.listen(app.get('port'));
