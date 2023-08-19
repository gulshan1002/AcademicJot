const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
dotenv.config({path: './.env'});
const app = require('./app');

const port = process.env.PORT || 3000;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
