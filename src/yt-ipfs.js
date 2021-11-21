const fs = require("fs")
const path = require("path")
const os = require("os")
const glob = require("glob");
require('dotenv').config()

const { Web3Storage, getFilesFromPath } = require("web3.storage")

// Configuration
const { Configure } = require('./config')
const conf = new Configure()
//if (DEBUG) console.log('conf DBPath=', conf.getDBPath())
//if (DEBUG) console.log(conf.getWeb3StorageToken())

// set up videoDB that stores downloaded videos
const { videoStore } = require('./videoStore')
const videoDB = new videoStore(conf.getDBPath())

// set to true for debug output
let DEBUG = false

// Get WEB3STORAGE TOKEN
//const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN
//if (DEBUG) console.log('WEB3STORAGE_TOKEN=', WEB3STORAGE_TOKEN)
const WEB3STORAGE_TOKEN = conf.getWeb3StorageToken()
if (DEBUG) console.log('WEB3STORAGE_TOKEN=', WEB3STORAGE_TOKEN)




// youtube-dl-wrap: A simple node.js wrapper for youtube-dl ( https://github.com/ghjbnm/youtube-dl-wrap )
const YoutubeDlWrapOrig = require("youtube-dl-wrap")

class YoutubeDlWrap extends YoutubeDlWrapOrig {
  // Override getVideoInfo removing "-f best" youtube-dl option
  async getVideoInfo(youtubeDlArguments)
    {
        if(typeof youtubeDlArguments == "string")
            youtubeDlArguments = [youtubeDlArguments];
        //if(!youtubeDlArguments.includes("-f") && !youtubeDlArguments.includes("--format"))
        //    youtubeDlArguments = youtubeDlArguments.concat(["-f", "best"]);

        let youtubeDlStdout = await this.execPromise(youtubeDlArguments.concat(["--dump-json"]));
        try{
            return JSON.parse(youtubeDlStdout); 
        }
        catch(e){
            return JSON.parse("[" + youtubeDlStdout.replace(/\n/g, ",").slice(0, -1)  + "]"); 
        }
    }
}

// commander: The complete solution for node.js command-line interfaces. ( https://github.com/tj/commander.js )
const { program } = require('commander')



// Init YoutubeDlWrap
const youtubeDlWrap = new YoutubeDlWrap()



//
// Web3Storage utilities
//
const makeStorageClient = (token) => {
  return new Web3Storage({ token: token })
}

const getFiles = async (path) => {
  const files = await getFilesFromPath(path)
  if (DEBUG) console.log(`read ${files.length} file(s) from ${path}`)
  return files
}

const storeWithProgress = async (files=[], token='') => {  
  // show the root cid as soon as it's ready
  const onRootCidReady = cid => {
    // check if cid already exists?
    // curl -m 2 --max-filesize 1 -s -o /dev/null -w '%{http_code}' https://bafybeigols636clk2frlzc73uptyoxv6ih7bgj4ugou3w6ptivfjejjeve.ipfs.dweb.link/
    // return 200 if it does 400 if not
    console.log('uploading files with cid:', cid)
  }

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
  let uploaded = 0

  const onStoredChunk = size => {
    uploaded += size
    //const pct = totalSize / uploaded
    const pct = uploaded / totalSize * 100
    console.log(`Uploading... ${pct.toFixed(2)}% complete`)
  }

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient(token)
  if (DEBUG) {
    console.log('client=', client)
    console.log('files=', files)
  }
  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk })
}
//
// Web3Storage utilities end
//


// ytdlGetMetadata get video metadata
const ytdlGetMetadata = async (ytdlOptions=[]) => {
  const metadata = await youtubeDlWrap.getVideoInfo(ytdlOptions)
  if (DEBUG) console.log('[ytdlGetMetadata] metadata=', metadata)
  return metadata
}





const uploadtoWeb3Storage = async (videoFilenamePathArr = [], WEB3STORAGE_TOKEN='') => {
  const cid = await storeWithProgress(videoFilenamePathArr, WEB3STORAGE_TOKEN)
  //console.log('All Done\n\nYou can share the video with this URL: ', 'https://' + cid + '.ipfs.dweb.link/')
  return cid
}


