## yt-ipfs
Add a wrapper around youtube-dl/yt-dip so that you can preserve and share videos on a decentralized storage system

Example:<br>
```
cd src/
node yt-ipfs https://www.youtube.com/watch?v=EngW7tLk6R8
Downloading Sample Videos / Dummy Videos For Demo Use from https://www.youtube.com/watch?v=EngW7tLk6R8

youtube  EngW7tLk6R8: Downloading webpage
download  Destination: /tmp/Sample Videos _ Dummy Videos For Demo Use-EngW7tLk6R8 - 247+251.f247.webm
download    0.1% of 805.92KiB at  7.10KiB/s ETA 01:53
download    0.4% of 805.92KiB at 21.23KiB/s ETA 00:37
download    0.9% of 805.92KiB at 49.44KiB/s ETA 00:16
download    1.9% of 805.92KiB at 105.67KiB/s ETA 00:07
download    3.8% of 805.92KiB at 76.70KiB/s ETA 00:10
download    7.8% of 805.92KiB at 70.74KiB/s ETA 00:10
download   15.8% of 805.92KiB at 66.66KiB/s ETA 00:10
download   23.6% of 805.92KiB at 65.57KiB/s ETA 00:09
download   31.5% of 805.92KiB at 64.81KiB/s ETA 00:08
download   39.2% of 805.92KiB at 64.45KiB/s ETA 00:07
download   47.1% of 805.92KiB at 64.27KiB/s ETA 00:06
download   54.9% of 805.92KiB at 64.02KiB/s ETA 00:05
download   62.7% of 805.92KiB at 63.89KiB/s ETA 00:04
download   70.5% of 805.92KiB at 63.68KiB/s ETA 00:03
download   78.2% of 805.92KiB at 63.56KiB/s ETA 00:02
download   85.9% of 805.92KiB at 63.36KiB/s ETA 00:01
download   93.6% of 805.92KiB at 63.23KiB/s ETA 00:00
download  100.0% of 805.92KiB at 64.40KiB/s ETA 00:00
download  100% of 805.92KiB in 00:12
download  Destination: /tmp/Sample Videos _ Dummy Videos For Demo Use-EngW7tLk6R8 - 247+251.f251.webm
download    1.0% of 96.14KiB at  7.04KiB/s ETA 00:13
download    3.1% of 96.14KiB at 21.09KiB/s ETA 00:04
download    7.3% of 96.14KiB at 49.15KiB/s ETA 00:01
download   15.6% of 96.14KiB at 105.16KiB/s ETA 00:00
download   32.2% of 96.14KiB at 76.44KiB/s ETA 00:00
download   65.5% of 96.14KiB at 70.61KiB/s ETA 00:00
download  100.0% of 96.14KiB at 68.70KiB/s ETA 00:00
download  100% of 96.14KiB in 00:01
ffmpeg  Merging formats into "/tmp/Sample Videos _ Dummy Videos For Demo Use-EngW7tLk6R8 - 247+251.webm"

-------------------
WEB3STORAGE

uploading files with cid: bafybeigmgk6mq3cl4uog6poo5qz66rbmn3lzvbjllpsrrvjsvhceuydbfq
Uploading... 100.03% complete
All Done

You can share the video with this URL:  https://bafybeigmgk6mq3cl4uog6poo5qz66rbmn3lzvbjllpsrrvjsvhceuydbfq.ipfs.dweb.link/
You can find a local copy here: /tmp/Sample Videos _ Dummy Videos For Demo Use-EngW7tLk6R8 - 247+251.webm
```


help:<br>
```
node yt-ipfs --help
Usage: yt-ipfs [options] URL -- [youtube-dl options]

Options:
  -V, --version                   output the version number
  -r, --remove                    Remove locally downloaded video
  -f, --force                     Process the video even if it's already been uploaded
  -s, --show                      Show list of video in DB
  -d, --dbfile <pathToDBFile>     path to custom Database to store video info (default: "")
  -t, --token <WEB3STORAGETOKEN>  set web3.storage token (default: "")
  -h, --help                      display help for command


  Example:
    $ yt-ipfs https://www.youtube.com/watch?v=EngW7tLk6R8
```
# Setting UP
```
git clone https://github.com/acul71/yt-ipfs
yarn install
```
You have to configure a web3.storage TOKEN<br>
See https://docs.web3.storage/#quickstart for getting one<br>
Then do:<br>
 ```
 yt-ipfs --token=token
 ```

# TODO
- Add an option for a less verbose output
- Make a GUI (with Electron???)


# Problems
- Json DB and conf: Doing a json DB was fun, but what about multiple istances of the program running? Do filelock or use sqlite to avoid corruption