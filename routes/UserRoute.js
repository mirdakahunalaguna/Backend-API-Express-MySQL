import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadPhoto
} from "../controllers/UserController.js";

const router = express.Router();

// Mendapatkan semua pengguna
router.get('/users', getUsers);

// Mendapatkan pengguna berdasarkan ID
router.get('/users/:id', getUserById);

// Membuat pengguna baru dengan middleware uploadPhoto
router.post('/users', uploadPhoto, createUser);

// Mengupdate pengguna berdasarkan ID
router.patch('/users/:id',uploadPhoto, updateUser);

// Menghapus pengguna berdasarkan ID
router.delete('/users/:id', deleteUser);

export default router;
