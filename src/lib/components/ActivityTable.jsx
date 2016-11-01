import React from 'react';

import FileSelector from './FileSelector.jsx';
import TeamTable from './TeamTable.jsx';
import UserTables from './UserTables.jsx';
import Breakdown from './breakdown/Breakdown.jsx';
import {retrieveInitialBreakdowns, retrieveDataPerUser} from '../tools/CustomDataExtractor.js';

export default class ActivityTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataGlobal: {},
            dataPerUser: [],
            breakdowns: []
        }
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onBreakdownChange = this.onBreakdownChange.bind(this);
    }

    onFileSelect(data) {
      const breakdowns = retrieveInitialBreakdowns(data);
      const dataPerUser = retrieveDataPerUser(data);
      this.setState({
        dataGlobal: data,
        dataPerUser: dataPerUser,
        breakdowns: breakdowns
      });
    }

    onBreakdownChange(groups) {
      const currentState = this.state ;
      currentState.breakdowns = groups;
      this.setState(currentState);
    }

    render() {  
      return (
          <div className="mxTimeTable">
              <FileSelector onFileSelect={this.onFileSelect} />
              <hr/>
              <Breakdown groups={this.state.breakdowns} onBreakdownChange={this.onBreakdownChange}/>
              <TeamTable dataGlobal={this.state.dataGlobal} groups={this.state.breakdowns} />
              <UserTables dataPerUser={this.state.dataPerUser} groups={this.state.breakdowns} />
          </div>
      );
    }
}
