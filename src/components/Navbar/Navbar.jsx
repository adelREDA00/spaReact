import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navMenuRef = useRef(null);

    const handleOpenMenu = () => {
        setIsMenuOpen(true);  // Open the menu and set z-index dynamically
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);  // Close the menu and set z-index dynamically
    };

    return (
        <div className="navbar-section"  >
            <div className="flex justify-between max-w-global mx-auto">
                <Link to={"/"} className="menu-icon">
                    <img src="/assets/images/logonav.svg" id="logo-img" alt="Logo" />
                </Link>
                <Link
                    to="#"
                    aria-label="User"
                    className="menu-icon"
                    onClick={handleOpenMenu}
                >
                    <CiMenuFries className="m-icon" size={24} />
                </Link>
            </div>

            <header className={`header ${isMenuOpen ? "active" : ""}`} id="header">
                <nav className="nav container">
                    <div
                        className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
                        ref={navMenuRef}
                    >
                        <ul className="nav__list">
                            <li className="nav__item">
                                <Link className="nav__link" to="/">Accueil</Link>
                            </li>
                            <li className="nav__item">
                                <Link className="nav__link" to="/Conditions">Conditions Générales</Link>
                            </li>
                            <li className="nav__item">
                                <Link className="nav__link" to="/collections">Retour au Site Principal</Link>
                            </li>
                            <li className="nav__item">
                                <Link className="nav__link" to="/Support">contact</Link>
                            </li>
                        </ul>
                        <div onClick={handleCloseMenu} className="nav__close" id="nav-close">
                            <IoClose id="Io-close" size={24} />
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Navbar;
