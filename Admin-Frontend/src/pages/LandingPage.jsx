import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-noise" aria-hidden="true" />

      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark">CCMS</span>
          <div>
            <h2>Campus Complaint Management System</h2>
            <p>One portal for students and administration.</p>
          </div>
        </div>
      </header>

      <main className="landing-hero">
        <section className="landing-copy">
          <p className="landing-kicker">Digital Campus Service Desk</p>
          <h1>Raise, track, and resolve campus issues faster.</h1>
          <p className="landing-description">
            A single web application for student complaint submission, transparent
            status tracking, and complete admin-side resolution workflows.
          </p>

          <div className="landing-actions">
            <Link className="landing-btn primary" to="/student/login">
              Student Login
            </Link>

            <Link className="landing-btn ghost" to="/admin/login">
              Admin Login
            </Link>
          </div>

          <div className="landing-stats">
            <article>
              <span>Student Module</span>
              <strong>Authentication + Complaint Tracking</strong>
            </article>
            <article>
              <span>Admin Module</span>
              <strong>Dashboard + Status + Reports</strong>
            </article>
          </div>
        </section>

        <section className="landing-visual" aria-hidden="true">
          <div className="pulse-card top">
            <h3>Complaint Lifecycle</h3>
            <p>Pending to In Progress to Resolved</p>
          </div>
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="pulse-card bottom">
            <h3>Single URL Experience</h3>
            <p>Landing, Student, and Admin in one frontend app.</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Showcase Ready - Campus Complaint Management System</p>
      </footer>
    </div>
  );
}
