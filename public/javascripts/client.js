import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { QuillBinding } from 'y-quill'
import { SpeechToText } from 'watson-speech'
import DOUsername from 'do_username'

const notepad = document.querySelector('#notepad');

Quill.register('modules/cursors', QuillCursors);

const quill = new Quill(notepad, {
  modules: {
    cursors: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ],
    history: {
      userOnly: true
    }
  },
  placeholder: 'Start collaborating...',
  theme: 'snow' 
});

var doc = new Y.Doc();

const provider = new WebrtcProvider('collaborative-notes-room', doc, {
  signaling: ['https://collaborative-notes-server.xyz']
});

var awareness = provider.awareness;

awareness.on('change', changes => {
  console.log(Array.from(awareness.getStates().values()));
});

var rand = Math.floor(Math.random() * 6);
const color = ['#000000', '#FF0000', '#00FF00',
  '#00FFFF', '#0000FF', '#FF00FF'];

awareness.setLocalStateField('user', {
  name: DOUsername.generate(20),
  color: color[rand]
});
  

var yText = doc.getText('quill');

var binding = new QuillBinding(yText, quill, awareness);


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

      stream.on('error', function(err) {
        console.log(err);
      });

      document.querySelector('#stop').onclick = function() {
        stream.stop();
      }

    }).catch(function(error) {
      console.log(error);
    });
};
