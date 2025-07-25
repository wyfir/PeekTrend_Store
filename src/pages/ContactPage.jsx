import { useState } from 'react';
import '../styles/styles-pure-components.css';

export function ContactPage({ onBack }) {
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