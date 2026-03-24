import { Outlet, createFileRoute } from '@tanstack/react-router';
import Header from '@/components/admin/Header';

export const Route = createFileRoute('/admin')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main>
            <Header username="Admin" />
            <Outlet />
        </main>
    );
}
