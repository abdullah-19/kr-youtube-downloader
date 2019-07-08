let fs = require('fs');
// async function f() {

//     try {
//       let response = await fetch('www.google.com');
//       let user = await response.json();
//     } catch(err) {
//       // catches errors both in fetch and response.json
//       alert(err);
//     }
//   }

//   f();
//  fs.readFile('./test.html',(err,data)=>{
//      if(!err) console.log(data);
//      else console.log('eror:'+err);
//  });
// (async () => {
//     let data = await fs.readFile('./test.html');
//     console.log(data);
// })();
async function f(){
    var val = await new Promise(function(resolve){
        setTimeout(() => {
            console.log('done');
            resolve(2);
        }, 2000);
        
    }).catch(function(err){
        console.log(err);
    })
    console.log('after read');
    console.log(val);
    
}

async function f2(){
    await f();
    
}

f2();
