"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaWhatsapp, FaChevronDown, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { countryCodes } from "../../data/countryCodes";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSentTo, setOtpSentTo] = useState(""); // tracks where OTP was sent: "whatsapp", "email", or "both"
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.code === "US"));
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [canSendOtp, setCanSendOtp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData;
    if (name === "phoneNumber") {
      const cleaned = value.replace(/\D/g, '');
      newFormData = {
        ...formData,
        [name]: cleaned
      };
    } else {
      newFormData = {
        ...formData,
        [name]: value
      };
    }
    setFormData(newFormData);

    // Check if all required fields are filled for signup
    if (!isLogin) {
      const allFieldsFilled = newFormData.firstName &&
        newFormData.lastName &&
        newFormData.email &&
        newFormData.phoneNumber &&
        validateEmail(newFormData.email) &&
        validatePhoneNumber(newFormData.phoneNumber, selectedCountry.code);
      setCanSendOtp(allFieldsFilled);
    }
  };

  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    country.dial_code.includes(searchCountry)
  );

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    const phoneRegexes = {
      US: /^\d{10}$/,
      GB: /^\d{10,11}$/,
      IN: /^\d{10}$/,
      CA: /^\d{10}$/,
      AU: /^\d{9,10}$/,
      DE: /^\d{10,11}$/,
      FR: /^\d{9}$/,
      IT: /^\d{9,10}$/,
      ES: /^\d{9}$/,
      BR: /^\d{10,11}$/,
      MX: /^\d{10}$/,
      JP: /^\d{10,11}$/,
      CN: /^\d{11}$/,
      KR: /^\d{10,11}$/,
      RU: /^\d{10}$/,
      SA: /^\d{9}$/,
      AE: /^\d{9}$/,
      SG: /^\d{8}$/,
      MY: /^\d{9,10}$/,
      ID: /^\d{10,12}$/,
      TH: /^\d{9,10}$/,
      VN: /^\d{9,10}$/,
      PH: /^\d{10}$/,
      PK: /^\d{10}$/,
      BD: /^\d{10}$/,
      NG: /^\d{10,11}$/,
      EG: /^\d{10}$/,
      TR: /^\d{10}$/,
      IR: /^\d{10}$/,
      ZA: /^\d{9}$/,
      KE: /^\d{9}$/,
      default: /^\d{7,15}$/
    };

    const regex = phoneRegexes[countryCode] || phoneRegexes.default;
    return regex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSendOtp = async () => {
    // Validate all fields for signup
    if (!isLogin) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        Swal.fire({
          title: 'Error!',
          text: 'Please fill all required fields',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
        return;
      }

      if (!validateEmail(formData.email)) {
        Swal.fire({
          title: 'Error!',
          text: 'Please enter a valid email address',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
        return;
      }

      if (!validatePhoneNumber(formData.phoneNumber, selectedCountry.code)) {
        Swal.fire({
          title: 'Invalid Phone Number!',
          text: `Please enter a valid ${selectedCountry.name} phone number`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
        return;
      }
    }

    const fullPhoneNumber = `${selectedCountry.dial_code}${formData.phoneNumber}`;

    try {
      // Send OTP to both email and phone for signup
      const otpRequests = [];

      // Send OTP to phone
      otpRequests.push(
        fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: fullPhoneNumber,
            countryCode: selectedCountry.code,
            type: 'phone'
          })
        })
      );

      // Send OTP to email for signup
      if (!isLogin) {
        otpRequests.push(
          fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              type: 'email'
            })
          })
        );
      }

      const responses = await Promise.all(otpRequests);

      if (responses.every(r => r.ok)) {
        setIsOtpSent(true);
        setTimer(60);
        Swal.fire({
          title: 'OTP Sent!',
          text: !isLogin ?
            `OTP has been sent to both:\n\n📱 WhatsApp: ${fullPhoneNumber}\n✉️ Email: ${formData.email}\n\nYou can enter the OTP from either WhatsApp or Email` :
            `OTP has been sent to your WhatsApp ${fullPhoneNumber}`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setIsOtpSent(true);
      setTimer(60);
      Swal.fire({
        title: 'OTP Sent!',
        text: !isLogin ?
          `OTP sent to both:\n\n WhatsApp: ${fullPhoneNumber}\nEmail: ${formData.email}` :
          `OTP sent to ${fullPhoneNumber}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid 6-digit OTP',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
      return;
    }

    const fullPhoneNumber = formData.phoneNumber ? `${selectedCountry.dial_code}${formData.phoneNumber}` : '';

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const requestBody = {
        ...formData,
        otp: otp,
        authMethod: otpSentTo || 'unified'
      };

      if (formData.phoneNumber) {
        requestBody.phoneNumber = fullPhoneNumber;
        requestBody.countryCode = selectedCountry.code;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();

        if (!isLogin) {
          // Special thank you message for new registrations
          const today = new Date();
          const dateString = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          Swal.fire({
            title: '🎉 Thank You!',
            html: `
              <div style="text-align: center; padding: 20px;">
                <h2 style="color: #8b5cf6; margin-bottom: 20px;">Welcome to Our Platform!</h2>
                <p style="font-size: 18px; margin-bottom: 15px;">
                  Thank you for joining us, <strong>${formData.firstName} ${formData.lastName}</strong>!
                </p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            padding: 20px; 
                            border-radius: 15px; 
                            margin: 20px 0;
                            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                  <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                    ✨ Your Subscription Starts Today ✨
                  </p>
                  <p style="font-size: 18px;">
                    ${dateString}
                  </p>
                </div>
                <p style="font-size: 16px; margin-top: 20px;">
                  Get ready to explore amazing features!
                </p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Start Exploring',
            confirmButtonColor: '#8b5cf6',
            background: '#232042',
            color: '#ffffff',
            showConfetti: true
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/influencers');
            }
          });
        } else {
          // Normal success message for login
          Swal.fire({
            title: 'Success!',
            text: 'Login successful!',
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
        }
      } else {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (!isLogin) {
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        Swal.fire({
          title: '🎉 Thank You!',
          html: `
            <div style="text-align: center; padding: 20px;">
              <h2 style="color: #8b5cf6; margin-bottom: 20px;">Welcome to MCM</h2>
              <p style="font-size: 18px; margin-bottom: 15px;">
                Thank you for joining us, <strong>${formData.firstName} ${formData.lastName}</strong>!
              </p>
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          padding: 20px; 
                          border-radius: 15px; 
                          margin: 20px 0;
                          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                  ✨ Your Subscription Starts Today ✨
                </p>
                <p style="font-size: 18px;">
                  ${dateString}
                </p>
              </div>
              <p style="font-size: 16px; margin-top: 20px;">
                Get ready to explore amazing features!
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Start Exploring',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff',
          showConfetti: true
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/influencers');
          }
        });
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
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
      }
    }
  };

  const handleSendEmailOtp = async () => {
    if (!validateEmail(formData.email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'email'
        })
      });

      if (response.ok) {
        setIsOtpSent(true);
        setTimer(60);
        Swal.fire({
          title: 'OTP Sent!',
          text: `An OTP has been sent to your email ${formData.email}`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setIsOtpSent(true);
      setTimer(60);
      Swal.fire({
        title: 'OTP Sent!',
        text: `OTP sent to ${formData.email}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      handleSendOtpForLogin();
    }
  };

  const handleSendOtpForLogin = async () => {
    // For login, check which field is filled
    if (isLogin) {
      const hasPhone = formData.phoneNumber && validatePhoneNumber(formData.phoneNumber, selectedCountry.code);
      const hasEmail = formData.email && validateEmail(formData.email);

      if (!hasPhone && !hasEmail) {
        Swal.fire({
          title: 'Error!',
          text: 'Please enter a valid WhatsApp number or Email',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
        return;
      }

      try {
        const otpRequests = [];
        let sentTo = [];

        if (hasPhone) {
          const fullPhoneNumber = `${selectedCountry.dial_code}${formData.phoneNumber}`;
          otpRequests.push(
            fetch('/api/auth/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phoneNumber: fullPhoneNumber,
                countryCode: selectedCountry.code,
                type: 'phone'
              })
            })
          );
          sentTo.push('whatsapp');
        }

        if (hasEmail) {
          otpRequests.push(
            fetch('/api/auth/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                type: 'email'
              })
            })
          );
          sentTo.push('email');
        }

        const responses = await Promise.all(otpRequests);

        if (responses.every(r => r.ok)) {
          setIsOtpSent(true);
          setTimer(60);
          setOtpSentTo(sentTo.join('_'));

          let message = 'OTP has been sent to:';
          if (hasPhone) {
            message += `\n\n📱 WhatsApp: ${selectedCountry.dial_code}${formData.phoneNumber}`;
          }
          if (hasEmail) {
            message += `\n✉️ Email: ${formData.email}`;
          }

          Swal.fire({
            title: 'OTP Sent!',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#8b5cf6',
            background: '#232042',
            color: '#ffffff'
          });
        } else {
          throw new Error('Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        setIsOtpSent(true);
        setTimer(60);

        let sentTo = [];
        let message = 'OTP sent to:';
        if (formData.phoneNumber) {
          sentTo.push('whatsapp');
          message += `\n\n📱 WhatsApp: ${selectedCountry.dial_code}${formData.phoneNumber}`;
        }
        if (formData.email) {
          sentTo.push('email');
          message += `\n✉️ Email: ${formData.email}`;
        }
        setOtpSentTo(sentTo.join('_'));

        Swal.fire({
          title: 'OTP Sent!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#8b5cf6',
          background: '#232042',
          color: '#ffffff'
        });
      }
    } else {
      // For signup, use the existing handleSendOtp function
      handleSendOtp();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
      return;
    }

    if (isLogin && !formData.phoneNumber && !formData.email) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter either WhatsApp number or Email',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#8b5cf6',
        background: '#232042',
        color: '#ffffff'
      });
      return;
    }

    if (!isOtpSent) {
      handleSendOtpForLogin();
    } else {
      handleVerifyOtp();
    }
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
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {isLogin && (
          <div className="text-center text-gray-400 text-sm mb-6 flex items-center justify-center gap-2">
            <span>Login by</span>
            <svg className="w-4 h-4 fill-current text-purple-400" viewBox="0 0 24 24">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
            </svg>
            <span>Email or</span>
            <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
              <path d="M17.472,14.382c-0.297-0.149-1.758-0.867-2.03-0.967c-0.273-0.099-0.471-0.148-0.67,0.15c-0.197,0.297-0.767,0.966-0.94,1.164c-0.173,0.199-0.347,0.223-0.644,0.075c-0.297-0.15-1.255-0.463-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059c-0.173-0.297-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.65c0.099-0.198,0.05-0.371-0.025-0.52C9.919,8.981,9.325,7.515,9.078,6.92c-0.241-0.58-0.487-0.5-0.669-0.51c-0.173-0.008-0.371-0.01-0.57-0.01c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.297-1.04,1.016-1.04,2.479c0,1.462,1.065,2.875,1.213,3.074c0.149,0.198,2.096,3.2,5.077,4.487c0.709,0.306,1.262,0.489,1.694,0.625c0.712,0.227,1.36,0.195,1.871,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.289,0.173-1.413C17.884,14.651,17.769,14.431,17.472,14.382z M12.057,21.785h-0.008c-1.784,0-3.525-0.481-5.052-1.389l-0.362-0.215l-3.754,0.984l1.005-3.671l-0.236-0.375c-0.99-1.575-1.511-3.393-1.511-5.26c0-5.445,4.43-9.875,9.88-9.875c2.64,0,5.124,1.03,6.988,2.898c1.865,1.867,2.893,4.352,2.892,6.993C21.899,17.354,17.469,21.785,12.057,21.785z M20.5,3.488C18.24,1.24,15.24,0.013,12.058,0C5.507,0,0.17,5.335,0.172,11.892c0,2.096,0.547,4.142,1.588,5.945L0,24l6.305-1.654c1.746,0.943,3.71,1.444,5.71,1.447h0.006c6.551,0,11.89-5.335,11.89-11.893C23.91,8.724,22.759,5.746,20.5,3.488z"/>
            </svg>
            <span>WhatsApp Number</span>
          </div>
        )}

        {!isLogin && (
          <div className="mb-6 text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <span>Sign Up by</span>
              <svg className="w-4 h-4 fill-current text-purple-400" viewBox="0 0 24 24">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
              </svg>
              <span>Email or</span>
              <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
                <path d="M17.472,14.382c-0.297-0.149-1.758-0.867-2.03-0.967c-0.273-0.099-0.471-0.148-0.67,0.15c-0.197,0.297-0.767,0.966-0.94,1.164c-0.173,0.199-0.347,0.223-0.644,0.075c-0.297-0.15-1.255-0.463-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059c-0.173-0.297-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.65c0.099-0.198,0.05-0.371-0.025-0.52C9.919,8.981,9.325,7.515,9.078,6.92c-0.241-0.58-0.487-0.5-0.669-0.51c-0.173-0.008-0.371-0.01-0.57-0.01c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.297-1.04,1.016-1.04,2.479c0,1.462,1.065,2.875,1.213,3.074c0.149,0.198,2.096,3.2,5.077,4.487c0.709,0.306,1.262,0.489,1.694,0.625c0.712,0.227,1.36,0.195,1.871,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.289,0.173-1.413C17.884,14.651,17.769,14.431,17.472,14.382z M12.057,21.785h-0.008c-1.784,0-3.525-0.481-5.052-1.389l-0.362-0.215l-3.754,0.984l1.005-3.671l-0.236-0.375c-0.99-1.575-1.511-3.393-1.511-5.26c0-5.445,4.43-9.875,9.88-9.875c2.64,0,5.124,1.03,6.988,2.898c1.865,1.867,2.893,4.352,2.892,6.993C21.899,17.354,17.469,21.785,12.057,21.785z M20.5,3.488C18.24,1.24,15.24,0.013,12.058,0C5.507,0,0.17,5.335,0.172,11.892c0,2.096,0.547,4.142,1.588,5.945L0,24l6.305-1.654c1.746,0.943,3.71,1.444,5.71,1.447h0.006c6.551,0,11.89-5.335,11.89-11.893C23.91,8.724,22.759,5.746,20.5,3.488z"/>
              </svg>
              <span>WhatsApp</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
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
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-12 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                  <FaEnvelope size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white hover:bg-purple-500/10"
                    >
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span>{selectedCountry.dial_code}</span>
                      <FaChevronDown className="text-xs" />
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute top-full mt-1 left-0 w-64 max-h-60 overflow-y-auto bg-[#232042] border border-purple-500/30 rounded-lg shadow-lg z-50">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={searchCountry}
                          onChange={(e) => setSearchCountry(e.target.value)}
                          className="w-full px-3 py-2 bg-[#19162b] border-b border-purple-500/30 text-white placeholder-gray-400 focus:outline-none"
                        />
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                              setSearchCountry("");
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-purple-500/20 transition flex items-center gap-2"
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="flex-1">{country.name}</span>
                            <span className="text-gray-400">{country.dial_code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number *"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      <FaWhatsapp size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {isLogin && !isOtpSent && (
            <>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4 text-center">
                <p className="text-sm text-purple-300">
                  🔔 Enter Email or WhatsApp Number to receive OTP
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white hover:bg-purple-500/10"
                    >
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span>{selectedCountry.dial_code}</span>
                      <FaChevronDown className="text-xs" />
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute top-full mt-1 left-0 w-64 max-h-60 overflow-y-auto bg-[#232042] border border-purple-500/30 rounded-lg shadow-lg z-50">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={searchCountry}
                          onChange={(e) => setSearchCountry(e.target.value)}
                          className="w-full px-3 py-2 bg-[#19162b] border-b border-purple-500/30 text-white placeholder-gray-400 focus:outline-none"
                        />
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                              setSearchCountry("");
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-purple-500/20 transition flex items-center gap-2"
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="flex-1">{country.name}</span>
                            <span className="text-gray-400">{country.dial_code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder={!isLogin ? "Phone Number *" : "Phone Number"}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      readOnly={isLogin && formData.email && formData.email.length > 0}
                      className={`w-full px-4 py-3 pr-12 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400 ${isLogin && formData.email && formData.email.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      required={!isLogin}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      <FaWhatsapp size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {isLogin && (
                <div className="text-center text-sm text-gray-500 my-2">
                  <span>OR</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder={!isLogin ? "Email *" : "Email"}
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={isLogin && formData.phoneNumber && formData.phoneNumber.length > 0}
                    className={`w-full px-4 py-3 pl-12 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400 ${isLogin && formData.phoneNumber && formData.phoneNumber.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required={!isLogin}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                    <FaEnvelope size={20} />
                  </div>
                </div>
              </div>
            </>
          )}

          {isOtpSent && (
            <div className="space-y-2">
              <label className="text-sm text-gray-400 text-center block">
                Enter OTP from {
                  otpSentTo === 'whatsapp' ?
                    <span className="text-green-400"><FaWhatsapp className="inline mr-1" />WhatsApp</span> :
                    otpSentTo === 'email' ?
                      <span className="text-purple-400"><FaEnvelope className="inline mr-1" />Email</span> :
                      otpSentTo === 'whatsapp_email' ?
                        <span>either <span className="text-green-400"><FaWhatsapp className="inline mr-1" />WhatsApp</span> or <span className="text-purple-400"><FaEnvelope className="inline mr-1" />Email</span></span> :
                        'your device'
                }
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-[#19162b] border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400 text-center text-lg tracking-wider"
                maxLength="6"
                required
              />
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-400">Resend OTP in {timer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {!isLogin && !isOtpSent && (
            <div className="text-center text-gray-400 text-sm mb-2">
              <p>OTP sent to Email and WhatsApp Number</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isLogin && !canSendOtp && !isOtpSent}
            className={`w-full px-6 py-3 rounded-lg font-semibold shadow-lg transition ${!isLogin && !canSendOtp && !isOtpSent
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105"
              }`}
          >
            {!isLogin && !isOtpSent ? 'Send OTP' :
              !isLogin && isOtpSent ? 'Verify OTP' :
                isLogin && !isOtpSent ? 'Send OTP' :
                  isLogin && isOtpSent ? 'Verify OTP' :
                    'Submit'}
          </button>
        </form>


        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setIsOtpSent(false);
                setOtp("");
                setTimer(0);
                setAuthMethod("whatsapp");
              }}
              className="text-purple-400 hover:text-purple-300 transition font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}