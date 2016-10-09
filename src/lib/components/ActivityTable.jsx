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
            mxTimeDataTotal: [],
            totalManDays: 0,
            drilldownDataPerTeam: {},
            mxTimeDataByUser: [],
            breakdowns: {}
        }
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    extractMxTimeData (data) {
      const slicedData = cutAndSlice(data);

      this.setState({
        mxTimeDataTotal: slicedData.mxTimeDataTotal,
        totalManDays: slicedData.totalManDays,
        drilldownDataPerTeam: slicedData.drilldownDataPerTeam,
        mxTimeDataByUser: slicedData.mxTimeDataByUser,
        breakdowns: slicedData.breakdowns
      });
    }

    handleFileSelect(data) {
      this.extractMxTimeData(data);
    }

    render() {  
      return (
          <div className="mxTimeTable">
              <FileSelector onFileSelect={this.handleFileSelect} />
              <hr/>
              <Breakdown groups={this.state.breakdowns} />
              <TeamTable
                totalManDays={this.state.totalManDays}
                mxTimeDataTotal={this.state.mxTimeDataTotal}
                drilldownDataPerTeam={this.state.drilldownDataPerTeam}
              />
              <UserTables mxTimeDataByUser={this.state.mxTimeDataByUser} />
          </div>
      );
    }
}
