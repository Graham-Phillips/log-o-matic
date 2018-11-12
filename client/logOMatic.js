/*
    Graham Phillips

    logOMatic. Proxy your Javascript objects in order to log function calls and property accesses.

    The motivation is primarily to help tackle legacy code. By storing function calls and property gets/sets in a database, we can analyse the calls at a later time which could be more convenient and give a greater range of data than for example examining the callstack in devtools. It may be possible to generate naive unit tests based on the data stored. This could provide developers tackling legacy code with a headstart when it comes to adding test support to a legacy app.
    
    Assumes your app has been written in a standard object oriented style with JS psuedo-classes, and with named functions as object methods. YMMV with other scenarios.

    usage: logOMatic(new YourClassName());

    logs: 
    For property access:
    ParentObject  Accessor (get/set)  Property    Value
    
    For function calls:
    ParentObject    FunctionName    Args    ReturnValue

    
*/
const axios = require('axios');

export default function logOMatic(obj) {
    let logMessage = {};
	const handler = {
		get(target, propKey, receiver) {
			const targetValue = Reflect.get(target, propKey, receiver);
			if (typeof targetValue === 'function') {
				const t = target;
				return function (...args) {
					let result = targetValue.apply(this, args);
					console.log('object: ' + t.constructor.name);
					console.log('function: ' + propKey);
					//console.log('args: ' + JSON.stringify(args));
                   // console.log('return: ' + JSON.stringify(result));
                    logMessage.parentObject = t.constructor.name;
                    logMessage.functionName = propKey;
                    logMessage.args = JSON.stringify(args); // todo stringify circular error
                    logMessage.returnValue = JSON.stringify(result);
                    writeData(logMessage);
					return result;
				}
			} else {
				if(target !== undefined) {
					console.log('object: '+ target.constructor.name);
                    logMessage.parentObject = target.constructor.name;
				}
				console.log('get:', propKey);
				console.log('value:', targetValue);
                logMessage.accessor = "get";
                logMessage.property = propKey;
                logMessage.propertyValue = targetValue;
                writeData(logMessage);
				return targetValue;
			}
		},
		set(target, propKey, value, receiver) {
			if(target !== undefined) {
				console.log('object: '+ target.constructor.name);
                logMessage.parentObject = target.constructor.name;
			}
			console.log('set:', propKey);
			console.log('value:', value);
            logMessage.accessor = "set";
            logMessage.property = propKey;
            logMessage.propertyValue = targetValue;
            writeData(logMessage);
			return Reflect.set(target, propKey, value, receiver);
		}
	};
	return new Proxy(obj, handler);
}

const writeData = (data) => {

    axios.post('http://localhost:8100/add',
        data)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}
