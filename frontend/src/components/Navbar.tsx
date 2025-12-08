import { Link, useLocation } from 'react-router-dom';
import { FileText, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 text-black w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">RFP Manager</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/vendors">
              <Button
                variant={isActive('/vendors') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Vendors
              </Button>
            </Link>
          </div>
        </div>

        <Link to="/rfps/create">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create RFP
          </Button>
        </Link>
      </div>
    </nav>
  );
}
