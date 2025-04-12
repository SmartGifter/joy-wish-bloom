import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Wallet from "./pages/Wallet";
import BirthdaySavingsIndex from "./pages/BirthdaySavingsIndex";
import BirthdaySavingsPage from "./pages/BirthdaySavingsPage";
import RecurringGiftsIndex from "./pages/RecurringGiftsIndex";
import RecurringGiftsPage from "./pages/RecurringGiftsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/birthday-savings" element={<BirthdaySavingsIndex />} />
            <Route path="/birthday-savings/:recipientId" element={<BirthdaySavingsPage />} />
            <Route path="/recurring-gifts" element={<RecurringGiftsIndex />} />
            <Route path="/recurring-gifts/:recipientId" element={<RecurringGiftsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
