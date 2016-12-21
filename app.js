var express = require('express');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var marklogic = require('marklogic');
var db = marklogic.createDatabaseClient({
    host: '123.59.52.55',
    port: '8000',
    user: 'admin',
    password: 'admin#2016',
});
var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/src'));
app.listen(port);
console.log('started on port' + port);
app.get('/index', function (req, res) {
    res.render('index', {
        title: '数据库查询'
    });
});
//查询
app.post('/index/search', function (req, res) {
    console.log('search...');
    var info = req.body.searchUrl;
    var qb = marklogic.queryBuilder;
    db.documents.query(qb.where(qb.byExample({kind: 'mammal'}))).result(function (documents) {
        console.log('Matches for kind=mammal:');
        documents.forEach(function (document) {
            console.log('\nURI: ' + document.uri);
            console.log('Name: ' + document.content.name);
        });
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
    res.render('index', {
        title: '查询结果'
    });
});
//读取
app.post('/index/read', function (req, res) {
    console.log('search...');
    var info = req.body.searchUrl;
    db.documents.read('/gs/cobra.json').result(function (documents) {
        documents.forEach(function (document) {
            console.log(JSON.stringify(document, null, 2) + '\n');
        });
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
    res.render('index', {
        title: '读取结果'
    });
});
//添加
app.post('/index/insert', function (req, res) {
    console.log('insert...');
    var info = req.body.searchUrl;
    var documents = [{
        uri: '/gs/aardvark.json2',
        content: {name: 'aardvark', kind: 'mammal', desc: 'The aardvark is a medium-sized burrowing, nocturnal mammal.'}
    }, {
        uri: '/gs/bluebird.json2',
        content: {name: 'bluebird', kind: 'bird', desc: 'The bluebird is a medium-sized, mostly insectivorous bird.'}
    }, {
        uri: '/gs/cobra.json2',
        content: {name: 'cobra', kind: 'mammal', desc: 'The cobra is a venomous, hooded snake of the family Elapidae.'}
    }];
    db.documents.write(documents).result(function (response) {
        console.log('Loaded the following documents:');
        response.documents.forEach(function (document) {
            console.log('  ' + document.uri);
        });
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
    res.render('index', {
        title: '添加结果'
    });
});
//修改
app.post('/index/modify', function (req, res) {
    console.log('modify...');
    var info = req.body.searchUrl;
    var pb = marklogic.patchBuilder;

    db.documents.patch('/gs/cobra.json', pb.replace('/kind', 'reptile')).result(function (response) {
        console.log('Patched ' + response.uri);
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
    res.render('index', {
        title: '修改结果'
    });
});
//删除
app.post('/index/delete', function (req, res) {
    console.log('delete...')
    var info = req.body.searchUrl;
    db.documents.removeAll({directory: '/gs/'}).result(function (response) {
        console.log(response);
    })
    res.render('index', {
        title: '删除结果'
    });
});



