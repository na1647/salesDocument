var mocha = require('mocha');
var path = require('path');

// Build a Mocha Runner
var test = new mocha({
  bail: true,
  timeout: 2000
});

test.addFile(path.join(__dirname, 'index.js'));


var runner = test.run(function(err) {
  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});

runner.on('fail', function(e) {
  console.error(e.err);
});

console.log('Testing salesDocument\n');
