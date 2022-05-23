# Alternative web renderer for Holyrics

**EN** | [UK](README-uk.md)

A tool to more flexibly display Holyrics live on OBS. It queries the slide data in the same way as the original plugin,
and then allows you to create your own layout, animations and work logic in general.

## Usage

Download this repository to a computer running OBS and unzip it to a convenient directory. In OBS, add the "Browser"
source and specify the path to the index.html file. You must also specify the IP address of the Holyrics Plugin server
by adding "`?host=<IP>:<PORT>`" to the address.

The resulting address will look something like
this: "`file://D:/path/to/holyrics-alternative-web-renderer/index.html?host=192.168.1.234:8080`"

> 💡 You may need to play with the projection settings in Holyrics to parse the slide correctly.
