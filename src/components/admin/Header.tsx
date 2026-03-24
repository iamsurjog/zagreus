import { Link } from '@tanstack/react-router';

export default function Header({ username }: { username: string }) {
    return (
        <header className="relative flex justify-between bg-linear-to-b from-primary/10 p-0.5 to-transparent to-60%  border-b border-accent">
            <div className="flex">
                <Link
                    to="/admin/eventflow"
                    className="header-link"
                    activeProps={{ className: 'header-link-active' }}
                >
                    Event Flow
                </Link>
                <Link
                    to="/admin/participants"
                    className="header-link"
                    activeProps={{ className: 'header-link-active' }}
                >
                    Participants
                </Link>
                <Link
                    to="/admin/submissions"
                    className="header-link"
                    activeProps={{ className: 'header-link-active' }}
                >
                    Submissions
                </Link>
                <Link
                    to="/admin/missions"
                    className="header-link"
                    activeProps={{ className: 'header-link-active' }}
                >
                    Missions
                </Link>
            </div>
            <img
                src="/Logo.svg"
                className="w-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <div className="relative h-full">
                <Link
                    to="/"
                    className="header-link-active flex items-center justify-center px-4 py-6 h-full uppercase text-lg border border-accent border-dashed
                    hover:cursor-pointer hover:bg-secondary/20 transition-all"
                >
                    {username}
                </Link>
            </div>
        </header>
    );
}
