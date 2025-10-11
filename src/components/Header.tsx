'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
      <div className="flex-1">
        <Link href="/" className="text-lg font-bold font-headline" prefetch={false}>
          Rosabella
        </Link>
      </div>
      <nav className="flex gap-4 sm:gap-6 items-center">
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Home
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link
            href="https://www.facebook.com/profile.php?id=61566020697244"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook page"
            prefetch={false}
          >
            <Facebook className="h-5 w-5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
