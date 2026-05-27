import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import "../css/app.css";

createInertiaApp({
  layout: (page) => (page.startsWith("Admin/") ? AdminLayout : Layout),
});
