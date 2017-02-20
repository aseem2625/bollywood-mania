import React, { PropTypes } from 'react';
import styles from '../styles/main.scss';

const App = ({ children }) =>
    <div className={styles.appContainer}>
        <div className={styles.appHeader}>
            <span className={styles.appHeaderTitle}>Bollywood Mania</span>
        </div>
        { children }
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;
