import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <ShoppingBag className="h-6 w-6 text-primary" />
        <span className="sr-only">Artisan Showcase</span>
      </Link>
      <div className="ml-6 flex-1">
        <Link href="/" className="text-lg font-bold font-headline" prefetch={false}>
          Artisan Showcase
        </Link>
      </div>
      <nav className="flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Home
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link
            href="/admin"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Admin
          </Link>
        </Button>
      </nav>
    </header>
  );
}
