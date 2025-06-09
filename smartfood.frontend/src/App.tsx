
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import ShoppingList from "./pages/ShoppingList";
import Fridge from "./pages/Fridge";
import MealPlan from "./pages/MealPlan";
import Recipes from "./pages/Recipes";
import Reports from "./pages/Reports";
import Family from "./pages/Family";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/family" element={<Family />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
