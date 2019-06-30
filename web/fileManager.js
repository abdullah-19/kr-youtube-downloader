function getFileSize(file) {
    //console.log('file to get size:' + file);
    const stats = fs.statSync(file);
    const fileSizeInBytes = stats.size;
    //Convert the file size to megabytes (optional)
    //const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    return fileSizeInBytes;
}