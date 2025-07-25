import { useState } from 'react';
import '../styles/styles-pure-components.css';

// FAQ Page Component
export function PureFAQPage({ onBack }) {
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

// About Us Page Component
export function PureAboutUsPage({ onBack }) {
  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">About PeekTrend</h1>
        
        <div className="pure-page-content">
          <div className="pure-page-section">
            <h3>Our Story</h3>
            <p>
              PeekTrend was born from a simple yet frustrating problem: smartphones that overheat during the most critical moments. Whether you're in the middle of an intense gaming session, recording important content, or on a crucial video call, device overheating can ruin the experience.
            </p>
            <p>
              Founded in 2022 by a team of mobile gaming enthusiasts and thermal engineering experts, we set out to create the most effective, user-friendly phone cooling solutions on the market. Our journey began when our founder's phone overheated during a live stream, causing him to lose hours of content and hundreds of viewers.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Our Mission</h3>
            <p>
              To eliminate phone overheating forever. We believe that your device should perform at its peak regardless of how intensively you use it. Our mission is to provide innovative, reliable, and affordable cooling solutions that unlock your phone's full potential.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Why Choose PeekTrend?</h3>
            <p>
              <strong>Innovation First:</strong> We invest heavily in R&D to bring you cutting-edge cooling technology that actually works. Our patented thermoelectric cooling modules deliver industry-leading performance.
            </p>
            <p>
              <strong>Quality Guaranteed:</strong> Every product undergoes rigorous testing and quality control. We use only premium materials like aviation-grade aluminum and high-performance semiconductors.
            </p>
            <p>
              <strong>Customer-Centric:</strong> With over 100,000 satisfied customers worldwide and a 98% satisfaction rate, we're committed to providing exceptional products and service.
            </p>
            <p>
              <strong>Continuous Improvement:</strong> We listen to our customers and constantly iterate on our designs. Your feedback directly shapes our product development.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Our Team</h3>
            <p>
              Our diverse team combines expertise in thermal engineering, product design, mobile technology, and customer experience. We're united by our passion for solving real-world problems and our commitment to excellence.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Looking Forward</h3>
            <p>
              As mobile devices become more powerful and demanding, the need for effective cooling solutions will only grow. We're constantly innovating and expanding our product line to meet these evolving needs. From wireless charging integration to AI-powered temperature management, the future of mobile cooling is exciting.
            </p>
            <p>
              Thank you for trusting PeekTrend to keep your devices cool and your performance hot. Together, we're building a world where overheating is never a limitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Page Component
export function PureContactPage({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Contact Us</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '3rem',
          marginTop: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#030213', marginBottom: '1rem' }}>
              Get in Touch
            </h3>
            <p style={{ color: '#717182', lineHeight: '1.6', marginBottom: '2rem' }}>
              Have a question about our products or need support? We're here to help! Our customer service team typically responds within 24 hours.
            </p>

            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>Email Support</h4>
                <p style={{ color: '#717182' }}>support@peektrend.com</p>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>Phone Support</h4>
                <p style={{ color: '#717182' }}>1-800-PEEK-COOL (1-800-733-5266)</p>
                <p style={{ fontSize: '0.875rem', color: '#717182' }}>Monday - Friday: 9AM - 6PM EST</p>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>Live Chat</h4>
                <p style={{ color: '#717182' }}>Available 24/7 on our website</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pure-form">
            <div className="pure-form-group">
              <label htmlFor="name" className="pure-form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="pure-form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="pure-form-group">
              <label htmlFor="email" className="pure-form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pure-form-input"
                placeholder="Enter your email address"
              />
            </div>

            <div className="pure-form-group">
              <label htmlFor="subject" className="pure-form-label">Subject *</label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="pure-form-input"
              >
                <option value="">Select a subject</option>
                <option value="product-question">Product Question</option>
                <option value="order-support">Order Support</option>
                <option value="technical-support">Technical Support</option>
                <option value="warranty-claim">Warranty Claim</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="pure-form-group">
              <label htmlFor="message" className="pure-form-label">Message *</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="pure-form-textarea"
                placeholder="Please provide as much detail as possible about your inquiry..."
              />
            </div>

            <button type="submit" className="pure-form-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Page Component
export function PurePrivacyPolicyPage({ onBack }) {
  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Privacy Policy</h1>
        
        <div className="pure-page-content">
          <p style={{ fontSize: '0.875rem', color: '#717182', marginBottom: '2rem' }}>
            <strong>Last Updated:</strong> December 2024
          </p>

          <div className="pure-page-section">
            <h3>Introduction</h3>
            <p>
              At PeekTrend, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make a purchase, or interact with our services.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Information We Collect</h3>
            <p><strong>Personal Information:</strong></p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Name, email address, phone number</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Order history and preferences</li>
            </ul>
            <p><strong>Automatically Collected Information:</strong></p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>IP address, browser type, device information</li>
              <li>Pages visited, time spent on site</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="pure-page-section">
            <h3>How We Use Your Information</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Process and fulfill your orders</li>
              <li>Provide customer support</li>
              <li>Send order updates and confirmations</li>
              <li>Improve our products and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>

          <div className="pure-page-section">
            <h3>Information Sharing</h3>
            <p>We do not sell, trade, or rent your personal information. We may share information with:</p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Service providers who help us operate our business</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping companies for order fulfillment</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>

          <div className="pure-page-section">
            <h3>Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your information, including SSL encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Your Rights</h3>
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Access, update, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </div>

          <div className="pure-page-section">
            <h3>Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@peektrend.com or 1-800-PEEK-COOL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Terms of Service Page Component
export function PureTermsOfServicePage({ onBack }) {
  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Terms of Service</h1>
        
        <div className="pure-page-content">
          <p style={{ fontSize: '0.875rem', color: '#717182', marginBottom: '2rem' }}>
            <strong>Last Updated:</strong> December 2024
          </p>

          <div className="pure-page-section">
            <h3>Agreement to Terms</h3>
            <p>
              By accessing and using PeekTrend's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Products and Services</h3>
            <p>
              PeekTrend provides phone cooling solutions and related accessories. Product descriptions, specifications, and pricing are subject to change without notice. We reserve the right to limit quantities and discontinue products.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Order Acceptance and Pricing</h3>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders for any reason. Prices are in USD and do not include taxes or shipping unless specified. We may correct pricing errors at any time.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Payment Terms</h3>
            <p>
              Payment is due at the time of purchase. We accept major credit cards, PayPal, and other payment methods as displayed at checkout. You are responsible for all charges incurred under your account.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Shipping and Delivery</h3>
            <p>
              We ship to addresses within our service areas. Shipping costs and delivery times are estimates and may vary. Risk of loss passes to you upon delivery. We are not responsible for delays caused by shipping carriers.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Returns and Refunds</h3>
            <p>
              We offer a 30-day return policy for unused products in original packaging. Return shipping costs are the customer's responsibility unless the item was defective or shipped in error. Refunds are processed to the original payment method.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Warranty</h3>
            <p>
              Products are covered by a 1-year limited warranty against manufacturing defects. Warranty does not cover damage from misuse, accidents, or normal wear and tear. Warranty service may include repair or replacement at our discretion.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Limitation of Liability</h3>
            <p>
              PeekTrend's liability is limited to the purchase price of the product. We are not liable for indirect, incidental, or consequential damages. Some jurisdictions do not allow these limitations, so they may not apply to you.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Contact Information</h3>
            <p>
              For questions about these terms, contact us at legal@peektrend.com or 1-800-PEEK-COOL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shipping Page Component
export function PureShippingPage({ onBack }) {
  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Shipping Information</h1>
        
        <div className="pure-page-content">
          <div className="pure-page-section">
            <h3>Shipping Options</h3>
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>
                  Standard Shipping - FREE
                </h4>
                <p style={{ color: '#717182', marginBottom: '0.5rem' }}>3-5 business days</p>
                <p style={{ fontSize: '0.875rem', color: '#717182' }}>
                  Free on all orders over $25. Available for all domestic orders.
                </p>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>
                  Express Shipping - $9.99
                </h4>
                <p style={{ color: '#717182', marginBottom: '0.5rem' }}>1-2 business days</p>
                <p style={{ fontSize: '0.875rem', color: '#717182' }}>
                  Perfect for urgent orders. Guaranteed delivery within 2 business days.
                </p>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: '#030213', marginBottom: '0.5rem' }}>
                  Overnight Shipping - $19.99
                </h4>
                <p style={{ color: '#717182', marginBottom: '0.5rem' }}>Next business day</p>
                <p style={{ fontSize: '0.875rem', color: '#717182' }}>
                  Orders placed before 2 PM EST ship same day for next-day delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="pure-page-section">
            <h3>International Shipping</h3>
            <p>
              We ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on destination and package weight. Delivery typically takes 7-14 business days.
            </p>
            <p>
              <strong>Important:</strong> International customers are responsible for any customs duties, taxes, or fees imposed by their country. These charges are not included in our shipping costs.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Processing Time</h3>
            <p>
              Orders are typically processed within 1-2 business days. During peak seasons or sales events, processing may take up to 3 business days. You'll receive a confirmation email with tracking information once your order ships.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Tracking Your Order</h3>
            <p>
              All orders include tracking information. You'll receive an email with your tracking number once your order ships. You can also track your order status in your account dashboard.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Shipping Restrictions</h3>
            <p>We currently ship to:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>All 50 US states and territories</li>
              <li>Canada</li>
              <li>European Union countries</li>
              <li>Australia and New Zealand</li>
              <li>United Kingdom</li>
              <li>Japan and South Korea</li>
            </ul>
            <p>
              We cannot ship to PO Boxes for Express or Overnight shipping options. Some remote areas may have extended delivery times.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Questions?</h3>
            <p>
              If you have questions about shipping or need to change your shipping address, contact our support team at support@peektrend.com or 1-800-PEEK-COOL as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Returns Page Component
export function PureReturnsPage({ onBack }) {
  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        <h1 className="pure-page-title">Returns &amp; Exchanges</h1>
        
        <div className="pure-page-content">
          <div className="pure-page-section">
            <h3>30-Day Money-Back Guarantee</h3>
            <p>
              We stand behind our products with a 30-day money-back guarantee. If you're not completely satisfied with your PeekTrend purchase, you can return it within 30 days of delivery for a full refund.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Return Requirements</h3>
            <p>To be eligible for a return, your item must be:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>In original, unused condition</li>
              <li>In original packaging with all accessories</li>
              <li>Returned within 30 days of delivery</li>
              <li>Accompanied by proof of purchase</li>
            </ul>
            <p>
              <strong>Note:</strong> Items that show signs of use, damage, or missing components may be subject to a restocking fee or rejected for return.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>How to Return an Item</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
              <ol style={{ paddingLeft: '1.5rem', margin: '0' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Contact Us:</strong> Email support@peektrend.com or call 1-800-PEEK-COOL to initiate your return
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Get Authorization:</strong> We'll provide you with a Return Merchandise Authorization (RMA) number
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Package Item:</strong> Pack the item securely in original packaging with RMA number clearly marked
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Ship Back:</strong> Send the package to the address provided in your RMA email
                </li>
                <li>
                  <strong>Get Refund:</strong> Once we receive and inspect the item, we'll process your refund within 3-5 business days
                </li>
              </ol>
            </div>
          </div>

          <div className="pure-page-section">
            <h3>Return Shipping</h3>
            <p>
              <strong>Defective Items:</strong> We'll provide a prepaid return shipping label and cover all return costs.
            </p>
            <p>
              <strong>Change of Mind:</strong> Customer is responsible for return shipping costs. We recommend using a trackable shipping service and purchasing shipping insurance for items over $50.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Exchanges</h3>
            <p>
              We don't offer direct exchanges. To exchange an item, please return the original item for a refund and place a new order for the desired product. This ensures the fastest processing and delivery of your new item.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Refund Processing</h3>
            <p>
              Refunds are processed to the original payment method within 3-5 business days after we receive and inspect your return. Please note that it may take additional time for the refund to appear on your account depending on your bank or credit card company.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Warranty Claims</h3>
            <p>
              Items with manufacturing defects are covered by our 1-year warranty. For warranty claims, contact us with photos of the defect and proof of purchase. Warranty service may include repair, replacement, or refund at our discretion.
            </p>
          </div>

          <div className="pure-page-section">
            <h3>Need Help?</h3>
            <p>
              Our customer service team is here to make your return process as smooth as possible. Contact us at:
            </p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Email: support@peektrend.com</li>
              <li>Phone: 1-800-PEEK-COOL (1-800-733-5266)</li>
              <li>Hours: Monday-Friday, 9AM-6PM EST</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}