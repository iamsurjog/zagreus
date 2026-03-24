import { Link } from '@tanstack/react-router';

export default function Header() {
    return (
        <header
            className="w-full h-fit flex justify-between items-center
            border-b border-accent bg-linear-to-b from-primary/10 to-transparent to-61%"
        >
            <div className="flex justify-start items-center gap-3">
                <img src="/Yantra_Logo.svg" alt="Yantra Logo" />
                <img src="SEDS_Logo.svg" alt="SEDS Logo" />
            </div>

            <div className="flex">
                <a
                    target="_blank"
                    href={
                        'https://yantra.vit.ac.in/events/b881e74c-8cf6-4a86-9379-5ca18dcda6a4'
                    }
                    className="block w-full h-full p-6 font-bold text-accent
                    bg-radial from-secondary/60 to-secondary/20 uppercase
                    hover:bg-white/5 transition-all"
                >
                    Register
                </a>
                <Link
                    to="/dashboard"
                    className="w-full h-full p-6 font-bold text-accent
                    bg-radial from-secondary/60 to-secondary/20 uppercase
                    hover:bg-white/5 transition-all"
                >
                    Dashboard
                </Link>
            </div>
        </header>
    );
}
