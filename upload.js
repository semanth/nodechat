/**
 * Created with JetBrains WebStorm.
 * User: Alex
 * Date: 3/12/13
 * Time: 11:45 PM
 * To change this template use File | Settings | File Templates.
 */
var app = require('express')()
    , fs= require('fs')(app);

app.post('/uploads', function (req, res) {
    console.log("In upload");
    fs.readFile(req.files, function (err, data) {
        if(err){
            console.log(err);
        }
        var newPath = __dirname + "/uploads";
        fs.rename(newPath, data, function (err) {
            res.redirect("back");
        });
    });
});

