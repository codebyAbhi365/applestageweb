import { NavLink } from "react-router-dom";
import { Apple } from "lucide-react"; // Using an icon for the brand

export default function Navbar() {
  // This function helps apply styles conditionally for the active NavLink
  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
      isActive
        ? "bg-[#E06B80] text-white shadow" // Style for the active page link
        : "text-slate-600 hover:bg-rose-100" // Style for inactive links
    }`;

  return (
    // The sticky container ensures the navbar stays at the top on scroll
    <header className="sticky top-0 z-50 p-4">
      <nav className="flex items-center justify-between w-full max-w-md p-2 mx-auto border rounded-full shadow-lg bg-white/70 backdrop-blur-lg border-rose-100">
        {/* Brand/Home Link */}
        <NavLink to="/" className="flex items-center gap-2 pl-4 pr-2 font-bold text-slate-700">
          <Apple size={20} className="text-[#E06B80]" />
          <span>Fruit Doctor</span>
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/apple-visualizer" className={getNavLinkClass}>
            Visualizer
          </NavLink>
          {/* You can add more links here in the future */}
        </div>
      </nav>
    </header>
  );
}