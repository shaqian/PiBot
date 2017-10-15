var async = require('async');
var bodyParser = require('body-parser');
var cors = require('cors');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var express = require('express');
var fs = require('fs');
var https = require('https');
var multer  = require('multer');
var config = require('./config');
var motor = require('./motor');

console.log("Current platform: " + process.platform);

if (process.platform === 'linux') {
  var videDir = config.picamDir + 'rec/archive';
  var musicDir = config.musicDir;
} else {
  var videDir = './archive';
  var musicDir = './archive/music';
}

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use("/videos", express.static(videDir));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, 'audio')
  }
});

var upload = multer({ storage: storage });

var server = app.listen(config.PORT, function () {
  console.log('Running on HTTP port: ' + config.PORT);
});

app.post('/audio', upload.any(), function (req, res) {
  var cmd = 'avplay /tmp/audio';
  _execute(cmd);
  res.send('OK');
});

app.get('*', function (req, res) {
  res.sendFile('public/index.html', { root: __dirname });
});

// Servo
const max = 11.5, min = 2.5;
var dutyCycle = 7;

var music, musicProcess, recording;

// Websocket
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('disconnect', function () {
    if (recording) {
      _stopRecording();
    }
  });

  socket.on('ac', (msg) => {
    if(msg === true) {
      var cmd = config.baseDir + 'bin/on.out';
    } else {
      var cmd = config.baseDir + 'bin/off.out';
    }
    _execute(cmd);
  });

  socket.on('fan', (msg) => {
    var cmd = config.baseDir + 'bin/on.out';
    _execute(cmd);
  });

  socket.on('speaker', (msg) => {
    var cmd = "amixer set 'Speaker',0 " + msg + '%';
    _execute(cmd);
  });

  socket.on('camera', (msg) => {
    dutyCycle = (msg + max - min) / 2 + min;
    var cmd = config.baseDir + 'bin/direct.py ' + dutyCycle;
    _execute(cmd);
  });

  socket.on('music', (msg) => {
    if (musicProcess) {
      var cmd = 'kill ' + musicProcess.pid;
      _execute(cmd);
    }
    if (music !== msg) {
      var filename = musicDir + msg;
      musicProcess =  spawn('mpg123', [ filename ], {detached: true});
      console.log(musicProcess.pid);
      music = msg;
    } else {
      music = undefined;
    }
  });

  socket.on('recordedVideos', () => {
    _refreshVideos();
  });

  socket.on('refreshMusicFiles', () => {
    _refreshMusicFiles();
  });

  socket.on('roomTemp', () => {
    var res = '';
    if (process.platform === 'linux') {
      while (res.length === 0) {
        res = execSync('python ' + config.baseDir + 'bin/temp_hum/getTemp.py').toString().trim();
      }
    } else {
      res = '20';
    }
    socket.emit('roomTemp', res);
  });

  socket.on('roomHumidity', () => {
    var res = '';
    if (process.platform === 'linux') {
      while (res.length === 0) {
        res = execSync('python ' + config.baseDir + 'bin/temp_hum/getHum.py').toString().trim();
      }
    } else {
      res = '50';
    }
    socket.emit('roomHumidity', res);
  });

  socket.on('direction', (msg) => {
    console.log(msg);
    switch (msg) {
      case 'forward':
        motor.forward();
        break;
      case 'backward':
        motor.backward();
        break;
      case 'left':
        motor.left();
        break;
      case 'right':
        motor.right();
        break;
      case 'camleft':
        dutyCycle = dutyCycle + 1.5 > max ? dutyCycle: dutyCycle + 1.5;
        var cmd = config.baseDir + 'bin/direct.py ' + dutyCycle;
        _execute(cmd);
        break;
      case 'camright':
        dutyCycle = dutyCycle - 1.5 < min ? dutyCycle: dutyCycle - 1.5;
        var cmd = config.baseDir + 'bin/direct.py ' + dutyCycle;
        _execute(cmd);
        break;
      default:
        motor.stop();
    }
  });

  socket.on('record', (msg) => {
    if (msg) {
      _startRecording();
    } else {
      _stopRecording();
    }
  });
});

var _execute = function (cmd) {
  console.log('Execute command: ' + cmd);
  exec(cmd,
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
  });
}

// Initialize servo to middle position
if (process.platform == 'linux') {
  var cmd = config.baseDir + 'bin/direct.py 7';
  _execute(cmd);
}

// Initialize motor output
motor.init();

var _startRecording = function () {
  recording = true;
  var cmd = 'rm -rf ' + config.picamDir + 'hooks/*; rm -rf ' + config.picamDir + 'rec/archive/*.ts; rm -rf ' + config.picamDir + 'rec/*.ts';
  _execute(cmd);
  cmd =  'touch ' + config.picamDir + 'hooks/start_record';
  _execute(cmd);
}

var _stopRecording = function () {
  recording = false;
  var cmd = 'touch ' + config.picamDir + 'hooks/stop_record';
  _execute(cmd);
  cmd = 'cd ' + videDir + "; VIDEO=`ls -r | grep .ts | head -n 1`; OUTFILE=`echo $VIDEO | cut -f1 -d'.'`; avconv -i $VIDEO -c:v copy -c:a copy -bsf:a aac_adtstoasc $OUTFILE.mp4";
  _execute(cmd);
  setTimeout(function () {
    _refreshVideos();
  }, 5*1000);
}

var _refreshVideos = function () {
  console.log(videDir);
  fs.readdir(videDir, function (err, files) {
    console.log(files);
    var videos = [];
    if (files) {
      for (var i=0; i<files.length; i++) {
        if (files[i].indexOf('.mp4') !== -1) {
          videos.push(files[i]);
        }
      }
    }
    io.emit('recordedVideos', videos);
  });
}

var _refreshMusicFiles = function () {
  fs.readdir(musicDir, function (err, files) {
    console.log(files);
    var music = [];
    if (files) {
      for (var i=0; i<files.length; i++) {
        if (files[i].indexOf('.mp3') !== -1) {
          music.push(files[i]);
        }
      }
    }
    io.emit('refreshMusicFiles', music);
  });
}
