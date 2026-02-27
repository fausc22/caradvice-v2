"use client";

/**
 * Navbar: logo, links (Inicio, Catálogo, Nosotros, Contacto), favoritos, menú móvil.
 * Rutas y items pueden venir de config/backend si se desea menú dinámico.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Menu, User, X } from "lucide-react";
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
  transparent,
}: {
  href: string;
  label: string;
  isActive: boolean;
  transparent: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-2 px-1 text-sm font-medium transition-colors duration-200",
        transparent
          ? isActive
            ? "text-[var(--brand-orange)]"
            : "text-white/95 hover:text-white"
          : isActive
            ? "text-[var(--brand-orange)]"
            : "text-white/95 hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2",
        transparent ? "focus-visible:ring-offset-black/40" : "focus-visible:ring-offset-[var(--brand-black)]"
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

  const transparent = false;
  const iconClass = transparent
    ? "text-white/95 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:ring-offset-black/30"
    : "text-white/95 transition-colors duration-200 hover:bg-white/10 hover:text-[var(--brand-orange)] focus-visible:ring-offset-[var(--brand-black)]";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow] duration-300",
        transparent ? "bg-transparent" : "bg-[var(--brand-black)] shadow-sm"
      )}
    >
      <div className="mx-auto w-full max-w-[1920px] pl-4 pr-4 sm:pl-5 sm:pr-5 lg:pl-6 lg:pr-6">
        <nav
          className="relative flex h-12 items-center sm:h-14"
          aria-label="Principal"
        >
          {/* Logo: pegado a la izquierda */}
          <Link
            href="/"
            className="relative z-10 flex h-8 w-24 flex-shrink-0 items-center sm:h-9 sm:w-28 md:h-10 md:w-32"
            aria-label="Car Advice - Inicio"
          >
            <Image
              src="/logo_navbar.jpg"
              alt="CAR ADVICE"
              fill
              className="object-contain object-left transition-opacity duration-150 hover:opacity-90"
              sizes="(max-width: 768px) 112px, 144px"
              priority
            />
          </Link>

          {/* Desktop: navegación centrada (absolute para centrado real) */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center lg:flex">
            <div className="flex items-center gap-6 xl:gap-8">
              {menuItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={isActivePath(pathname, item.href)}
                  transparent={transparent}
                />
              ))}
            </div>
          </div>

          {/* Derecha: corazón + usuario (desktop) */}
          <div className="ml-auto flex items-center gap-0.5">
            <motion.button
              type="button"
              className={cn(
                "relative hidden size-10 shrink-0 items-center justify-center lg:flex",
                iconClass,
                "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
              )}
              onClick={() => setIsFavoritesOpen(true)}
              aria-label="Abrir favoritos"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <Heart className="size-5" />
              {favoriteCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-5 text-white">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </motion.button>
            <motion.button
              type="button"
              className={cn(
                "hidden size-10 shrink-0 items-center justify-center lg:flex",
                iconClass,
                "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
              )}
              aria-label="Iniciar sesión (próximamente)"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <User className="size-5" />
            </motion.button>
          </div>

          {/* Mobile: corazón + usuario + hamburguesa, touch 48px */}
          <div className="ml-auto flex items-center gap-0 lg:hidden">
            <motion.button
              type="button"
              className={cn(
                "relative flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center",
                iconClass,
                "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2"
              )}
              onClick={() => setIsFavoritesOpen(true)}
              aria-label="Abrir favoritos"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <Heart className="size-5" />
              {favoriteCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-5 text-white">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </motion.button>
            <motion.button
              type="button"
              className={cn(
                "flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center",
                iconClass,
                "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2"
              )}
              aria-label="Iniciar sesión (próximamente)"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <User className="size-5" />
            </motion.button>
            <motion.button
              type="button"
              className={cn(
                "flex min-h-[48px] min-w-[48px] items-center justify-center",
                iconClass,
                "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2"
              )}
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
              <div
                className={cn(
                  "border-t py-2",
                  transparent
                    ? "border-white/20 bg-black/85 backdrop-blur-sm"
                    : "border-white/10 bg-[var(--brand-black)]"
                )}
              >
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
                        "flex min-h-[48px] items-center px-4 py-3 text-base font-medium transition-colors duration-150 active:bg-white/5",
                        transparent
                          ? isActivePath(pathname, item.href)
                            ? "text-[var(--brand-orange)] bg-white/5"
                            : "text-white hover:bg-white/10 hover:text-[var(--brand-orange)]"
                          : isActivePath(pathname, item.href)
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
