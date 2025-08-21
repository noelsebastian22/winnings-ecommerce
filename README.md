# Angular 20 E-commerce Sample

A feature-complete sample e-commerce app built with **Angular 20** and **NgRx 20**, showcasing the framework’s latest capabilities while demonstrating practical patterns for state management, component design, and modern developer tooling.

---

## 🛍️ Core Features

- **Home & Product Listing Pages**
  Route-based navigation (`/home`, `/products`) powered by Angular’s standalone router.

- **Add to Cart with Dialog**
  Clicking **Add to Cart** opens a modal, dispatches an NgRx action, and updates the cart state.

- **Live Cart Totals in the Header**
  Header component converts store selectors to **signals** and displays current cart count / value.

- **Persistent State**
  `ngrx-store-localstorage` meta-reducer rehydrates cart and product data across sessions.

- **Sample Data**
  Product catalog served from `public/products.json` for easy demos and testing.

---

## ✨ Angular 20 Goodness

- **Standalone Architecture** – `ApplicationConfig` bootstrap, no `AppModule`.
- **Signal-based Reactivity** – `signal`, `computed`, and `toSignal` used across components/services.
- **Built-in Control Flow** – `@if` / `@for` templates and deferred views.
- **Zone-less Ready** – opt-in `provideZoneChangeDetection` for future performance gains.
- **Typed NgRx 20 Store** – feature slices, effects, and selectors with local-storage sync.

---

## 🧰 Tooling & DX

- **Testing** – Jest unit tests and Playwright E2E (navigation, user journey, performance).
- **HTTP & Error Handling** – resource abstraction, loading/error interceptors, global error handler.
- **Code Quality** – ESLint, Prettier, Husky, lint-staged, and a Conventional Commit validator.

---

## 🚀 Getting Started

```bash
npm install
npm run start
```

The dev server runs at **[http://localhost:4200/](http://localhost:4200/)** by default.

---

## 📂 Key Structure

```text
src/
├── app/
│   ├── core/            # Global services, HTTP interceptors, NgRx helpers
│   ├── features/        # Feature components (home, products, add-to-cart)
│   ├── infrastructure/  # Resource abstractions & models
│   ├── shared/          # Header, spinner, utilities
│   └── store/           # Root reducers & meta-reducers
├── public/              # Static assets (products.json, favicon)
└── styles/              # Global SCSS
```

---

## 📝 License

MIT

Built with ❤️ using **Angular 20**.
