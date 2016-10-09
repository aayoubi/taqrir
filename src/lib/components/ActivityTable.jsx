import React from 'react';

import {cutAndSlice} from '../tools/CustomDataExtractor.js';
import FileSelector from './FileSelector.jsx';
import TeamTable from './TeamTable.jsx';
import UserTables from './UserTables.jsx';
import Breakdown from './breakdown/Breakdown.jsx';


export default class ActivityTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPerTeam: [],
            dataPerUser: [],
            breakdowns: {}
        }
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    extractCustomData (data) {
      const slicedData = cutAndSlice(data);
      this.setState({
        dataPerTeam: slicedData.dataPerTeam,
        dataPerUser: slicedData.dataPerUser,
        breakdowns: slicedData.breakdowns
      });
    }

    handleFileSelect(data) {
      this.extractCustomData(data);
    }

    render() {  
      return (
          <div className="mxTimeTable">
              <FileSelector onFileSelect={this.handleFileSelect} />
              <hr/>
              <Breakdown groups={this.state.breakdowns} />
              <TeamTable dataPerTeam={this.state.dataPerTeam} />
              <UserTables dataPerUser={this.state.dataPerUser} />
          </div>
      );
    }
}
