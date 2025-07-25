import '../styles/styles-pure-components.css';

export function AboutUsPage({ onBack }) {
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

export default AboutUsPage;