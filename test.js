//import { get } from "https";

// var stack = [];
// // stack.push(2);       // stack is now [2]
// // stack.push(5);       // stack is now [2, 5]
// // var i = stack.pop(); // stack is now [2]
// // console.log(i);            // displays 5

// var queue = [];
// queue.push(2);         // queue is now [2]
// queue.push(5);         // queue is now [2, 5]
// // var i = queue.shift(); // queue is now [5]
// // console.log(i);     
// console.log(stack.concat(queue));
// var date = new Date();
// var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
// var date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
// console.log(time+" "+date);

//console.log("playlist:"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+ date.getFullYear());
//console.log(new Date().toLocaleString());
// var time = dateFormat(new Date(),"dd-mm-yy h:MM TT");
// console.log(time);
// array = [2,3,5];
// array.splice(1, 1);
// console.log(array);


// var obj = {
//     toLoad:[],
//     toDownload:[]
// }
// obj.toLoad = [1,2];
// obj.toDownload = [3,4];
// console.log(obj.toLoad);

//////////////////////////////////////////////////////////////////////////////////
// const exec = require('child_process').exec;

// function execute(command,callback) {
//     exec(command, (error, stdout, stderr) => {
//         callback(stdout, error);
//     });
// }
// var command = __dirname+"/downloads/youtube-dl --dump-single-json --format=18 --skip-download https://www.youtube.com/channel/UCRxDiLOp7YuY7CrzuIR4TKw";
// execute(command,(std,err)=>{
//     console.log(std);
//     console.log(err);
// });



///////////////////////////////////////////////////////
// var fetchVideoInfo = require('youtube-info');

// function getVideoInfo(id) {
//   fetchVideoInfo(id, function (err, videoInfo) {
//     if (err) throw new Error(err);
//     console.log(videoInfo);
//   });
// }

// getVideoInfo("t_qHCNMfIpo");

////////////////////////////////////////////////////////////////////////////////



// var youtubedl = require('youtube-dl');

// function downloadUsingYDL(url) {
//     var filename;
//     var downloadPath;
//     console.log('downlaod video url:' + url);
  
//     var video = youtubedl(url,
//       ['--format=18'],
//       { cwd: __dirname });
  
//     video.on('info', function (loadedInfo) {
//       info.loadedInfo = loadedInfo;
//         videoInfo = loadedInfo;
//         console.log('thumbnail url:' + loadedInfo.thumbnails[0].url);
//         filename = loadedInfo._filename;
//         loadedInfo.appPath = app.getAppPath();
//         loadedInfo.downloadFilePath = downloadPath;
//         console.log(loadedInfo);
//     });
  
//   }

//   var url = "https://www.youtube.com/watch?v=t_qHCNMfIpo&list=PL_qizAfcpJ-MfBGyKVSt4a2kj_hJQ4yUT&index=7&t=0s";

//   downloadUsingYDL(url);

/////////////////////////////////////////////////////////
// var request = require("request")
// var deasync = require("deasync")

// var getHtml = deasync(function (url, cb) {
//    var userAgent = {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36"}
//    request({
//       url: url, 
//       headers: userAgent
//    },
//    function (err, resp, body) {
//       if (err) { cb(err, null) }
//       cb(null, body)
//    })
// })

// var title = /<title>(.*?)<\/title>/

// var myTitle = getHtml("http://www.yahoo.com").match(title)[1]
// console.log(myTitle)
///////////////////////////////////////////////////////////////////////////////////////

// function asynchReadSomeData(callback) {
//    setInterval(() => {
//        callback("OK");
//    }, 2000);  
// }

// function asynchReadSomeDataPromise() {
//    return new Promise((resolve) => {
//        asynchReadSomeData((result) => resolve(result));
//    });
// }

// async function testAwait() {
//    /* We can use very similar syntax to a synchonous function call here..*/
//    console.log("Calling asynchReadSomeDataPromise, waiting for result...");
//    let result = await asynchReadSomeDataPromise();
//    console.log("Result: ", result);
// }

// testAwait();

////////////////////////////////////////////////////////////////////////////
// const processDataAsycn = async (num) => {  
//    if(typeof num === 'number') {  
//      return 2*num;  
//    } else {  
//      throw new Error('Something went wrong');  
//    }  
//  };  
//  processDataAsycn(21).then((data) => {  
//    console.log('Data from processDataAsycn() with async( When promise gets resolved ): ' + data);  
//  }).catch((error) => {  
//    console.log('Error from processDataAsycn() with async( When promise gets rejected ): ' + error);  
//  });  
////////////////////////////////////////////////////

// const getDataPromise = (num) => new Promise((resolve, reject) => {  
//   setTimeout(() => {  
//     (typeof num === 'number') ? resolve(num * 2) : reject('Input must be an number');  
//   }, 2000);  
// });  
// const processDataAsycn = async () => {  
//   return getDataPromise(22).then((data) => {  
//     return getDataPromise(data);  
//   });  
// };  
// processDataAsycn().then((data) => {  
//   console.log('Data from processDataAsycn() with async( When promise gets resolved ): ' + data);  
// }).catch((error) => {  
//   console.log('Error from processDataAsycn() with async( When promise gets rejected ): ' + error);  
// });  

//////////////////////////////////////////////////////////////
// const exec = require('child_process').exec;

// function execute(command, callback) {
//   exec(command, (error, stdout, stderr) => {
//     callback(stdout, error);
//   });
// }

// var command =__dirname+"/downloads/" +"youtube-dl -j https://www.youtube.com/watch?v=QohH89Eu5iM";
// execute(command,(std,err)=>{
    
//     console.log('std._filename:');
//     console.log(JSON.parse(std)._filename);
//     console.log('err');
//     console.log(err);
// });

////////////////////////////////////////////

// const exec = require('child_process').exec;
// async function getVideoInfo(url){
//   console.log('------------------in getVideoInfo---------------');
//     var command = __dirname + "/downloads/" + "youtube-dl -j "+url;
//     var data= await execute(command);
//     console.log(data);
//     return JSON.parse(data);
// }

// function execute(command) {
//   console.log('------------in fun execute---------------');
//   return new Promise((resolve,reject)=>{
//     exec(command, (error, stdout, stderr) => {
//       if (error) throw new Error(err);
//       resolve(stdout);
//     });
//   })
  
// }

// getVideoInfo('https://www.youtube.com/watch?v=QohH89Eu5iM');
////////////////////////////////////////////////////////////////////

// const youtubedl = require('youtube-dl');
// const log = require('./Logger');

// function getVideoInfo(url) {

//   log.debug('--------------in fun getVideoInfo----------------');
//   return new Promise((resolve, reject) => {
//     youtubedl.getInfo(url, [],{cwd: __dirname, maxBuffer: Infinity}, function (err, info) {
//       if (err) throw err;
//       log.debug('from video info');
//       log.debug('id:', info.id);
//       log.debug('title:', info.title);
//       log.debug('url:', info.url);
//       log.debug('thumbnail:', info.thumbnail);
//       log.debug('filename:', info._filename);
//       log.debug('format id:', info.format_id);
//       resolve(info);
//     });
//   });
// }

// getVideoInfo('https://www.youtube.com/watch?v=JRxRVPQjTIY');
////////////////////////////////////////////////////////////////////////



function f1(a){
  a.a=2;
  console.log(a);
}

function f2(a){
  a.a=3;
  console.log(a);
}
var a = {
  a:1,
  b:2
};
var b = a;
b.a = 100;
//f1({...a});
console.log(a);
console.log(b);