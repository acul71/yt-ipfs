/*
 1998  youtube-dl https://www.youtube.com/watch?v=EngW7tLk6R8 -o /tmp/pro
 1999  l pro.webm 
 2000  mplayer pro.webm 
 2001  youtube-dl https://www.youtube.com/watch?v=EngW7tLk6R8 --dump-json
 2002  youtube-dl https://www.youtube.com/watch?v=EngW7tLk6R8 --dump-json | jq


*/
const fs = require("fs")
const path = require("path")

// youtube-dl-wrap: A simple node.js wrapper for youtube-dl ( https://github.com/ghjbnm/youtube-dl-wrap )
const YoutubeDlWrap = require("youtube-dl-wrap")

// commander: The complete solution for node.js command-line interfaces. ( https://github.com/tj/commander.js )
const { program } = require('commander')

// set to true for verbose output
let DEBUG = false

//
// Setting up commander
//
program.version('0.0.1')
.usage("[options] -- [youtube-dl options] URL [URL]...")

program
  .option('-n, --number <numbers...>', 'specify numbers')
  .option('-l, --letter [letters...]', 'specify letters')

program.addHelpText('after', `

Example call:
  $ yt-ipfs --help`)

program.showHelpAfterError('(add --help for additional information)')

program.parse()

//
// commander setup end
//

// test
console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);

// Init YoutubeDlWrap
const youtubeDlWrap = new YoutubeDlWrap()

// ytdlGetMetadata get video metadata
const ytdlGetMetadata = async (videoURL = '') => {
  const metadata = await youtubeDlWrap.getVideoInfo(videoURL)
  if (DEBUG) console.log('[ytdlGetMetadata] metadata=', metadata)
  return metadata
}

const getVideoAndUploadtoWeb3Storage = async () => {
  const youtubeDlEventEmitter = youtubeDlWrap.exec([videoURL])
      //"-f", "best", "-o", "output.mp4"])
      //"-f", "best" ])
      
    //.on("progress", (progress) => 
      //console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta,  ))
      //process.stdout.write( [progress.percent + '%', progress.totalSize, progress.currentSpeed, progress.eta, '\r'].join(" ")  )
    .on("youtubeDlEvent", (eventType, eventData) => console.log(eventType, eventData))
    .on("error", (error) => console.error(error))
    .on("close", () => console.log("\nall done"));
  
  
  //console.log(youtubeDlEventEmitter.youtubeDlProcess.pid);
}