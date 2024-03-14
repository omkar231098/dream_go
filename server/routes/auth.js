const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const ImageKit = require('imagekit');
const User = require('../models/User');
const logger = require('../logger/logger'); // Adjust the path accordingly
const { registerValidator, loginValidator, validate } = require("../validators/validators"); 
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
  urlEndpoint: process.env.urlEndpoint,
});

async function uploadImage(file) {
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/uploads/profiles',
    });
    logger.info('File uploaded successfully', { response });
    return response;
  } catch (error) {
    logger.error('Error uploading file', { error });
    throw error;
  }
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register',registerValidator, validate, upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      logger.warn('No file uploaded');
      return res.status(400).send('No file uploaded');
    }

    const uploadedImage = await uploadImage(profileImage);
    const profileImagePath = uploadedImage.url;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn('User already exists', { email });
      return res.status(409).json({ message: 'User already exists!' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    await newUser.save();

    logger.info('User registered successfully', { userId: newUser._id });
    res.status(200).json({ message: 'User registered successfully!', user: newUser });

  } catch (err) {
    logger.error('Registration failed', { error: err.message });
    res.status(500).json({ message: 'Registration failed!', error: err.message });
  }
});

router.post('/login',loginValidator, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Email is not found', { email });
      return res.status(409).json({ message: 'Email is not found, Please Register!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn('Password is incorrect', { email });
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;

    logger.info('Login successful', { userId: user._id });
    res.status(200).json({
      token,
      user,
      message: 'Login successful! Redirecting to Home page.',
    });
  } catch (err) {
    logger.error('Login failed', { error: err.message });
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
