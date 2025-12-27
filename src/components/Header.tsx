'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export function Header() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const generateOrderMessage = () => {
    const header = `*New Order from Rosabella*\n\n`;
    const items = cart.map(item => (
        `*${item.name}*\n` +
        `Quantity: ${item.quantity}\n` +
        `Price: EGP ${item.price.toFixed(2)} each`
    )).join('\n\n');
    const footer = `\n\n*Total Amount: EGP ${total.toFixed(2)}*`;
    const message = header + items + footer;
    return encodeURIComponent(message);
  };
  
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const phoneNumber = '201203141484';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${generateOrderMessage()}`;


  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Image src="/logo.png" alt="Rosabella Logo" width={70} height={70} priority />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
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
            Facebook
          </Link>
        </Button>
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <Separator />
                {cart.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1">
                            <div className="space-y-4 pr-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <Image
                                          src={item.imageUrl}
                                          alt={item.name}
                                          width={64}
                                          height={64}
                                          className="rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">EGP {item.price.toFixed(2)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                                            <Image src="/trash.svg" alt="delete" width={16} height={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator />
                        <div className="mt-auto p-4 space-y-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>EGP {total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-white"
                                asChild
                            >
                                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                  Send Order on WhatsApp
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                        <p className="mt-4 text-lg font-medium">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground">Add some products to get started!</p>
                    </div>
                )}
            </SheetContent>
          </Sheet>
      </nav>
    </header>
  );
}
