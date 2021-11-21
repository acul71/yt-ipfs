const fs = require('fs')

class videoStore {
  constructor(DBPath='') { 
   this.reload(DBPath)
  }

  reload(DBPath) {
    try {
      //console.log("[videoStore] DBPath=", DBPath)
      this.DBPath = DBPath
      this.videoDB = JSON.parse(fs.readFileSync(DBPath, {encoding:'utf8', flag:'r'}))
    } catch (error) {
      this.videoDB = {}
    }
  }

  save() {
    fs.writeFileSync(this.DBPath, JSON.stringify(this.videoDB))
  }

  write (id, f)  {
    this.videoDB[id] = f
    this.save()
  }

  read (id) {
    return this.videoDB[id]
  }

  show () {
    return this.videoDB
  }
}

exports.videoStore = videoStore


/*
// Test
const videoDB = new videoStore()

videoDB.write('1|123+124', {format_id: '123+124', format: '123 (mp4 video) + 124 (mp4 audio)', ytdlUrl: 'https:///some.url', cid: 'bafybeibowcmpgn2hh5stqbkaytkll2xuc4yyguez4afmhrwytazfnhpzkq', web3Url: 'https://bafybeibowcmpgn2hh5stqbkaytkll2xuc4yyguez4afmhrwytazfnhpzkq.ipfs.dweb.link/', fulltitle: 'title', description: 'description', uploader: 'monk'})
videoDB.write('2|123+124', {format_id: '123+124', format: '123 (mp4 video) + 124 (mp4 audio)', ytdlUrl: 'https:///some.url', cid: 'bafybeibowcmpgn2hh5stqbkaytkll2xuc4yyguez4afmhrwytazfnhpzkq', web3Url: 'https://bafybeibowcmpgn2hh5stqbkaytkll2xuc4yyguez4afmhrwytazfnhpzkq.ipfs.dweb.link/', fulltitle: 'title', description: 'description', uploader: 'monk'})
const videoInfo = videoDB.read('1|123+124')
console.log('videoInfo=', videoInfo)
*/

