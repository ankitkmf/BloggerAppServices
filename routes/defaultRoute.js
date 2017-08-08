'use strict';
module.exports = () => {
    console.log("default route")
    return (req, res) => {
        //console.log("In default route")
        res.send("This is default route.");
    };
};