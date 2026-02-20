"use client";

/**
 * Navbar: logo, links (Inicio, Catálogo, Nosotros, Contacto), favoritos, menú móvil.
 * Rutas y items pueden venir de config/backend si se desea menú dinámico.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks";
import { FavoritesOverlay } from "@/components/favorites/favorites-overlay";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const navMotion = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15 },
};

const itemStagger = { delay: 0.03, duration: 0.12 };

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-2 px-1 text-sm font-medium transition-colors duration-150",
        isActive
          ? "text-[var(--brand-orange)]"
          : "text-white hover:text-[var(--brand-orange)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      )}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-orange)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { favoriteCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-[var(--brand-black)] transition-shadow duration-200",
        isScrolled && "shadow-lg"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-14 items-center justify-between md:h-16" aria-label="Principal">
          <Link
            href="/"
            className="relative flex h-10 w-32 flex-shrink-0 items-center md:h-11 md:w-36 lg:h-12 lg:w-40"
            aria-label="Car Advice - Inicio"
          >
            <Image
              src="/logo_navbar.jpg"
              alt="CAR ADVICE"
              fill
              className="object-contain object-left transition-opacity duration-150 hover:opacity-90"
              sizes="(max-width: 768px) 128px, 160px"
              priority
            />
          </Link>

          {/* Desktop: links + separador + corazón al borde derecho */}
          <div className="ml-auto hidden items-center lg:flex">
            <div className="flex items-center gap-6 xl:gap-8">
              {menuItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={isActivePath(pathname, item.href)}
                />
              ))}
            </div>
            <span
              className="ml-6 mr-1 h-5 w-px shrink-0 bg-[var(--brand-gray)]"
              aria-hidden
            />
            <motion.button
              type="button"
              className="relative ml-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-white transition-colors duration-150 hover:bg-white/10 hover:text-[var(--brand-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => setIsFavoritesOpen(true)}
              aria-label="Abrir favoritos"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <Heart className="size-5" />
              {favoriteCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-5 text-white">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Mobile: corazón + hamburguesa, touch targets 48px */}
          <div className="ml-auto flex items-center gap-0 lg:hidden">
            <motion.button
              type="button"
              className="relative flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-lg text-white transition-colors duration-150 hover:bg-white/10 hover:text-[var(--brand-orange)] active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => setIsFavoritesOpen(true)}
              aria-label="Abrir favoritos"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <Heart className="size-5" />
              {favoriteCount > 0 && (
                <span className="absolute right-0 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-5 text-white">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </motion.button>
            <motion.button
              type="button"
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-white transition-colors duration-150 hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <X className="size-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Menu className="size-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="border-t border-[var(--brand-gray)]/50 py-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={navMotion.initial}
                    animate={navMotion.animate}
                    exit={navMotion.exit}
                    transition={{
                      ...navMotion.transition,
                      delay: index * itemStagger.delay,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex min-h-[48px] items-center px-4 py-3 text-base font-medium transition-colors duration-150 active:bg-white/15",
                        isActivePath(pathname, item.href)
                          ? "text-[var(--brand-orange)] bg-white/5"
                          : "text-white hover:bg-white/10 hover:text-[var(--brand-orange)]"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FavoritesOverlay
        open={isFavoritesOpen}
        onOpenChange={setIsFavoritesOpen}
      />
    </header>
  );
}
