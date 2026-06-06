import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import ModDetails from "@/pages/ModDetails";
import SearchPage from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Upload from "@/pages/Upload";
import Favorites from "@/pages/Favorites";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const FULL_LAYOUT_EXCLUDED = ["/login", "/register"];

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Switch>
      {FULL_LAYOUT_EXCLUDED.map(path => (
        <Route key={path} path={path}>
          {path === "/login" ? <Login /> : <Register />}
        </Route>
      ))}
      <Route>
        <div className="min-h-screen bg-[#050505] flex flex-col">
          <Header
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(o => !o)}
          />
          <div className="flex flex-1 pt-14">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 md:ml-[72px] min-w-0">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/mod/:id" component={ModDetails} />
                  <Route path="/search" component={SearchPage} />
                  <Route path="/upload" component={Upload} />
                  <Route path="/favorites" component={Favorites} />
                  <Route path="/settings" component={Settings} />
                  <Route component={NotFound} />
                </Switch>
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppLayout />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