const getVideoAndUploadtoWeb3Storage = async (videoFilenamePath = '', ytdlOptions=[], removeFile=false, videoMetadata, videoURL) => {
  let cid
  let web3Url
  const youtubeDlEventEmitter = youtubeDlWrap.exec(ytdlOptions)    
    //.on("progress", (progress) => 
      //console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta,  ))
      //process.stdout.write( [progress.percent + '%', progress.totalSize, progress.currentSpeed, progress.eta, '\r'].join(" ")  )
    .on("youtubeDlEvent", (eventType, eventData) => console.log(eventType, eventData))
    .on("error", (error) => console.error(error))
    .on("close", async () => { 
      // Get local download video filename
      /*
      const videoFilenamePathArr = glob.sync(videoFilenamePath+'.*')
      if (videoFilenamePathArr.length === 0) {
        console.log("Error can't find downloaded videofile!")
        process.exit(1)
      }
      */
      //const videoFilenamePathArr = glob.sync(videoFilenamePath+'.*')
      //const files = await getFiles(videoFilenamePathArr[0])

      console.log('\n-------------------\nWEB3STORAGE\n')
      const files = await getFiles(videoFilenamePath)
      //await uploadtoWeb3Storage(videoFilenamePathArr, WEB3STORAGE_TOKEN)
      cid = await uploadtoWeb3Storage(files, WEB3STORAGE_TOKEN)
      web3Url = 'https://' + cid + '.ipfs.dweb.link/'
      console.log('All Done\n\nYou can share the video with this URL: ', web3Url)
      
      // Update videoDB
      videoDB.write(videoMetadata.id + '|' + videoMetadata.format_id, {
        format_id: videoMetadata.format_id, 
        format: videoMetadata.format,
        ytdlUrl: videoURL, 
        cid: cid, 
        web3Url: web3Url, 
        fulltitle: videoMetadata.title, 
        description: videoMetadata.description, 
        uploader: videoMetadata.uploader
      })

      if (removeFile) {
        // ADD try here!
        fs.unlinkSync(videoFilenamePath)
        console.log(videoFilenamePath + ' removed!')
      } else {
        console.log('You can find a local copy here: ' + videoFilenamePath)
      }
    })
  
  
  //console.log(youtubeDlEventEmitter.youtubeDlProcess.pid);
}


const main = async () => {
  //
  // Setting up commander
  //
  program.version('0.0.1')
  .usage("[options] URL -- [youtube-dl options]")

  program
    .option('-r, --remove', 'Remove locally downloaded video')
    .option('-f, --force', 'Process the video even if it\'s already been uploaded')
    .option('-s, --show', 'Show list of video in DB')
    .option('-d, --dbfile <pathToDBFile>', 'path to custom Database to store video info', '')
    .option('-t, --token <WEB3STORAGETOKEN>', 'set web3.storage token', '')

  program.addHelpText('after', `

  Example:
    $ yt-ipfs https://www.youtube.com/watch?v=EngW7tLk6R8`)

  program.showHelpAfterError('(add --help for additional information)')

  program.parse()
  //
  // commander setup end
  //


  if (DEBUG) {
    console.log('Options: ', program.opts())
    console.log('Remaining arguments: ', program.args)
  }
  const options = program.opts()
  
  // Set custom videoDB
  if (options.dbfile !== '') videoDB.reload(options.dbfile)

  // Show list of videos in DB
  if (options.hasOwnProperty('show')) {
    console.log('List of videos')
    console.log(videoDB.show())
    process.exit(0)
  }

  // web3.storage token set
  if (options.token !== '') {
    conf.setWeb3StorageToken(options.token)
    console.log('Setting token done!')
    process.exit(0)
  }

  if (WEB3STORAGE_TOKEN === undefined || WEB3STORAGE_TOKEN === '') {
    console.log('WARNING: You have to configure a web3.storage TOKEN to be able to upload videos')
    console.log('See https://docs.web3.storage/#quickstart for getting one')
    console.log('Then do: yt-ipfs --token=token\n\n')
  }

  const videoURL = program.args[0]
  //console.log('videoURL=', videoURL)
  /*
  if (videoURL === '') {
    console.log('No URL specified!')
    process.exit(1)
  }
  */

  // Get video metadata
  const videoMetadata = await ytdlGetMetadata(program.args)

  // Get video filename (without ext)
  const videoFilename = videoMetadata._filename.split('.').slice(0, -1).join('.')
  //const videoFilename = videoMetadata._filename
  // Get video format info
  const videoFormat = videoMetadata.format
  // Get video fulltitle
  const videoFulltitle = videoMetadata.fulltitle

  // Check if video is already present in videoDB
  if (!options.hasOwnProperty('force') && videoDB.read(videoMetadata.id + '|' + videoMetadata.format_id) !== undefined) {
    console.log('Video is already in storage! skipping....')
    process.exit(1)
  }

  console.log('Downloading ' + videoFulltitle + ' from ' + videoURL + '\n')
  
  // get temp dir
  const tmpDir = os.tmpdir(); // /tmp
  
  // Get the separator from the path module
  const { sep } = require('path')

  /*
  // Make tmp dir 
  fs.mkdtemp(`${tmpDir}${sep}`, (err, tmpFolder) => {
    if (err) {
      console.log(err)
      process.exit(1)
    } else {
      console.log("The temporary folder path is:", tmpFolder);
  }
  */

  ytdlOptions = [...program.args]
  let videoFilenamePath = tmpDir + sep + videoFilename + ' - ' + videoMetadata.format_id
  videoFilenamePath = videoFilenamePath.substr(0, 180) + '.' + videoMetadata.ext
  
  ytdlOptions.push('-o', videoFilenamePath)

  if (DEBUG) console.log('ytdlOptions=', ytdlOptions)
  

  const remove = options.hasOwnProperty('remove')

  // Download video and Upload to web3storage
  await getVideoAndUploadtoWeb3Storage(videoFilenamePath, ytdlOptions, remove, videoMetadata, videoURL)
  
  
}

main()