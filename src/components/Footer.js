export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold text-white">AptiCrack</h4>
          <p className="text-sm mt-2">
            Enhancing aptitude skills for internships, placements, and competitive exams.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="/admin/login" className="hover:text-white">Admin Login</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/tests" className="hover:text-white">Tests</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="text-sm mt-2">
            Email: <a href="mailto:contact@eesiiests.org" className="hover:text-white">contact@eesiiests.org</a>
          </p>
          <p className="text-sm">
            Developer: <a href="mailto:aminulislam@eesiiests.org" className="hover:text-white">aminulislam@eesiiests.org</a>
          </p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Electrical Engineers' Society. Developed by EES Web Team
      </div>
    </footer>
  );
}
