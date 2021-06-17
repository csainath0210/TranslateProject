// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\csain\Desktop\Cloud\GCP\translatetest-294912-9a624a205f45.json"

// don't forget to gcloud config set project my-project
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require("body-parser");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/views'));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "root",
    port     : "3306",
    database : "practice"
  });


const {Translate} = require('@google-cloud/translate').v2;

//Configuration for the client
const projectId='testtranslate2';
const keyFilename = 'TranslateAPI/testtranslate2-525a462a4436.json';
const translate = new Translate({projectId, keyFilename});

app.post('/', function (req, res1) {
    var option=req.param('option',null);
    var inText=req.param('input', null);
    var lang=req.param('lang', null);
    var save=req.param('option2',null);
    console.log(inText.toString());

    if(option == 1){
        const detectLanguage = async (text) => {

            try {
                let response = await translate.detect(text);
                return response[0].language;
            } catch (error) {
                console.log(`Error at detectLanguage --> ${error}`);
                return 0;
            }
            }
            detectLanguage(inText)
                .then((res) => {
                    console.log(res);
                    async function listLanguages(text) {
                        // Lists available translation language with their names in English (the default).
                        const [languages] = await translate.getLanguages();
                        
                        var len=languages.length;
                        for(var i=0;i<len;i++){
                          if(languages[i].code == text){
                            console.log(languages[i].name);
                            res1.render("translate", { inText: inText, outText: 'The language is: '+languages[i].name});
                            res1.end();
                            break;
                          }
                        }
                      }
                      
                    listLanguages(res);
                })
                .catch((err) => {
                    console.log(err);
                });
    }
    
    else if(option == 2){
        if(lang.toString() != ''){
            console.log('here');
            async function listLanguages(text,text2) {
                // Lists available translation language with their names in English (the default).
                const [languages] = await translate.getLanguages();
                
                var len=languages.length;
                for(var i=0;i<len;i++){
                  if(languages[i].name==text){
                    console.log(languages[i].code);
                    const translateText = async (text, targetLanguage) => {

                        try {
                            let [response] = await translate.translate(text, targetLanguage);
                            return response;
                        } catch (error) {
                            console.log(`Error at translateText --> ${error}`);
                            return 0;
                        }
                    };

                    translateText(text2, languages[i].code.toString())
                        .then((res) => {
                            console.log(res);
                            res1.render("translate", { inText: text2, outText: 'Translation: '+res});
                            res1.end();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    break;
                  }
                }
              }
            listLanguages(lang.toString(), inText);
        }

        else{
            const translateText = async (text, targetLanguage) => {
    
                try {
                    let [response] = await translate.translate(text, targetLanguage);
                    return response;
                } catch (error) {
                    console.log(`Error at translateText --> ${error}`);
                    return 0;
                }
                };
        
            translateText(inText, 'en')
                .then((res) => {
                    console.log(res);
                    res1.render("translate", { inText: inText, outText: 'Translation: '+res});
                    res1.end();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        
    }
});

// const detectLanguage = async (text) => {

//     try {
//         let response = await translate.detect(text);
//         return response[0].language;
//     } catch (error) {
//         console.log(`Error at detectLanguage --> ${error}`);
//         return 0;
//     }
// }

// detectLanguage('Bonjour mon ami')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(error);
//     });

// const translateText = async (text, targetLanguage) => {

//     try {
//         let [response] = await translate.translate(text, targetLanguage);
//         return response;
//     } catch (error) {
//         console.log(`Error at translateText --> ${error}`);
//         return 0;
//     }
// };

// translateText('Je suis tres desole, mais je ne suis pas un homme de France', 'en')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

app.listen(8080);
console.log("server listening in http://localhost:8080");