const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const ImageKit = require("imagekit");
const User = require("../models/User");


// Initialize ImageKit.io client
const imagekit = new ImageKit({
  publicKey: "public_x9okkBAOC9iYKNGAeLpLyEP5Xgw=",
  privateKey: "private_kf0Kvq1DABlZ4YvtY0yvnjvPGPw=",
  urlEndpoint: "https://ik.imagekit.io/zkzb9rdv8",
});

// Upload image function
async function uploadImage(file) {
  try {
    const response = await imagekit.upload({
      file: file.buffer, // buffer containing image data
      fileName: file.originalname, // original file name
      folder: "/uploads/profiles", // folder in which the file should be uploaded (optional)
    });
    console.log("File uploaded successfully:", response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage });

/* USER REGISTER */
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    /* Take all information from the form */
    const { firstName, lastName, email, password } = req.body;

    /* The uploaded file is available as req.file */
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    /* Upload profile image to ImageKit.io */
    const uploadedImage = await uploadImage(profileImage);

    /* Extract the URL of the uploaded image from the response */
    const profileImagePath = uploadedImage.url;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    /* Save the new User */
    await newUser.save();

    /* Send a successful message */
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
});

/* USER LOGIN*/
router.post("/login", async (req, res) => {
  try {
    /* Take the infomation from the form */
    const { email, password } = req.body

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    /* Compare the password with the hashed password */
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!"})
    }

    /* Generate JWT token */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password

    res.status(200).json({ token, user })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router