import {EditorConfiguration} from 'codemirror';

require('codemirror/mode/javascript/javascript');

export const logOptions: Partial<EditorConfiguration> = {
  theme: 'monokai',
  lineNumbers: true,
  mode: 'javascript',
  viewportMargin: Infinity,
};
