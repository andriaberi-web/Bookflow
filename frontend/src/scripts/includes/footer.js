import { useEffect, useState } from 'react';
import { getInfo } from '../helpers/api';
import { useSettings } from '../helpers/settings';

const ENGINE_URL = 'https://github.com/andriaberi/PDF2EPUB';

function Footer() {
    const { t } = useSettings();
    const [engine, setEngine] = useState('');

    useEffect(() => {
        // A development install's version ends in +g<commit>; the part before is enough.
        getInfo().then((info) => setEngine((info.engine || '').split('+')[0])).catch(() => {});
    }, []);

    return (
        <footer className="bf-footer">
            <div className="container bf-footer-inner small">
                { t.footer.uses } <a href={ ENGINE_URL }>PDF2EPUB</a>{ engine && ` ${engine}` }
            </div>
        </footer>
    );
}

export default Footer;
