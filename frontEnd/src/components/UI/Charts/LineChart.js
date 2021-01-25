import React, {} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import {
    Chart,
    LineSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';

import {Animation, Legend} from '@devexpress/dx-react-chart';

const useStyles = makeStyles((theme) => ({
    title: {
        whiteSpace: 'pre',
        color: "#f50057",
        fontSize: "x-large"
    },
    xLabel: {
        textAlign: "center",
        transform: "rotate(-90deg)",
        margin: "auto"
    }
}));

const LineChart = (props) => {
    const classes = useStyles();

    const {title, chartData, lineSeriesFields} = props;

    const RootWithTitle = () => {
        return (
            <div className={classes.xLabel}>
                <h4>{props.yLabel !== undefined ? props.yLabel : ""}</h4>
            </div>
        );
    };

    const TitleText = (props) => (
        <Title.Text {...props} className={classes.title}/>
    );
    const labelHalfWidth = 150;
    let lastLabelCoordinate;

    const ArgumentLabel = props => {
        const { x } = props;
        // filter Labels
        if (
            lastLabelCoordinate &&
            lastLabelCoordinate < x &&
            x - lastLabelCoordinate <= labelHalfWidth
        ) {
            return null;
        }
        lastLabelCoordinate = x;
        return <ArgumentAxis.Label {...props} />;
    };
    return (
        <Chart data={chartData}>
            <ArgumentAxis showGrid labelComponent={ArgumentLabel} />
            <ValueAxis>
                {/*max={10}*/}
                showTicks={true}
            </ValueAxis>
                <LineSeries
                valueField={lineSeriesFields.y}
                argumentField={lineSeriesFields.x}
                yAxisInterval={10}
                color="#303aa6"/>
            <Title
                text={title}
                textComponent={TitleText}/>
            <Animation/>
            <Legend position="left" rootComponent={RootWithTitle}/>
        </Chart>
    );
}

export default LineChart;