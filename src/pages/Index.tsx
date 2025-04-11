
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import Auth from "@/components/Auth";
import Confetti from "@/components/Confetti";

const Index = () => {
  const { currentUser, events } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti if user just logged in
    if (currentUser && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, showConfetti]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivoryCream to-peachBlush/20">
        <div className="container max-w-6xl py-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-warmBrown">
                  Make gifting <span className="text-dustyRose">magical</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create celebrations, add wishlists, and gift together with friends and family.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button className="gift-btn text-lg py-6 px-8" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white"
                      style={{
                        backgroundImage: `url(https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg)`,
                        backgroundSize: 'cover',
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join thousands creating magical moments
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Auth onComplete={() => setShowConfetti(true)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const yourEvents = events.filter(event => 
    event.creator === currentUser.id || 
    event.participants.includes(currentUser.id)
  );

  return (
    <Layout>
      {showConfetti && <Confetti />}
      
      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-warmBrown">Welcome, {currentUser.name.split(' ')[0]}</h2>
            <Button className="gift-btn" asChild>
              <Link to="/create-event">
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-peachBlush/20">
            <h3 className="text-lg font-medium text-warmBrown mb-3">Your Celebrations</h3>
            {yourEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {yourEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-muted-foreground">
                  No celebrations yet. Create your first event!
                </p>
              </div>
            )}
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-warmBrown">Upcoming Events</h2>
            <Button variant="ghost" size="sm" className="text-dustyRose">
              See all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} size="sm" className="w-[200px]" />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 text-center border border-peachBlush/20">
              <p className="text-muted-foreground">
                No upcoming events. Stay tuned for new celebrations!
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
