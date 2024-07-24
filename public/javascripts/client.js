import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { QuillBinding } from 'y-quill'
import { SpeechToText } from 'watson-speech'

const notepad = document.querySelector('#notepad');

Quill.register('modules/cursors', QuillCursors);

const quill = new Quill(notepad, {
  modules: {
    cursors: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['code-block'],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }]
    ],
    history: {
      userOnly: true
    }
  },
  placeholder: 'Start collaborating...',
  theme: 'snow' 
});

var binding = null;
var provider = null;
var doc = null;

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

document.querySelector('#collaborate').onclick = function () {

  var roomName = window.prompt("Please enter the room name: ");

  if (roomName != null) {

    roomName = roomName.toLowerCase();
    roomName = roomName.trim();
    if (!provider || roomName !== provider.roomName) {

      if (binding) {
        binding.destroy();
      }
      if (doc) {
        doc.destroy();
      }
      if (provider) {
        provider.disconnect();
      }
      doc = new Y.Doc();
      provider = new WebrtcProvider(roomName, doc, {
        signaling: ['https://collaborative-notes-server.xyz'],
      });

      const yText = doc.getText('quill');

      binding = new QuillBinding(yText, quill);
    }
  }
};