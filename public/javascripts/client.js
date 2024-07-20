import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Quill from 'quill'
import { QuillBinding } from 'y-quill'
import { SpeechToText } from 'watson-speech'

const notepad = document.querySelector('#notepad');
if (!notepad) throw new Error('missing Text area?');

const quill = new Quill(notepad, {
  modules: {
    cursors: true,
    toolbar: [
      // adding some basic Quill content features
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ],
    history: {
      // Local undo shouldn't undo changes
      // from remote users
      userOnly: true
    }
  },
  placeholder: 'Start collaborating...',
  theme: 'snow' // 'bubble' is also great
});

const doc = new Y.Doc();

const provider = new WebrtcProvider('collaborative-notes-room', doc);
const yText = doc.getText('quill');

const binding = new QuillBinding(yText, quill);


document.querySelector('#download').onclick = function ()  {
    var filename = window.prompt("Please enter the file name: ", "filename.html");
    var content = quill.getSemanticHTML();
    var element = document.createElement('a');
    var blob = new Blob([content], {type: 'text/html'});
    var fileUrl = URL.createObjectURL(blob);
  
    if (filename != null) {

      var isHtml = filename.endsWith(".html");
      if (!isHtml) {
        filename = filename + ".html";
      }
      
      element.setAttribute('href', fileUrl);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
};

document.querySelector('#transcribe').onclick = function () {

  fetch('/api/speech-to-text/token')
    .then(function(response) {
      return response.json();
    }).then(function (token) {

      var stream = SpeechToText.recognizeMicrophone(Object.assign(token, {
        outputElement: '#output' // CSS selector or DOM Element
      }));

      stream.on('data', function(data) {
        if(data.results[0] && data.results[0].final) {
          stream.stop();
          console.log('stop listening.');
        }
      });

      stream.on('error', function(err) {
        console.log(err);
      });

    }).catch(function(error) {
      console.log(error);
    });
};