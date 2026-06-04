import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import { ROUTES } from "../utils/constants";

export const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-5 text-center select-none">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-xl p-10 space-y-6 relative overflow-hidden">
        {/* Editorial border accent top indicator */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />

        <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-muted border border-border rounded-2xl text-accent mb-2">
          <HelpCircle size={28} strokeWidth={2} />
        </div>

        <h1 className="text-4xl font-serif font-black text-text-primary leading-tight">
          Page Not Found
        </h1>

        <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
          The requested page is missing or has been permanently archived by administrative controllers. Let's redirect you back to safety.
        </p>

        <div className="pt-4">
          <Link to={ROUTES.HOME} className="block">
            <Button variant="primary" size="md" className="w-full min-h-[44px]">
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={14} /> Back to Safety
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
