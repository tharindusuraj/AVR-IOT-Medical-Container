import React from 'react';
import FHTextField from '../components/UI/FHTextField/FHTextField';

export const buildTextFields = (inputDefinitions, inputProperties, inputChangeHandler, inputIsValid) => {
    return (
        <React.Fragment>
            {Object.keys(inputDefinitions).map(key => {
                let def = inputDefinitions[key];
                return <FHTextField
                    key={key}
                    fullWidth={def && def.fullWidth}
                    inputChangeHandler={inputChangeHandler ? event => inputChangeHandler(event, key) : null}
                    value={inputProperties && inputProperties[key] && inputProperties[key].value}
                    componentClass={inputProperties && inputProperties[key] && inputProperties[key].styleClass}
                    errStr={def && def.validations && def.validations.validationErrStr}
                    hasErr={!inputIsValid[key]}
                    label={def && def.label}
                    type={def && def.type}
                    propsToPass={def && def.propsToPass}/>
            })}
        </React.Fragment>
    );

}
