"use client";

import { useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  useEffect(() => {
    // Proteção contra remoção da badge DMCA
    const checkDMCABadge = () => {
      const badge = document.querySelector(".dmca-badge");
      if (!badge) {
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 30vh; font-size: 1.5rem; color: red;">
            ⚠️ Este site removeu a proteção DMCA e foi desativado.
          </div>
        `;
      }
    };

    // Verifica a badge por até 10 segundos
    const interval = setInterval(checkDMCABadge, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
                SakuraFlix
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Your premier destination for streaming anime. Watch thousands of
              shows and movies in HD quality.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Browse</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Popular
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Help</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Subscription
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SakuraFlix. Todos os direitos
            reservados.
          </p>

          {/* DMCA Badge */}
          <div className="mt-2 flex justify-center">
            <a
              href="https://www.dmca.com/Protection/Status.aspx?ID=68067313-559f-4140-b0d8-f28805f2b1da"
              title="DMCA.com Protection Status"
              className="dmca-badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-06.png?ID=68067313-559f-4140-b0d8-f28805f2b1da"
                alt="DMCA.com Protection Status"
                width={150}
                height={30}
              />
            </a>
          </div>
        </div>
      </div>

      {/* DMCA Script */}
      <Script
        src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"
        strategy="afterInteractive"
      />
    </footer>
  );
}
