import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '2bhk',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <h1>Contact Us</h1>
        <p>Schedule a Site Visit or Get More Information</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <div className="gold-line" style={{ margin: '15px 0 30px' }}></div>
              <p className="contact-desc">
                Interested in Hiranandani Fortune City, Panvel? Our team is ready to help you
                find your perfect home at Arcadia. Reach out to us for any queries, schedule
                a site visit, or request a callback.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="cd-icon">📍</div>
                  <div>
                    <h4>Location</h4>
                    <p>Hiranandani Fortune City<br />Panvel, Navi Mumbai<br />Maharashtra, India</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="cd-icon">📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 XXXXX XXXXX</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="cd-icon">✉</div>
                  <div>
                    <h4>Email</h4>
                    <p>info@hiranandani.com</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="cd-icon">🕐</div>
                  <div>
                    <h4>Site Visit Hours</h4>
                    <p>Mon - Sat: 10:00 AM - 7:00 PM<br />Sunday: By Appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">&#10003;</div>
                  <h3>Thank You!</h3>
                  <p>Your enquiry has been submitted successfully. Our team will get back to you shortly.</p>
                  <button className="btn btn-gold-outline" onClick={() => setSubmitted(false)}>
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Send an Enquiry</h3>

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Interested In</label>
                    <select name="interest" value={formData.interest} onChange={handleChange}>
                      <option value="2bhk">2 BHK Presidentia</option>
                      <option value="3bhk">3 BHK Presidentia</option>
                      <option value="site-visit">Site Visit</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any specific requirements or questions..."
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary form-submit">
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
