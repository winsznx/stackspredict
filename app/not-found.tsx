import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-muted-foreground mb-6">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                    Return to Home
                </Button>
            </Link>
        </div>
    );
}
