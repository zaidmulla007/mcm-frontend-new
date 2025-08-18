"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";

export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show success message with SweetAlert2
    Swal.fire({
      title: 'Success!',
      text: 'Signup completed successfully!',
      icon: 'success',
      confirmButtonText: 'Continue',
      confirmButtonColor: '#8b5cf6',
      background: '#232042',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/influencers');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#19162b] text-white font-sans flex items-center justify-center px-4">
      <motion.div
        className="bg-[#232042] rounded-2xl p-8 shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Sign Up
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <FaWhatsapp size={20} />
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            Sign Up
          </button>
        </form>
      </motion.div>
    </div>
  );
}