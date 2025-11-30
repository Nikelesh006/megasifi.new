import React from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. All transactions are secure and encrypted.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy. Items must be unworn, with tags attached, and in their original packaging.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email to monitor your package\'s journey.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. International shipping rates and delivery times vary by destination.'
    },
    {
      question: 'How can I contact customer service?',
      answer: 'You can reach our customer service team at support@megasifi.com or call us at +1-555-123-4567 during business hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-rose-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-rose-600">Find answers to common questions about our products and services</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-rose-800">{faq.question}</h3>
                  <ChevronDown className="w-5 h-5 text-rose-600 transform group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-rose-800 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Our customer service team is here to help</p>
          <Link 
            href="/contact" 
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
