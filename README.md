# Collaborative Notes

Collaborative Notes:  A note-taking and sharing app for students and coworkers 
Including a simple user interface and focusing on note-taking

## Demo Video

[video on YouTube](https://youtu.be/ZZDZGxQCdqk)

## Usage

To connect the editor to other users of the editor, click the Join Room button. Enter the name of the room you want to join to join that room. Room names are not case sensitive. Type in the editor and the editor should update on all instances of [collaborative-notes.com](https://collaborative-notes.com/) with the same room name. 

If there is text in the editor before a room is joined, it will disappear when a room is joined.

Click the Download File button to download an HTML file of the text in the editor.

Click the Transcribe button to start Speech-to-Text. The transcription appears under the line "Speech-to-Text Output".

Stop Transcription button stops the transcription service. When the transcription is stopped, the results of the transcription will appear in the editor and update the editor for other users.

## Setup

### Building a Website

#### Prerequisites

- To set this up on a website, you must have a y-webrtc server to connect to. I set up a server using [SebTota/y-webrtc-server](https://github.com/SebTota/y-webrtc-server) 
- This also requires IBM Watson Speech to Text service credentials: https://www.ibm.com/products/speech-to-text
- This may also require a TURN server to work. I used a TURN server from [metered.ca](. https://www.metered.ca/stun-turn)
- Node.js
- This code: `git clone https://github.com/jacobmacleod/collaborative-notes.git`

#### Setup

Once you have those, setting this up on the web requires changing some of the code. In `public/javascripts/client.js`, change

    'https://name-of-signaling-server'

in the line

    signaling: ['https://name-of-signaling-server']

to the location of your y-webrtc server. 

Before the functions in `public/javascripts/client.js`, create an RTCPeerConnection using the TURN server configuration. Change

    provider = new WebrtcProvider(roomName, doc, {
        signaling: ['name of your signaling server'],
      });

to

    provider = new WebrtcProvider(roomName, doc, {
        signaling: ['name of your signaling server'],
        peerOpts: {
            your RTCPeerConnection
        }
      });

Based on `.env.example`, create `.env` with IBM Watson Speech to Text credentials

In `bin/www`, change the arguments of readFileSync in

    const options = {
        key: fs.readFileSync(`${certDir}/${domain}/privkey.pem`),
        cert: fs.readFileSync(`${certDir}/${domain}/fullchain.pem`)
    };

to point to your tls private key and certification.

Set up your web server's configuration for the website to pass requests to `https://127.0.0.1:3001`

Then, to set this up on the website, in the `collaborative-notes` directory, at the command line, type the following commands:

    npm install
    ./node_modules/bin/webpack
    npm start

## Credits

- Editor from https://docs.yjs.dev/getting-started/a-collaborative-editor
- Signaling server from [SebTota/y-webrtc-server](https://github.com/SebTota/y-webrtc-server)
- Speech-to-Text from [watson-speech](https://www.npmjs.com/package/watson-speech) example: https://github.com/watson-developer-cloud/speech-javascript-sdk/releases