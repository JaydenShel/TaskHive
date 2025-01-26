const fs = require("fs")
const S3rver = require("s3rver")

//Create local s3rver with a single bucket for profile images
new S3rver({
    port: 5000,
    directory: './s3',
    configureBuckets: [
        {
            name: 'profile-images',
        }
    ]

}).run((err) => {
    if(err){
        console.log("Issues starting S3rver:", err);
    }
    else{
        console.log("Starting s3rver at port 5000.")
    }
})