import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './containers/Home';
import About from './components/About';
import NotFound from './components/NotFound';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Home} />
		<Route path="/home(/**)" component={Home} />
		<Route path="/about" component={About} />
		<Route path="/*" component={NotFound} />
	</Route>
);
