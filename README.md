# Bug with iisnode and electron

when trying to spawn a new electron process in iisnode the process never gets created.

## Run

- edit/remove `nodeProcessCommandLine` in `web.config` to the path of your node executable 
- npm start
- make sure you have iis, iisnode installed and create a web application
- open your browser on http://localhost:YOUR_IIS_PORT_HERE 

## Scenarios tested with this bug

- windows 7
- windows server 2012 R2
