const os = require('os')
const fs = require('fs')
// Get the separator from the path module
const { sep } = require('path')

const mkDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}


class Configure {
  constructor() {
    [this.confDirPath, this.confPath] = this.init()
    //console.log(this.confPath, this.dbPath)
    this.load(this.confPath)
    this.conf['DBPATH'] = this.confDirPath + sep + 'videoDB.json'
    this.save()
  }

  load(confPath) {
    try {
      this.conf = JSON.parse(fs.readFileSync(confPath, {encoding:'utf8', flag:'r'}))
    } catch (error) {
      this.conf = {}
      //console.log('Can\'t read configuration file!')
    }
  }

  save() {
    fs.writeFileSync(this.confPath, JSON.stringify(this.conf))
  }

  setWeb3StorageToken(token='') {
    console.log('token=', token)
    this.conf['WEB3STORAGE_TOKEN'] = token
    this.save()
  }

  getWeb3StorageToken() {
    return this.conf['WEB3STORAGE_TOKEN']
  }

  getDBPath() {
    return this.conf['DBPATH']
  }
  
  init() {
    
    let confPath
    let confDirPath
    //let dbDirPath
    
    const platform = process.platform
    switch(platform) {
      case 'linux':
        confDirPath = os.homedir() + sep + '.config' + sep + 'yt-ipfs'
        confPath = confDirPath + sep + 'config.json'
        //dbDirPath = os.homedir() + sep + '.config' + sep + 'yt-ipfs'
        break
      case 'darwin':
        // TODO
        confDirPath = os.homedir() + sep + '.config' + sep + 'yt-ipfs'
        confPath = confDirPath + sep + 'config.json'
        
        break
      case 'win32':
        // TODO
        confDirPath = os.homedir() + sep + '.config' + sep + 'yt-ipfs'
        confPath = confDirPath + sep + 'config.json'
        
        break
      default:
        // TODO
        confDirPath = os.homedir() + sep + '.config' + sep + 'yt-ipfs'
        confPath = confDirPath + sep + 'config.json'
        
        break
    }
    mkDir(confDirPath)
    return [confDirPath, confPath]
  }
}


exports.Configure = Configure


/*
// TEST
const conf = new Configure()

console.log(conf.getDBPath())
if (conf.getWeb3StorageToken() === undefined) conf.setWeb3StorageToken('plutos')
console.log(conf.getWeb3StorageToken())

*/