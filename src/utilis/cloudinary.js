const cloudinary = require('cloudinary')
const dotenv = require('dotenv')
dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: '127781639185955',
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  exports.uploads = (file , folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file , (result) => {
            resolve({
                url: result.url ,
                id: result.public_id
            })
        }, {
                resource_type: "auto" ,
                folder:folder
        })
    })
}