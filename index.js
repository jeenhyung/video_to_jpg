const fs = require('fs');
const extractFrames = require('ffmpeg-extract-frames');
const getVideoDuration = require('node-video-duration');
// const { getVideoDurationInSeconds } = require('get-video-duration');

const videoConfig = require('./video_config.json');


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
        console.log(`\t--frame=1000\tSpace of frames(default: 1000ms)`);
        console.log(`\t--idir=videos\tInput path(default: videos)`);
        console.log(`\t--odir=images\tOutput path(default: images)`);
        process.exit(0);
      }
  });
  return arguments;
})();
// console.log(argv)


const frame = parseInt(argv.frame) || 1000;
// console.log(frame)
if (typeof frame !== "number" ) {
  return;
}

// console.log(argv.idir)
const dir = argv.idir || 'videos';
const files =  fs.readdirSync(dir); // 디렉토리를 읽어온다
if(files.length === 0 ) return;
// console.log(files);


const output_dir = argv.odir === undefined ? './images/' : argv.odir + '/';
if (!fs.existsSync(output_dir)){
  fs.mkdirSync(output_dir);
}
// console.log(output_dir);


const start_time = argv.starttime || undefined;
const end_time = argv.endtime || undefined;



// const timeCalc = () => {
//   console.log(videoConfig[arSplitFile[0]].start_time);

//   const splitStartTime = videoConfig[arSplitFile[0]].start_time.split(':');
//   console.log(parseInt(splitStartTime[0] * 36000));
//   console.log(parseInt(splitStartTime[1] * 6000));
//   console.log(parseInt(splitStartTime[2] * 1000));
//   const start_pos = parseInt((splitStartTime[0] * 36000) + (splitStartTime[1] * 6000) + (splitStartTime[2] * 1000));
//   const splitEndTime = videoConfig[arSplitFile[0]].end_time.split(':');
//   console.log(parseInt(splitEndTime[0] * 36000));
//   console.log(parseInt(splitEndTime[1] * 6000));
//   console.log(parseInt(splitEndTime[2] * 1000));
//   const end_pos = parseInt((splitEndTime[0] * 36000) + (splitEndTime[1] * 6000) + (splitEndTime[2] * 1000));


//   console.log(`start_pos:${start_pos}`);
//   console.log(`end_pos:${end_pos}`);

//   return {"start_pos": start_pos, "end_pos": end_pos}
// }


///////////////////////////////////////////////////////////////////////////////////
//
// 추출
//
///////////////////////////////////////////////////////////////////////////////////
const extractor = (files = [], frame = 1000, output_dir) => {
  console.log(`files: ${JSON.stringify(files)}`);
  console.log(`frame: ${frame}`);

  files.forEach(async file => {
    const input = dir + '/' + file;
    const arSplitFile = file.split(".");

    console.log(`input: ${input}`);
    console.log(`arSplitFile: ${arSplitFile}`);

    const duration = await getVideoDuration(input).then((duration) => {
      // console.log('Asset duration: ' + duration);
      return duration * 1000;
    });

    console.log(`duration:${duration}`);


    const size = parseInt(duration / frame + 1);
    const offsets = Array.from(Array(size), (_, i) => i * frame);

    console.log('size:' + JSON.stringify(size));
    // console.log(JSON.stringify(offsets));

    // // 이미지 추출
    // await extractFrames({
    //   input,
    //   output: output_dir + arSplitFile[0] + '/' + arSplitFile[0] + '_frame-%i.jpg',
    //   offsets
    // });
  });
  
}


extractor(files, frame, output_dir);


