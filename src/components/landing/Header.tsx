import { Link } from '@tanstack/react-router';

export default function Header() {
    return (
        <header
            className="w-full h-fit flex justify-between items-center
            border-b border-accent bg-linear-to-b from-primary/10 to-transparent to-61%"
        >
            <div className="flex justify-start items-center gap-3">
                <a href="https://terionix.com/" target="_blank">
                    <img src="/terionix.png" alt="Terionix Logo" />
                </a>
                <a href="https://sedsvit.in" target="_blank">
                    <img src="SEDS_Logo.svg" alt="SEDS Logo" />
                </a>
                <a href="https://vit.ac.in/" target="_blank">
                    <img src="VITLogoEmblem.png" alt="VIT Logo" />
                </a>
            </div>

            <div className="flex">
                <a
                    target="_blank"
                    href={
                        'https://yantra.vit.ac.in/events/b881e74c-8cf6-4a86-9379-5ca18dcda6a4'
                    }
                    className="header-link"
                >
                    Register
                </a>
                <Link
                    to="/dashboard"
                    className="header-link"
                    activeProps={{ className: 'header-link-active' }}
                >
                    Dashboard
                </Link>
            </div>
        </header>
    );
}
