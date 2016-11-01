import React from 'react';

import {handleFileSelect} from '../tools/CustomDataExtractor.js';

class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    var callback = function(status, data) {
      if (status === 'error') {
        console.log('Failed to read and parse the provided mxtime report');
        this.props.onFileSelect([]);
      } else {
        this.props.onFileSelect(data);
      }
    }.bind(this);
    handleFileSelect(evt, callback);
  }

  render() {
    var btnStyle = {
      display: 'none'
    }
    return (
      <div className="fileSelector">
        <label className="btn btn-default btn-file">
            Browse <input type="file" id="files" onChange={this.onChange} style={btnStyle}/>
        </label>
      </div>
    );
  }
}

export default FileSelector;