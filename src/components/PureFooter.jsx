import '../styles/styles-pure-components.css';

export function PureFooter({ onPageChange }) {
  return (
    <footer className="pure-footer">
      <div className="pure-footer-container">
        <div className="pure-footer-content">
          <div className="pure-footer-section">
            <h4>Customer Service</h4>
            <ul className="pure-footer-links">
              <li><button onClick={() => onPageChange('contact')}>Contact Us</button></li>
              <li><button onClick={() => onPageChange('faq')}>FAQ</button></li>
              <li><button onClick={() => onPageChange('shipping')}>Shipping Info</button></li>
              <li><button onClick={() => onPageChange('returns')}>Returns & Exchanges</button></li>
            </ul>
          </div>
          
          <div className="pure-footer-section">
            <h4>Company</h4>
            <ul className="pure-footer-links">
              <li><button onClick={() => onPageChange('about')}>About Us</button></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Sustainability</a></li>
            </ul>
          </div>
          
          <div className="pure-footer-section">
            <h4>Legal</h4>
            <ul className="pure-footer-links">
              <li><button onClick={() => onPageChange('privacy')}>Privacy Policy</button></li>
              <li><button onClick={() => onPageChange('terms')}>Terms of Service</button></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
          
          <div className="pure-footer-section">
            <h4>Connect</h4>
            <ul className="pure-footer-links">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pure-footer-bottom">
          <p>&copy; 2025 PeekTrend. All rights reserved. | Made with ❤️ for our customers</p>
        </div>
      </div>
    </footer>
  );
}