import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import About from './components/About';
import NotFound from './components/NotFound';

export default (
	<Route path="/" component={App}>
		<IndexRedirect to="/home" />
		<Route path="/home" component={Home} />
		<Route path="/about" component={About} />
		<Route path="/*" component={NotFound} />
	</Route>
);
