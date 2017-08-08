'use strict';
module.exports = (dataService) => {
    return (req, res) => {
        //const key = req.params.key;
        console.log("ankit" + req.params.key);
        var key = "users_username_ankit";
        var filter = { "username": "ankit" };
        var collection = "users";
        // var data = dataService.getText();
        dataService.getOneRecord(collection, filter, key).then(function(result) {
            //  console.log("Index page result:" + JSON.stringify(result));
            res.json(result);
        }).catch(function(error) {
            console.log("find one error:" + JSON.stringify(error));
            res.send("data for key error: " + error);
        });

    };
};