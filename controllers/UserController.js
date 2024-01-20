import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from "../models/UserModel.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    // Update each user's photo field to include the full URL
    const usersWithPhotoUrl = response.map(user => {
      return {
        ...user.toJSON(),
        photo: user.photo ? `http://localhost:5000/uploads/${user.photo}` : 'http://localhost:5000/uploads/default_img.jpeg',
      };
    });
    res.status(200).json(usersWithPhotoUrl);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id }
    });

    if (!response) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, gender } = req.body;
    const photo = req.file ? req.file.filename : null;

    console.log('Received request to create user with email:', email);

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // If the email already exists, respond with a 400 status and a message
      console.error('Error Creating User: Email already exists');
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // If the email does not exist, create the new user
    const newUser = await User.create({ name, email, gender, photo });
    
    console.log('User Created Successfully:', newUser);
    res.status(201).json({ msg: 'User Created', user: newUser });
  } catch (error) {
    console.error('Error Creating User:', error.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};




// Pada middleware upload.single('photo')
export const uploadPhoto = (req, res, next) => {
  console.log('Middleware uploadPhoto');
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Error uploading photo:', err.message);
      return res.status(500).json({ msg: 'Error uploading photo' });
    }
    next();
  });
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, gender } = req.body;
    const photo = req.file ? req.file.filename : null;

    const updateObject = { name, email, gender };

    if (photo) {
      updateObject.photo = req.file.filename;
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.update(updateObject);

    res.status(200).json({ msg: 'User Updated', updatedUser: user });
  } catch (error) {
    console.error('Error updating user:', error.message);

    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ msg: 'Validation error', errors: error.errors });
    }

    res.status(500).json({ msg: 'Internal Server Error' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });

    if (result === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'User Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
