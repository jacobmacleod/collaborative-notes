# Collaborative Notes

source code for [collaborative-notes.com](https://collaborative-notes.com/)

Collaborative Notes:  A note-taking and sharing app for students and coworkers 
Including a simple user interface and focusing on note-taking

## Demo Video

[video on YouTube](https://youtu.be/E5NG4cXcsCI)

## Usage

To connect the editor to other users of the editor, click the Join Room button. Enter the name of the room you want to join to join that room. Room names are not case sensitive. Type in the editor and the editor should update on all instances of [collaborative-notes.com](https://collaborative-notes.com/) with the same room name. 

If there is text in the editor before a room is joined, it will disappear when a room is joined.

Click the Download File button to download an HTML file of the text in the editor.

Click the Transcribe button to start Speech-to-Text. The transcription appears under the line "Speech-to-Text Output". This transcription output is not connected to the editor and does not update for other peers. 

Stop Transcription button stops the transcription service. 

## Credits

- Editor from https://docs.yjs.dev/getting-started/a-collaborative-editor
- Signaling server from [SebTota/y-webrtc-server](https://github.com/SebTota/y-webrtc-server)
- Speech-to-Text from [watson-speech](https://www.npmjs.com/package/watson-speech) example: https://github.com/watson-developer-cloud/speech-javascript-sdk/releases