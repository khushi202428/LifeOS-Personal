import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useGetEventsByDateQuery } from "../services/eventsApi";

export default function Layout() {
  const location = useLocation();

  
  const hideNavbarRoutes = ["/show-plan"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const today = new Date();
  const dateISO = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0, 0, 0
  ).toISOString();

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: events = [] } = useGetEventsByDateQuery({
    date: dateISO,
    tz: userTimezone,
  });

  const isRoutineCompleted = events.length > 0 && events.every(
    (event) => event.status === "Completed"
  );

  return (
    <>
      {!hideNavbar && <Navbar isRoutineCompleted={isRoutineCompleted} />}
      <Outlet />
    </>
  );
}
