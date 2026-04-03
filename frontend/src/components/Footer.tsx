import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-muted border-t border-brand-border w-full">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="text-white text-lg font-semibold mb-3">
              Smart Notes<span className="text-brand-green">.AI</span>
            </div>
            <p className="text-sm text-brand-subtle leading-relaxed">
              Chat with your documents and videos using AI.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/chat" className="hover:text-white transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors duration-200">Signup</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Privacy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-brand-border text-center text-sm text-brand-subtle">
          © {new Date().getFullYear()} Smart Notes AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}