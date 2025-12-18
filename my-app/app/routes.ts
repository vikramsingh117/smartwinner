import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("events", "routes/events.tsx"),
  route("admin/events", "routes/admin.events.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
