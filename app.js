var express = require('express');
var app = express();
var GithubApi = require('github');

var github = new GithubApi({
  version: '3.0.0',
  protocol: 'https'
});

app.use(express.static(__dirname + '/public'));

var getCommits = function(data) {
  var results = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].payload && data[i].payload.commits) {
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

app.get('/', function(req, res) {
  github.events.getFromUser({ user: 'kronion' }, function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(err);
    }
    else {
      // console.log(data);
      res.send(getCommits(data));
    }
  });
});

app.listen(8008);
