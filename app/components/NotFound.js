import React, { PropTypes } from 'react';

const NotFound = () =>  (
    <div className="">
        404: I ate this Page.. <br/>
        [..... Plzz Refresh .....]
    </div>
);

NotFound.propTypes = {
    str: PropTypes.string
};

export default NotFound;
