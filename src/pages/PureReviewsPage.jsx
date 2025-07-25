import '../styles/styles-pure-components.css';

export function PureReviewsPage() {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={i < Math.floor(rating) ? 'pure-star' : 'pure-star pure-star-empty'}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const reviews = [
    {
      id: 1,
      name: "Alex M.",
      location: "Chicago, IL",
      rating: 5,
      date: "December 15, 2024",
      product: "Snap-on Phone Cooler X1",
      text: "Game changer! My iPhone was constantly overheating during long gaming sessions, especially when playing Call of Duty Mobile or PUBG. The X1 cooler dropped the temperature instantly and I can finally play without throttling. The build quality is amazing - feels premium and sturdy. The clamps are perfectly padded and don't scratch my phone. Worth every penny!",
      verified: true
    },
    {
      id: 2,
      name: "Mia Johnson",
      location: "Amsterdam, NL",
      rating: 5,
      date: "December 12, 2024",
      product: "Snap-on Phone Cooler X1",
      text: "Perfect for content creation! I stream live on Instagram and TikTok and my phone would always overheat after just 10 minutes. With the PeekTrend cooler, I can stream for hours without any issues. The whisper-quiet operation means it doesn't interfere with my audio recording. Highly recommended for influencers and content creators!",
      verified: true
    },
    {
      id: 3,
      name: "David Liu",
      location: "San Francisco, CA",
      rating: 4,
      date: "December 10, 2024",
      product: "Wireless Phone Cooler",
      text: "Really impressed with the wireless model. The battery lasts all day and it's so convenient not having cables everywhere. Perfect for my desk setup. The only minor issue is it adds a bit of bulk to the phone, but the cooling performance makes it totally worth it. Great for long video calls too.",
      verified: true
    },
    {
      id: 4,
      name: "Sarah Kim",
      location: "Seoul, South Korea",
      rating: 5,
      date: "December 8, 2024",
      product: "Snap-on Cooler X1 Pro (RGB)",
      text: "The RGB edition is absolutely stunning! The lighting effects are smooth and customizable. As a mobile gamer, this cooler has completely transformed my gaming experience. No more lag, no more overheating during intense battles. The enhanced cooling performance is noticeable compared to the regular X1. Premium packaging made it feel like unboxing a luxury item.",
      verified: true
    },
    {
      id: 5,
      name: "Michael Rodriguez",
      location: "Miami, FL",
      rating: 5,
      date: "December 5, 2024",
      product: "Snap-on Phone Cooler X1",
      text: "Living in Miami, phone overheating is a real problem, especially during summer. This cooler is a lifesaver! Works great even in 90°F weather. I use it for work video calls, gaming, and when I'm out recording videos. The USB-C connection is convenient and the LED indicator is helpful. Shipping was fast too!",
      verified: true
    },
    {
      id: 6,
      name: "Emma Thompson",
      location: "London, UK",
      rating: 4,
      date: "December 3, 2024",
      product: "Privacy Glass Screen Protector",
      text: "Excellent privacy protection! Works exactly as advertised - completely blocks side viewing while maintaining crystal clear visibility when looking directly. Installation was easier than expected with the included tools. The oleophobic coating works well to prevent fingerprints. Only wish it came in more phone models.",
      verified: true
    },
    {
      id: 7,
      name: "James Wilson",
      location: "Toronto, CA",
      rating: 5,
      date: "November 30, 2024",
      product: "Snap-on Phone Cooler X1",
      text: "Outstanding product! As a software developer, I'm constantly running intensive apps and my phone would get uncomfortably hot. This cooler solved that problem immediately. The difference is night and day. Build quality feels premium, fits my iPhone 14 Pro perfectly, and the cooling effect is almost instantaneous. Customer service was also excellent when I had questions.",
      verified: true
    },
    {
      id: 8,
      name: "Lisa Chen",
      location: "Vancouver, CA",
      rating: 4,
      date: "November 28, 2024",
      product: "Wireless Phone Cooler",
      text: "Great for outdoor activities! I do a lot of hiking and photography, and my phone would overheat when shooting 4K video in the sun. The wireless cooler gives me the freedom to move around without cables. Battery life is solid - easily lasts a full day of shooting. The magnetic attachment is secure but not too strong that it's hard to remove.",
      verified: true
    },
    {
      id: 9,
      name: "Robert Taylor",
      location: "Sydney, AU",
      rating: 5,
      date: "November 25, 2024",
      product: "Snap-on Cooler X1 Pro (RGB)",
      text: "The RGB Pro is incredible! The cooling performance is noticeably better than my friend's regular X1. The RGB effects are not just for show - you can actually customize them to match your gaming setup. Perfect for streaming on Twitch. The build quality is top-notch and it looks amazing on camera. Worth the extra cost!",
      verified: true
    }
  ];

  return (
    <div className="pure-component pure-page">
      <div className="pure-page-container" style={{ maxWidth: '1200px' }}>
        <h1 className="pure-page-title">Customer Reviews</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#717182', marginBottom: '1rem' }}>
            See what our customers are saying about PeekTrend products
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {renderStars(4.8)}
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#030213' }}>4.8</span>
            <span style={{ color: '#717182' }}>based on {reviews.length}+ reviews</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#22c55e' }}>✓ All reviews are from verified purchases</p>
        </div>

        <div className="pure-reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="pure-review-card">
              <div className="pure-review-quote">"</div>
              
              <div className="pure-review-rating">
                {renderStars(review.rating)}
              </div>
              
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#717182', 
                marginBottom: '0.75rem' 
              }}>
                <strong>{review.product}</strong> • {review.date}
                {review.verified && (
                  <span style={{ color: '#22c55e', marginLeft: '0.5rem' }}>
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              
              <p className="pure-review-text">{review.text}</p>
              
              <div className="pure-review-author">
                <div className="pure-review-avatar">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="pure-review-info">
                  <div className="pure-review-name">{review.name}</div>
                  <div className="pure-review-location">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Stats */}
        <div style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '1rem' 
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#030213', 
            marginBottom: '2rem', 
            textAlign: 'center' 
          }}>
            Review Breakdown
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e' }}>98%</div>
              <p style={{ color: '#717182' }}>Recommend to friends</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#030213' }}>4.8/5</div>
              <p style={{ color: '#717182' }}>Average rating</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>10k+</div>
              <p style={{ color: '#717182' }}>Verified purchases</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>24h</div>
              <p style={{ color: '#717182' }}>Average response time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}