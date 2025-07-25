import { useState } from 'react';
import '../styles/styles-pure-components.css';

export function FAQPage({ onBack }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How effective are PeekTrend phone coolers?",
      answer: "Our phone coolers can drop your device's surface temperature by up to 25°C in under 30 seconds. This dramatically reduces thermal throttling and maintains peak performance during intensive tasks like gaming, video recording, and streaming."
    },
    {
      id: 2,
      question: "Will the cooler fit my phone?",
      answer: "Our coolers feature adjustable clamps that accommodate phones between 65-85mm wide, covering virtually all modern smartphones including iPhone, Samsung Galaxy, Google Pixel, OnePlus, and more. The soft silicone padding protects your device from scratches."
    },
    {
      id: 3,
      question: "How long do the wireless coolers last on battery?",
      answer: "The wireless phone cooler features a 2000mAh battery providing 4-6 hours of continuous cooling. It charges fully in just 1.5 hours via USB-C and can even provide emergency charging to your phone when needed."
    },
    {
      id: 4,
      question: "Are the coolers loud during operation?",
      answer: "All our coolers operate whisper-quiet at less than 30 dB, making them virtually silent during use. You won't even notice them running during calls, recordings, or late-night gaming sessions."
    },
    {
      id: 5,
      question: "Can I use the cooler while charging my phone?",
      answer: "Absolutely! Our coolers are specifically designed to work while your phone is charging. In fact, they help prevent charging-related overheating, making your device charge more efficiently and safely."
    },
    {
      id: 6,
      question: "What's your return policy?",
      answer: "We offer a 30-day money-back guarantee on all products. If you're not completely satisfied with your purchase, return it within 30 days for a full refund. We also provide a 1-year warranty against manufacturing defects."
    },
    {
      id: 7,
      question: "How fast is shipping?",
      answer: "We offer free standard shipping (3-5 business days) on all orders over $25. Express shipping (1-2 business days) is available for $9.99. International shipping typically takes 7-14 business days depending on your location."
    },
    {
      id: 8,
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! We offer international shipping to over 50 countries. Shipping costs and delivery times vary by destination. All international packages include tracking and insurance."
    }
  ];

  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Frequently Asked Questions</h1>
        
        <div style={{ marginTop: '2rem' }}>
          {faqs.map((faq) => (
            <div key={faq.id} className="pure-faq-section">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="pure-faq-question"
              >
                {faq.question}
                <svg 
                  className={`pure-faq-icon ${expandedFaq === faq.id ? 'expanded' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {expandedFaq === faq.id && (
                <div className="pure-faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}