import Link from "next/link";
import { Container } from "./Container";
import {
  footerCategoryLinks,
  footerShopLinks,
  footerSupportLinks,
} from "@/constants/navigation";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border bg-text-strong text-white">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr] lg:py-16">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
                F
              </div>
              <span className="heading-4 text-white">FitLoop</span>
            </Link>

            <p className="body-2 mt-4 text-white/70">
              A modern activewear marketplace for discovering, buying, and
              selling sports clothing, sneakers, and accessories.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand"
                aria-label="Instagram"
              >
                {/* <Instagram size={18} /> */}
              </Link>

              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand"
                aria-label="Twitter"
              >
                {/* <Twitter size={18} /> */}
              </Link>

              <Link
                href="#"
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand"
                aria-label="YouTube"
              >
                {/* <Youtube size={18} /> */}
              </Link>
            </div>
          </div>

          <FooterColumn title="Shop" links={footerShopLinks} />
          <FooterColumn title="Categories" links={footerCategoryLinks} />
          <FooterColumn title="Support" links={footerSupportLinks} />
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="caption text-white/60">
            © {currentYear} FitLoop. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="caption text-white/60 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="caption text-white/60 transition hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="subtitle-2 text-white">{title}</h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="body-2 text-white/65 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
