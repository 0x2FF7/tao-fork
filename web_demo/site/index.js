import * as wasm from "tao_web_demo";
import {basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {indentUnit} from "@codemirror/language"

var example_filenames = [
    "hello.tao",
    "input.tao",
    "brainfuck.tao",
];

wasm.tao_init();

const initialState = EditorState.create({
  doc: '',
  extensions: [basicSetup, keymap.of([indentWithTab]), indentUnit.of("    ")],
});

const input = new EditorView({
  parent: document.getElementById('editor'),
  state: initialState,
});

var output = document.getElementById("output");

function set_text(s) {
    input.dispatch({
      changes: {from: 0, to: input.state.doc.length, insert: s}
    });
}

function set_example(s) {
    if (s) {
        fetch('examples/' + s)
          .then(res => res.blob())
          .then(blob => {
            var reader = new FileReader();
            reader.onload = function() { set_text(reader.result); }
            reader.readAsText(blob);
        });
    }
}

function compile() {
    output.textContent = "";
    wasm.run(input.state.doc.toString());
}

var run_button = document.getElementById("run_button");
run_button.onclick = compile;

var examples = document.getElementById("examples");
examples.onchange = function() {
    set_example(example_filenames[examples.value]);
};

for (var i = 0; i < example_filenames.length; i ++) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = example_filenames[i];
    examples.appendChild(opt);
}
set_example(example_filenames[0]);
