const express = require('express')
const app = express();
const bodyparser = require('body-parser')

var axios = require('axios');
var qs = require('qs');

// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

var http = require('follow-redirects').http;
var fs = require('fs');

var qs = require('querystring');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/test', (req, res) => {
    res.send({
        "name": "dummy"
    })
})

app.get('/jobs', async (req, main_res) => {
    var options = {
        'method': 'POST',
        'hostname': '34.171.104.245',
        'port': 3030,
        'path': '/jobpostingdataset/query',
        'headers': {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            main_res.render('jobs', { data: JSON.parse(body) });
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = qs.stringify({
        'query': 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER (?Company="Sono Bello")\n}'
    });

    req.write(postData);

    req.end();

})

app.get('/filter', async (req, res) => {
    var options = {
        'method': 'POST',
        'hostname': '34.171.104.245',
        'port': 3030,
        'path': '/jobpostingdataset/query',
        'headers': {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'maxRedirects': 20
    };

    try {
        var api_req = http.request(options, function (api_res) {
            var chunks = [];

            api_res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            api_res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                res.send(body);
            });

            api_res.on("error", function (error) {
                console.error(error);
            });
        });

        let queryString = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n ?jobname a:hasJobTitle ?keyword.\n ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n ';
        let filterString = '';

        if(req.query.company){
            filterString = filterString + `\n FILTER (?Company="${req.query.company}")`;
        }

        if(req.query.jobtitle){
            filterString = filterString + `\n FILTER CONTAINS (?jobTitle,"${req.query.jobtitle}")`;
        }

        if(req.query.jobtype){
            filterString = filterString + `\n FILTER (?jobtype="${req.query.jobtype}")`;
        }

        if(req.query.location){
            filterString = filterString + `\n FILTER CONTAINS (?location,"${req.query.location}")`;
        }

        var postData = qs.stringify({
            'query': `${queryString} ${filterString} }`
        });

        // if (req.query.type == 'company') {
        //     postData = qs.stringify({
        //         'query': `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n ?jobname a:hasJobTitle ?keyword.\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER (?Company="${req.query.payload}")\n}`
        //     });
        // }

        // if(req.query.type == 'job-title'){
        //     postData = qs.stringify({
        //         'query': `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER CONTAINS (?jobTitle="${req.query.payload}")\n}`
        //     });
        // }

        // if(req.query.type == 'job-type'){
        //     postData = qs.stringify({
        //         'query': `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER (?jobtype="${req.query.payload}")\n}`
        //     });
        // }

        // if(req.query.type == 'location'){
        //     postData = qs.stringify({
        //         'query': `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER CONTAINS (?location="${req.query.payload}")\n}`
        //     });
        // }

        api_req.write(postData);

        api_req.end();
    } catch (error) {
        console.log(error)
    }


})

app.get('/dummy', async (req, res) => {
    try {
        const resp = await axios.post("http://34.171.104.245:3030/jobpostingdataset/query", {
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: JSON.stringify({
                'query': 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX a:<http://www.semanticweb.org/bharg/ontologies/2022/10/untitled-ontology-35#>\nSELECT DISTINCT ?jobTitle ?jobtype ?jobapplylink ?JD ?Company ?Companyurl ?location\nWHERE {\n  ?jobname a:hasJobTitle ?jobTitle.\n  ?Companyname a:hasName ?Company.\n  ?Companyname a:hasCompanyURL ?Companyurl.\n  ?jobname a:hasJobURL  ?jobapplylink.\n  ?jobname a:hasJobType ?jobtype.\n  ?jobname a:hasDescription ?JD.\n  ?jobname a:hasLocation ?location.\n   FILTER (?Company="Sono Bello")\n}'
            })
        })
        console.log(resp.data)
        res.send(resp.data);
    } catch (error) {
        console.log(error)
    }

})

app.listen(4000, () => {
    console.log('server started')
})