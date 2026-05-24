import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import "../css/app.css";

// createInertiaApp({
//   resolve: (name) => {
//     const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
//     const page = pages[`./Pages/${name}.jsx`];
//     page.default.layout =
//       page.default.layout || ((page) => <Layout children={page} />);
//     return page;
//   },
//   setup({ el, App, props }) {
//     createRoot(el).render(<App {...props} />);
//   },
// });

createInertiaApp({
  layout: (page) => (page.startsWith("Admin/") ? AdminLayout : Layout),
});
