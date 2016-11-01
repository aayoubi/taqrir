import React from 'react';

import {cutAndSlice, extractActivities} from '../tools/CustomDataExtractor.js';
import FileSelector from './FileSelector.jsx';
import TeamTable from './TeamTable.jsx';
import UserTables from './UserTables.jsx';
import Breakdown from './breakdown/Breakdown.jsx';

export default class ActivityTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataGlobal: {},
            dataPerUser: [],
            breakdowns: []
        }
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleFileSelect(data) {
      const slicedData = cutAndSlice(data);
      this.setState({
        dataGlobal: slicedData.dataGlobal,
        dataPerUser: slicedData.dataPerUser,
        breakdowns: slicedData.breakdowns
      });
    }

    render() {  
      return (
          <div className="mxTimeTable">
              <FileSelector onFileSelect={this.handleFileSelect} />
              <hr/>
              <Breakdown groups={this.state.breakdowns} />
              <TeamTable dataGlobal={this.state.dataGlobal} groups={this.state.breakdowns} />
              <UserTables dataPerUser={this.state.dataPerUser} groups={this.state.breakdowns} />
          </div>
      );
    }
}
