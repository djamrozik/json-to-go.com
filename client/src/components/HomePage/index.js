import React, { useState } from 'react';

import AceEditor from "react-ace";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-monokai";

import { fetchConvertedJson, isJsonString } from './helpers';
import './index.css';

const starterStruct = `type Generated struct {
    Info string \`json:"info"\`
}`

const starterJson = `{
  "info": "Add JSON here"
}`;

function HomePage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [golangStruct, setGolangStruct] = useState(starterStruct);
  const [isRequestError, setIsRequestError] = useState(false);
  const [jsonText, setJsonText] = useState(starterJson);

  const onJsonChange = newJson => {
    setJsonText(newJson);

    if (!isJsonString(newJson)) {
      return;
    }

    fetchConvertedJson(newJson, (golangStruct, errMessage) => {
      if (errMessage) {
        setErrorMessage(errMessage);
        setGolangStruct('');
        setIsRequestError(true);
        return;
      }
      setErrorMessage('');
      setIsRequestError(false);
      setGolangStruct(golangStruct);
    });
  }

  const isJsonValid = isJsonString(jsonText);

  const jsonValidInfoStyle = {
    'color': isJsonValid ? 'green' : 'red'
  }

  const editorStyle = {
    'width': '100%',
    'height': '100%'
  }

  const requestErrorStyle = {
    'color': 'red'
  }

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div className="header-cell">
          <div className="header-cell-left">
            JSON
          </div>
          <div className="header-cell-right" style={jsonValidInfoStyle}>
            {
              isJsonValid
                ? <span>JSON is Valid&nbsp;&#10004;</span>
                : <span>JSON is Not Valid</span>
            }
          </div>
        </div>
        <div className="header-cell">
          <div className="header-cell-left">
            Generated Golang Struct
          </div>
          <div className="header-cell-right" style={requestErrorStyle}>
            { isRequestError && 'Request Error' }
          </div>
        </div>
      </div>
      <div className="home-page-content">
        <div className="home-page-content-cell">
          <AceEditor
            mode="json"
            theme="monokai"
            onChange={onJsonChange}
            value={jsonText}
            name="json-editor"
            style={editorStyle}
            fontSize={14}
            showPrintMargin={false}
            debounceChangePeriod={100}
          />
        </div>
        <div className="home-page-content-cell">
          <SyntaxHighlighter language={"go"} style={dark} className="resulting-struct">
            { isRequestError ? errorMessage : golangStruct }
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

export default HomePage