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
var fetchVideoInfo = require('youtube-info');

function getVideoInfo(id) {
  fetchVideoInfo(id, function (err, videoInfo) {
    if (err) throw new Error(err);
    console.log(videoInfo);
  });
}

getVideoInfo("t_qHCNMfIpo");

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


