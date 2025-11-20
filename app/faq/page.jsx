"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and various digital payment methods including Apple Pay and Google Pay."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. We also offer same-day delivery in select metropolitan areas for orders placed before 2 PM."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Simply contact our customer service team to initiate a return. Refunds are processed within 5-7 business days after we receive the returned item."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can check shipping options and costs at checkout."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly on the carrier's website."
    },
    {
      question: "Do you have a size guide?",
      answer: "Yes, we provide detailed size guides for all our products. You can find the size guide link on each product page. We recommend measuring yourself and comparing with our guide for the best fit."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 2 hours of placement. After this time, the order enters our fulfillment process and cannot be changed. Please contact customer service immediately if you need assistance."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer complimentary gift wrapping on all orders. You can select this option at checkout and add a personalized message for the recipient."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team via email at support@megasifi.com, through our live chat feature on the website, or by calling +91-6969696969 during business hours (9 AM - 6 PM IST)."
    },
    {
      question: "Do you have a loyalty program?",
      answer: "Yes! Our Megasifi Rewards program offers points for every purchase, which can be redeemed for discounts on future orders. Members also get early access to sales and exclusive offers."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-rose-100 to-rose-50 py-16 px-4 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-rose-700">
              Find answers to common questions about shopping at Megasifi. 
              Can't find what you're looking for? Feel free to contact our support team.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 md:px-10 lg:px-16 py-12">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-rose-50 transition-colors"
                >
                  <span className="font-semibold text-old-olive">{faq.question}</span>
                  <Image
                    src={assets.dropdown_icon}
                    alt="dropdown icon"
                    width={12}
                    height={12}
                    className={`transform transition-transform duration-200 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-rose-100 to-rose-50 py-16 px-4 md:px-10 lg:px-16 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-rose-800 mb-4">
              Still have questions?
            </h2>
            <p className="text-rose-700 mb-8">
              Our customer support team is here to help you with any questions or concerns.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={assets.email_icon}
                    alt="email"
                    width={24}
                    height={24}
                    className="text-rose-600"
                  />
                </div>
                <h3 className="font-semibold text-old-olive mb-2">Email Support</h3>
                <p className="text-sm text-gray-600">
                  support@megashifi.com
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={assets.phone_icon}
                    alt="phone"
                    width={24}
                    height={24}
                    className="text-rose-600"
                  />
                </div>
                <h3 className="font-semibold text-old-olive mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600">
                  1-800-MEGASHIFI
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={assets.clock_icon}
                    alt="clock"
                    width={24}
                    height={24}
                    className="text-rose-600"
                  />
                </div>
                <h3 className="font-semibold text-old-olive mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Dedicated customer service
                </p>
              </div>
            </div>
            
            <Link 
              href="/"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
