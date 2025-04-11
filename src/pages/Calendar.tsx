
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Gift } from "lucide-react";
import { EventType, eventTypeIcons } from "@/data/mockData";

const Calendar = () => {
  const { users, events, currentUser } = useApp();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "upcoming">("month");

  // Get birthdays from user data
  const birthdayEvents = users.map(user => {
    if (!user.birthday) return null;
    
    const birthdayDate = new Date(user.birthday);
    const thisYearBirthday = new Date(
      new Date().getFullYear(), 
      birthdayDate.getMonth(), 
      birthdayDate.getDate()
    );
    
    // If birthday has passed this year, show for next year
    if (thisYearBirthday < new Date()) {
      thisYearBirthday.setFullYear(thisYearBirthday.getFullYear() + 1);
    }
    
    return {
      id: `birthday-${user.id}`,
      title: `${user.name}'s Birthday`,
      date: format(thisYearBirthday, "yyyy-MM-dd"),
      type: "birthday" as EventType,
      creator: user.id,
      privacy: "public" as const,
      participants: [user.id, ...(user.friends || [])],
      rsvp: {}
    };
  }).filter(Boolean);

  // Combine regular events with birthday events
  const allEvents = [...events, ...birthdayEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getEventsOnSelectedDate = () => {
    if (!date) return [];
    
    const formattedDate = format(date, "yyyy-MM-dd");
    return allEvents.filter(event => event.date === formattedDate);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return allEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10); // Show only next 10 events
  };

  const getEventDates = () => {
    const dates: Record<string, number> = {};
    
    allEvents.forEach(event => {
      const eventDate = format(new Date(event.date), "yyyy-MM-dd");
      dates[eventDate] = (dates[eventDate] || 0) + 1;
    });
    
    return dates;
  };

  const eventDates = getEventDates();
  const selectedDateEvents = getEventsOnSelectedDate();
  const upcomingEvents = getUpcomingEvents();

  const isDayWithEvent = (day: Date): boolean => {
    const formattedDate = format(day, "yyyy-MM-dd");
    return !!eventDates[formattedDate];
  };

  const renderEvents = (eventsList: typeof allEvents) => {
    return eventsList.map(event => {
      const eventDate = new Date(event.date);
      const eventCreator = users.find(u => u.id === event.creator);
      const isBirthday = event.type === "birthday";
      
      return (
        <Card key={event.id} className="mb-3 overflow-hidden">
          <div className={`h-1.5 w-full ${
            event.type === "birthday" ? "bg-peachBlush" :
            event.type === "wedding" ? "bg-sunsetGold" :
            event.type === "housewarming" ? "bg-mossGreen" : "bg-dustyRose"
          }`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{eventTypeIcons[event.type]}</span>
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {format(eventDate, "EEEE, MMMM d")} {isBirthday ? "(annual)" : ""}
                  </p>
                </div>
              </div>
              
              {eventCreator && (
                <Badge variant="outline" className="text-xs">
                  by {eventCreator.name.split(" ")[0]}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-warmBrown">Calendar</h1>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "upcoming")}>
            <TabsList>
              <TabsTrigger value="month">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Month View
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                <Gift className="h-4 w-4 mr-1" />
                Upcoming
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <Card className="md:col-span-3 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Select a Date</CardTitle>
              <CardDescription>View events for a specific day</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md p-3 pointer-events-auto"
                modifiers={{
                  event: (day) => isDayWithEvent(day)
                }}
                modifiersClassNames={{
                  event: "border-2 border-dustyRose bg-peachBlush/10"
                }}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            {/* Important: We need to wrap TabsContent components inside a Tabs component */}
            <Tabs value={view} className="hidden">
              <TabsContent value="month" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDateEvents.length === 0 
                        ? "No events on this day" 
                        : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDateEvents.length > 0 ? (
                      renderEvents(selectedDateEvents)
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No events scheduled for this date</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>
                      The next {upcomingEvents.length} upcoming events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length > 0 ? (
                      renderEvents(upcomingEvents)
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Gift className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No upcoming events</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Display the actual content based on the selected tab */}
            {view === "month" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateEvents.length === 0 
                      ? "No events on this day" 
                      : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    renderEvents(selectedDateEvents)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No events scheduled for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {view === "upcoming" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    The next {upcomingEvents.length} upcoming events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    renderEvents(upcomingEvents)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gift className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No upcoming events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
