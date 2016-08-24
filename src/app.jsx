import React from 'react';
import {render} from 'react-dom';

import ActivityTable from './lib/components/ActivityTable.jsx'

class App extends React.Component {
	render() {
		return ( <div> <ActivityTable/> </div> );
	}
}

render(<App />, document.getElementById('app'));