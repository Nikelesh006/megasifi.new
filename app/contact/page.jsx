'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { Mail, Phone, Instagram, MapPin, Clock, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const ContactPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Clean URL
      router.replace('/contact', undefined, { shallow: true });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    try {
      // Create a temporary form and submit it via iframe to bypass FormSubmit pages
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'formsubmit-frame';
      document.body.appendChild(iframe);

      // Create a new form with proper FormSubmit configuration
      const tempForm = document.createElement('form');
      tempForm.action = 'https://formsubmit.co/megasifidrop@gmail.com';
      tempForm.method = 'POST';
      tempForm.target = 'formsubmit-frame';

      // Copy all form data including hidden fields
      const allInputs = e.target.querySelectorAll('input, select, textarea');
      allInputs.forEach(input => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = input.name;
        hiddenInput.value = input.value;
        tempForm.appendChild(hiddenInput);
      });

      // Add required FormSubmit fields
      const nextField = document.createElement('input');
      nextField.type = 'hidden';
      nextField.name = '_next';
      nextField.value = window.location.origin + '/contact?success=true';
      tempForm.appendChild(nextField);

      document.body.appendChild(tempForm);
      tempForm.submit();

      // Show success after delay
      setTimeout(() => {
        setShowToast(true);
        e.target.reset();
        setIsSubmitting(false);
        setTimeout(() => setShowToast(false), 3000);
        
        // Clean up
        document.body.removeChild(tempForm);
        document.body.removeChild(iframe);
      }, 1500);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please try again.');
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen">
      <style jsx>{`
        /* Hide FormSubmit branding and reCAPTCHA */
        iframe[src*="recaptcha"], 
        .grecaptcha-badge,
        div[id*="recaptcha"],
        .formsubmit-notice,
        [style*="position: fixed"][style*="bottom:"][style*="right:"],
        .powered-by,
        .formsubmit-branding,
        body > div:first-child:not([class]),
        body > div:not([class]):not([id]),
        .container > h1,
        .text-center > h1 {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide FormSubmit intermediate pages */
        body:has(> div:contains("FormSubmit")),
        body:has(> div:contains("Form should POST")),
        body:has(h1:contains("Almost There")),
        body:has(.container:has(h1)) {
          display: none !important;
        }
      `}</style>
      {/* Vibrant Header Section */}
      <div className="relative w-full h-[300px] bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Get in touch with us for any questions, concerns, or feedback</p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-rose-800 mb-6">Get in Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-rose-50 rounded-lg shadow-lg p-6 flex items-start space-x-4 border border-rose-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex-shrink-0 p-3 bg-rose-100 rounded-full text-rose-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800 mb-1">Phone</h3>
                  <p className="text-gray-700">+91 9043869570</p>
                  <p className="text-gray-700">+91 7708445334</p>
                  <p className="text-gray-500 text-sm">Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-rose-50 rounded-lg shadow-lg p-6 flex items-start space-x-4 border border-rose-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex-shrink-0 p-3 bg-rose-100 rounded-full text-rose-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800 mb-1">Email</h3>
                  <p className="text-gray-700">megasifidrop@gmail.com</p>
                  <p className="text-gray-500 text-sm">We respond within 24 hours</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-rose-50 rounded-lg shadow-lg p-6 flex items-start space-x-4 border border-rose-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex-shrink-0 p-3 bg-rose-100 rounded-full text-rose-600">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800 mb-1">Instagram</h3>
                  <p className="text-gray-700">Megasifi.store</p>
                  <p className="text-gray-500 text-sm">Follow us for updates and inspiration</p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-rose-50 rounded-lg shadow-lg p-6 flex items-start space-x-4 border border-rose-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex-shrink-0 p-3 bg-rose-100 rounded-full text-rose-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800 mb-1">Address</h3>
                  <p className="text-gray-700">Pollachi,</p>
                  <p className="text-gray-700">Coimbatore, Tamil Nadu</p>
                  <p className="text-gray-500 text-sm">India</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-rose-50 rounded-lg shadow-lg p-6 flex items-start space-x-4 border border-rose-200 hover:shadow-xl transition-shadow duration-300 md:col-span-2">
                <div className="flex-shrink-0 p-3 bg-rose-100 rounded-full text-rose-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800 mb-1">Business Hours</h3>
                  <p className="text-gray-700">Monday - Sunday: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-rose-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-rose-800 mb-2">Send us a Message</h2>
              <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="_subject" value="New Contact Form Submission from Megasifi" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_autoresponse" value="Thank you for contacting Megasifi! We'll get back to you within 24 hours." />
              <input type="text" name="_honeypot" style={{display:"none"}} tabIndex="-1" autoComplete="off" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                    placeholder="Jon Snow"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                    placeholder="winteriscoming@gmail.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                  placeholder="+91 90000 00000"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="product">Product Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-white shadow-sm"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-rose-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>

            <div className="mt-8 p-4 bg-white/70 rounded-lg border border-rose-100">
              <p className="text-sm text-gray-600 text-center">
                <strong>Response Time:</strong> We typically respond to all inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Seller Inquiry Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-rose-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rose-800 mb-4">Want to Sell Your Clothing Products?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join our marketplace and reach thousands of fashion enthusiasts! We're always looking for quality clothing brands and unique designs to add to our collection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-rose-800 mb-2">Contact Us</h3>
              <p className="text-gray-600">Reach out with your product details and brand information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-rose-800 mb-2">Get a Quote</h3>
              <p className="text-gray-600">Receive competitive pricing and commission rates within 48 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-rose-800 mb-2">Start Selling</h3>
              <p className="text-gray-600">List your products and start reaching customers immediately</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-rose-800 mb-4">What We're Looking For:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <p className="text-gray-700">Quality clothing brands and designers</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <p className="text-gray-700">Unique and trendy fashion pieces</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <p className="text-gray-700">Sustainable and ethical fashion brands</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <p className="text-gray-700">Ready-to-ship inventory</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-gray-700 mb-4">
              <strong>Ready to get started?</strong> Contact us today for a free quote and join our growing community of sellers!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:megasifidrop@gmail.com" 
                className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
              >
                Email Sellers Team
              </a>
              <a 
                href="tel:+91 9043869570"
                className="inline-block border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
              >
                Call Sales Team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Message sent successfully!</span>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
