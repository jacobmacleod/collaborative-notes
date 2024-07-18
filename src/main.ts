import './style.css'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { QuillBinding } from 'y-quill'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Collaborative Notes</h1>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet">
  
  `
const notepad = document.querySelector('#notepad')
if (!notepad) throw new Error('missing Text area?')

const quill = new Quill(<HTMLElement>notepad, {
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
})

const doc = new Y.Doc()

const provider = new WebrtcProvider('collaborative-notes-room', doc)
const yText = doc.getText('quill')

const binding = new QuillBinding(yText, quill)

/*
var downloadButton = document.getElementById('download');
downloadButton?.addEventListener('click', function() {
    var filename = window.prompt("Please enter the file name: ", "filename.txt");
    var content = (<HTMLInputElement>document?.getElementById("notepad"))?.value;
    var element = document.createElement('a');
    var blob = new Blob([content], {type: 'text/plain'});
    var fileUrl = URL.createObjectURL(blob);
  
    if (filename != null) {

      var isTxt = filename.endsWith(".txt");
      if (!isTxt) {
        filename = filename + ".txt";
      }
      
      element.setAttribute('href', fileUrl);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
});
*/