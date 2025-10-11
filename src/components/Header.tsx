'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="https://s6.imgcdn.dev/Yscgi0.png" alt="Rosabella Logo" width={40} height={40} />
          <span className="text-lg font-bold font-headline">Rosabella</span>
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
        <Button variant="ghost" size="default" asChild>
          <Link
            href="https://www.facebook.com/profile.php?id=61566020697244"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook page"
            prefetch={false}
          >
            Follow us on Facebook
          </Link>
        </Button>
      </nav>
    </header>
  );
}
