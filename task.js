
const filesFolder = './test'
const fs = require('fs');
const crypto = require('crypto');

let fileObj={files:[]};

function outPutChunk (chunk, i){
  fs.writeFile(`./folder/chunkHash${i}`, chunk, 'utf8', (err)=>{
    console.log(err);
  })
}

fs.readdir(filesFolder, (err, dir) => {
  let fileArray=fileObj.files;
  let i = 1;

let result =   dir.forEach( (dir) => {
    let path = './test/' + dir;
    let chunksPath =[];

  //create a function generate chunk files < size
  function chunkFiles(path, size){
      return new Promise((resolve, reject)=>{
        let hash = crypto.createHash('sha1', 'fileHash');
        const stream = fs.createReadStream(path, {'bufferSize': size});
        stream.on('error', err=>reject(err));
        stream.on('data', (chunk) => {
          hash.update(chunk);
          //out put chunk to folder
          outPutChunk(chunk, i)
          i++;
          chunksPath.push({chunkPath: path});
        });
        stream.on('end', () => resolve(hash.digest('hex')));

      });
  }

  //turn files in to 1mb chunk files  
  chunkFiles(path, 1024 * 1024).then(()=>{
    fileArray.push({
      filePath:path,
      hash:'fileHash',
      chunks:chunksPath
    });
  }).then(()=>{

  let jsonContent = JSON.stringify(fileObj);//turn to json string

  fs.writeFile('output.json', jsonContent, 'utf8', (err)=>{
  if (err){console.log(err)}

  console.log('json file has created')
  })
  }); 

  });//end of forEach()


});






