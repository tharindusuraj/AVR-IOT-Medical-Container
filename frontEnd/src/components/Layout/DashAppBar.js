import React from 'react';

import AppBar from '@material-ui/core/AppBar';

const DashAppBar = (props) => {

    return (
        <AppBar
            position="fixed" >
            {props.children}
        </AppBar>
    );
};

export default DashAppBar;