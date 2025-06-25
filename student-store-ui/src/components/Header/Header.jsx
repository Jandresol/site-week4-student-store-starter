import "./Header.css";
import Navbar from "../Navbar/Navbar"; // adjust path if needed

function Header() {
  return (
    <>
      <header className="big-header">
        <div className="big-header-content">
          <h1 className="big-header-title">Earthy Prints</h1>
          <p className="big-header-subtitle">Beautiful prints for your decor needs</p>
        </div>
      </header>
      <Navbar />
    </>
  );
}

export default Header;
