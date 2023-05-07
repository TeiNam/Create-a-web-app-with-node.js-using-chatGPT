// profileRouter.js
const express = require('express');
const router = express.Router();
const db = require('../modules/pgsqlConnector');
const jwt = require('../modules/jwt');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.get('/', jwt.verify, async (req, res) => {
    const user_id = req.decodedToken.user_id;
    const foundUser = (await db.query('SELECT * FROM user_profile WHERE user_id = $1', [user_id])).rows[0];

    res.render('profile', { user: foundUser });
});

router.post('/update', jwt.verify, upload.single('image_url'), async (req, res) => {
    const user_id = req.decodedToken.user_id;
    const { nickname, introduce } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (imageUrl) {
        await db.query(
            'UPDATE user_profile SET nickname = $1, introduce = $2, image_url = $3 WHERE user_id = $4',
            [nickname, introduce, imageUrl, user_id]
        );
    } else {
        await db.query(
            'UPDATE user_profile SET nickname = $1, introduce = $2 WHERE user_id = $3',
            [nickname, introduce, user_id]
        );
    }

    res.redirect('/profile');
});

router.post('/deleteImage', jwt.verify, async (req, res) => {
    const user_id = req.decodedToken.user_id;

    await db.query('UPDATE user_profile SET image_url = NULL WHERE user_id = $1', [user_id]);

    res.redirect('/profile');
});

module.exports = router;