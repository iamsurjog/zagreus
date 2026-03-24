import { Outlet, createFileRoute } from '@tanstack/react-router';
import Header from '@/components/participant/Header';

export const Route = createFileRoute('/_participant')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main className="h-screen flex flex-col">
            <Header username="Demo User" />
            <div className="grow">
                <Outlet />
            </div>
        </main>
    );
}
