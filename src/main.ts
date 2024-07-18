import './style.css'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { TextAreaBinding } from 'y-textarea'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Collaborative Notes</h1>
  <textarea id="notepad"></textarea>
  <button id="download">Download file</button>
`

const doc = new Y.Doc()
const wsProvider = new WebsocketProvider(
  `ws://${window.location.hostname}:1234`,
  'my-roomname',
  doc
)

wsProvider.on('status', (event: any) => {
  console.log(event.status) // logs "connected" or "disconnected"
})

const textArea = document.querySelector<HTMLTextAreaElement>('#notepad')
if (!textArea) throw new Error('missing Text area?')

const yText = doc.getText('notepad')

//@ts-ignore
let areaBinding = new TextAreaBinding(yText, textArea, {
  awareness: wsProvider.awareness,
})

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