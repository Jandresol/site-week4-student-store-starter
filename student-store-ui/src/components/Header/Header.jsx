import "./Header.css";
import Navbar from "../Navbar/Navbar"; // adjust path if needed

function Header() {
  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Earthy Prints</h1>
          <p className="header-subtitle">Beautiful prints for your decor needs</p>
        </div>
      </header>
      <Navbar />
    </>
  );
}

export default Header;
