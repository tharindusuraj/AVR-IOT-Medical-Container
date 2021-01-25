export const INDEX = 'INDEX';

/**
 * Used to update objects immutably
 * @param {object} object the original JS object
 * @param {object} updates updates to be made
 */
export const updateObject = (object, updates) => {
    return {
        ...object,
        ...updates
    };
};

/**
 * Used to update an array immutably
 * @param {array} array the original JS array
 * @param {object} item item to be added
 */
export const addItemToArray = (array, item) => {
    let newArray = [...array];
    newArray.push(item)
    return newArray;
}

/**
 * Used to remove item from an array immutably
 * @param {array} array the original JS array
 * @param {string} fieldName name of the field to identify the object from
 * @param {value} value value of the field
 */
export const removeItemFromArray = (array, fieldName, value) => {
    if (fieldName === INDEX) {
        let arr = array.filter((item, index) => {
            return index !== value;
        });

        return arr;
    }
    let newArr = array.filter((item) => {
        return item[fieldName] !== value;
    });

    return newArr;
}

/**
 * Used to replace item from an array immutably
 * @param {array} array the original JS array
 * @param {string} fieldName name of the field to identify the object from
 * @param {value} value item to be assigned
 */
export const replaceItemInArray = (array, fieldName, newItem, index) => {
    if (fieldName === INDEX) {
        let newArray = [...array];
        newArray[index] = newItem;
        return newArray;
    } else {
        return array.map((item) => {
            if (item[fieldName] === newItem[fieldName]) {
                return newItem;
            }
            return item;
        });
    }
}

/**
 * Returns a promise which will resolve after a given number of milliseconds
 * @param {number} milliseconds the original JS array
 */
export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Returns a boolean given an object containing the validity status of each input
 * @param {object} inputIsValid a js object with validity info of a function
 */
export const formIsValid = (inputIsValid) => {
    let isValid = true;
    Object.values(inputIsValid).forEach((value) => {
        isValid = isValid && value;
    });

    return isValid
};

/**
 * Returns a string with the first letter capitalized
 * @param {string} string a string
 */
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * This converts an array to object
 * @param {array} array 
 * @param {string} key 
 */
export const convertArrayToObject = (array, key, property = 'name') => {
    const out = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item[property],
        }
    }, out);
}

/**
 * This method can be used to convert a
 * date in string form into a DateString
 * eg: "client.name"
 * @param {string} dateInString
 */
export const convertStringToDateString = (dateInString) => {
    return new Date(dateInString).toDateString();
}

/**
 * This method can be used to extract a 
 * nested value from an object given a string path
 * eg: "client.name"
 * @param {object} obj 
 * @param {string} path 
 */
export const getNestedValueByPath = (obj, path) => {
    let pathArray = path.split('.');
    let value = { ...obj };
    for (let i = 0; i < pathArray.length; i++) {
        value = value[pathArray[i]]
        if (!value) {
            break;
        }
    }
    return value;
}

/**
 * Navigate to a link given history programmatically
 * @param {string} history
 * @param {string} link
 * @param {Object} data
 */
export const navigateToLink = (history, link, data = {}) => {
    if (data === {}) {
        history.push(link);
    } else {
        history.push(link, data);
    }
}
