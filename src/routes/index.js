const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');
const request = require('request');
const download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

router.get('/', async (req, res) => {
    const photos = await Photo.find();
    res.render('images', { photos });
});
router.get('/images/add', async (req, res) => {
    const photos = await Photo.find();
    res.render('image_form', { photos });
});

router.post('/images/add', async (req, res) => {
    const { title, description } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.l
    const newPhoto = new Photo({
        title,
        description,
        imageURL: result.url,
        public_id: result.public_id
    });
    await fs.unlink(req.file.path);
    await newPhoto.save();
    res.redirect('/');

});

module.exports = router;