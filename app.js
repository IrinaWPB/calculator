const ExpressError = require('./expressError');
const express = require('express');
const app = express();

app.get('/:operation', function(req, res, next) {
    try {
        let value;
        if (!req.query.nums) throw new ExpressError(`Numbers are required`, 400);
        let nums = req.query.nums.split(',');
        for (let x of nums) {
            if (isNaN(x)) throw new ExpressError(`'${x}' is not a number`, 400);
        }

        if (req.params.operation == 'mean') {
            let total = 0;
            for (let x of nums) {
                total += parseInt(x);
            }
            value = parseInt(total/nums.length);
            
        } else if (req.params.operation == 'median') {
            nums.sort(function(a, b) {
                return parseInt(a) - parseInt(b);
            });
            let median = parseInt(nums.length/2);
            value = nums[median];

        } else if (req.params.operation == 'mode') {
            let obj = {};
            for (let x of nums) {
                if (obj[x]) {
                    obj[x]++;
                } else {
                    obj[x] = 1;
                }
            }
            value = Object.keys(obj).reduce((a,b) => obj[a] > obj[b] ? a : b);
            
        } else {
            let err = new ExpressError('Wrong operation', 404);
            next(err);
        }
        return res.json({response : {
            operation: req.params.operation,
            value: value
        }});
    } catch(err) {
        return next(err);
    } 

});

app.use((e, req, res, next) => {
    let status = e.status;
    let msg = e.msg;
    return res.json({
        error: {msg, status}
    });
});

app.listen(3000, function() {
    console.log('App on port 3000');
});