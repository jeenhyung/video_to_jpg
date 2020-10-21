// ffmpeg -i videos/youtube/1/videoplayback.mp4 -r 5 -f image2 images/youtube/videoplayback/frame_%d.jpg
const fs = require('fs');
var shell = require('shelljs');

if (!shell.which('ffmpeg')) {
  shell.echo('Sorry, this script requires ffmpeg');
  shell.exit(1);
}

const argv = (() => {
  const arguments = {};
  process.argv.slice(2).map( (element) => {
      const matches = element.match( '--([a-zA-Z0-9]+)=(.*)');
      if ( matches ){
          arguments[matches[1]] = matches[2]
              .replace(/^['"]/, '').replace(/['"]$/, '');
      } else if (element.match( '--help') || element.match( '-h')) {
        console.log(`Flag shorthand -h has been deprecated, please use --help\n`);
        console.log(`Usage:	node index.js [OPTIONS]\n`);
        console.log(`Options:\n`);
        console.log(`\t--frame=1000\t초당 프레임 개수(default: 1)`);
        console.log(`\t--idir=videos/\t동영상 디렉토리(default: videos/)`);
        console.log(`\t--odir=images/\t이미지 디렉토리(default: images/)`);
        process.exit(0);
      }
  });
  return arguments;
})();

// console.log(argv)


const frame = parseInt(argv.frame) || 1;
// console.log(frame)
if (typeof frame !== "number" ) {
  return;
}

// console.log(argv.idir)
const i_dir = argv.idir || 'videos/';
const files =  fs.readdirSync(i_dir); // 디렉토리를 읽어온다
if(files.length === 0 ) return;
// console.log(files);

const o_dir = argv.odir === undefined ? 'images/' : argv.odir;
if (!fs.existsSync(o_dir)){
  fs.mkdirSync(o_dir);
}
// console.log(o_dir);



files.forEach(file => {
  const arSplitFile = file.split(".");
  const input_path = i_dir + file;
  const out_path = o_dir + arSplitFile[0] + "/frame_%d.png";
  
  console.log(`input_path: ${input_path}`);
  console.log(`out_path: ${out_path}`);

  if (!fs.existsSync(o_dir + arSplitFile[0])){
    fs.mkdirSync(o_dir + arSplitFile[0]);
  }

  const cmd = `ffmpeg -i ${input_path} -qscale:v 1 -codec_name -r ${frame} -f image2 ${out_path}`;
  console.log(`cmd: ${cmd}`);

  var child = shell.exec(cmd, {async:true});
  child.stdout.on('data', function(data) {
    /* ... do something with data ... */
    console.log(data);
  });

});

