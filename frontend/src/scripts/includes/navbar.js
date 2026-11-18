import { Link } from 'react-router-dom';
import { useSettings } from '../helpers/settings';
import { LogoMark, Moon, Sun } from './icons';

function Navbar() {
    const { t, theme, toggleTheme } = useSettings();
    const dark = theme === 'dark';

    return (
        <header className="bf-navbar">
            <nav className="container bf-navbar-inner" aria-label="Main">
                <Link to="/convert" className="bf-brand">
                    <span className="bf-brand-mark"><LogoMark size={ 18 } /></span>
                    Bookflow
                </Link>
                <button type="button" className="bf-icon-btn ms-auto" aria-label={ dark ? t.nav.toLight : t.nav.toDark } onClick={ toggleTheme }>
                    { dark ? <Sun size={ 18 } /> : <Moon size={ 18 } /> }
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
