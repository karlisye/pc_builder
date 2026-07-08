import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { useParams, ServerRouter, Navigate, Link, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, useRouteError, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, data, useLocation, useNavigate, useSearchParams, useRouteLoaderData, useLoaderData } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { initReactI18next, I18nextProvider, useTranslation, Trans } from "react-i18next";
import { isbot } from "isbot";
import { createInstance } from "i18next";
import React, { createContext, useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
const appName$1 = "BUILDER";
const loading$1 = "Loading...";
const error$1 = "Something went wrong";
const save$1 = "Save";
const cancel$1 = "Cancel";
const edit$1 = "Edit";
const close$1 = "Close";
const yes$1 = "Yes";
const no$1 = "No";
const next$1 = "Next";
const previous$1 = "Previous";
const page$1 = "Page {{current}} of {{total}}";
const verifyEmail$1 = { "banner": "Verify your email to unlock build generation and saving.", "resend": "Resend email", "resendSuccess": "Verification email sent.", "resendError": "Could not resend verification email.", "gatedAction": "Please verify your email before doing this.", "verifiedTitle": "Email verified", "verifiedText": "Your email address has been verified.", "backHome": "Back to home" };
const components$3 = { "cpu": "CPU", "motherboard": "Motherboard", "ram": "RAM", "gpu": "GPU", "ssd": "SSD", "hdd": "HDD", "case": "Case", "cooler": "Cooler", "psu": "PSU", "fan": "Fan" };
const stockStatus$1 = { "in_stock": "In Stock", "orderable": "Can Be Ordered", "out_of_stock": "Out Of Stock" };
const fieldLabels$1 = { "name": "Name", "type": "Type", "price": "Price", "stock_status": "Stock Status", "stock_quantity": "Stock Quantity", "socket": "Socket", "cores": "Cores", "threads": "Threads", "clock_rate": "Base Clock", "turbo_frequency": "Turbo Frequency", "tdp": "TDP", "integrated_graphics": "Integrated Graphics", "cooler_included": "Cooler Included", "passmark": "Passmark Score", "chipset": "Chipset", "form_factor": "Form Factor", "memory_type": "Memory Type", "memory_slots": "Memory Slots", "memory_max_speed": "Max Memory Speed", "m2_slots": "M.2 Slots", "sata_ports": "SATA Ports", "wifi": "Wi-Fi", "gpu_model": "GPU Model", "vram": "VRAM", "cuda": "CUDA Cores", "bus": "Memory Bus", "vram_freq": "VRAM Frequency", "min_psu": "Minimum PSU Wattage", "pcie_version": "PCIe Version", "length_mm": "Length (mm)", "power_connectors": "Power Connectors", "capacity": "Capacity", "interface": "Interface", "read_speed": "Read Speed", "write_speed": "Write Speed", "max_gpu_length": "Max GPU Length", "max_cpu_cooler_height": "Max CPU Cooler Height", "bays_25": '2.5" Bays', "bays_35": '3.5" Bays', "psu_wattage": "Max PSU Wattage", "size_mm": "Size (mm)", "connector": "Connector", "rpm_max": "Max RPM", "units_in_package": "Units In Package", "wattage": "Wattage", "efficiency_rating": "Efficiency Rating", "psu_type": "PSU Type", "modular": "Modular", "fan_size_mm": "Fan Size (mm)", "pcie_connectors": "PCIe Connectors", "sata_connectors": "SATA Connectors", "compatibility": "Compatibility", "tdp_support": "TDP Support", "height_mm": "Height (mm)", "frequency": "Frequency", "cl_latency": "CL Latency", "modules_count": "Module Count", "ean": "EAN", "brand": "Brand", "max_memory_capacity": "Max Memory Capacity", "voltage": "Voltage", "xmp": "XMP Support", "vram_type": "VRAM Type", "gpu_family": "GPU Family", "nand_type": "NAND Type", "tbw": "Endurance (TBW)", "random_read_iops": "Random Read IOPS", "random_write_iops": "Random Write IOPS", "rpm": "RPM", "cache_mb": "Cache (MB)", "psu_included": "PSU Included", "fans_included": "Fans Included", "max_psu_length": "Max PSU Length (mm)", "max_radiator_size": "Max Radiator Size (mm)", "rgb_type": "RGB Type", "led_color": "LED Color", "noise_max_db": "Max Noise (dB)", "rpm_min": "Min RPM", "amps_12v": "+12V Rail (A)", "pcie_5": "PCIe 5.0/5.1 Support", "cpu_connectors": "CPU Connectors", "fan_count": "Fan Count" };
const enCommon = {
  appName: appName$1,
  loading: loading$1,
  error: error$1,
  save: save$1,
  cancel: cancel$1,
  "delete": "Delete",
  edit: edit$1,
  close: close$1,
  yes: yes$1,
  no: no$1,
  next: next$1,
  previous: previous$1,
  page: page$1,
  verifyEmail: verifyEmail$1,
  components: components$3,
  stockStatus: stockStatus$1,
  fieldLabels: fieldLabels$1
};
const nav$1 = { "build": "Build", "saved": "Saved", "guide": "Guide", "profile": "Profile", "signIn": "Sign In", "signOut": "Sign Out", "hello": "Hello, {{name}}" };
const footer$1 = { "tagline": "Build and share your PC." };
const enLayout = {
  nav: nav$1,
  footer: footer$1
};
const common$1 = { "emailLabel": "Email", "passwordLabel": "Password", "emailRequired": "Email is required.", "emailInvalid": "Please enter a valid email address.", "passwordRequired": "Password is required.", "passwordMinLength": "Password must be at least 8 characters.", "passwordComplexity": "Password must contain uppercase, lowercase, a number, and a symbol." };
const login$2 = { "title": "Sign In", "createAccount": "Create an account", "submit": "Sign In", "heroText": "PC BUILDER" };
const register$2 = { "title": "Sign Up", "nameLabel": "Name", "nameRequired": "Name is required.", "nameMinLength": "Name must be at least 3 characters.", "confirmPasswordLabel": "Confirm password", "confirmPasswordRequired": "Please confirm your password.", "passwordsDoNotMatch": "Passwords do not match.", "alreadyHaveAccount": "Already have an account?", "submit": "Sign Up", "heroText": "START BUILDING" };
const enAuth = {
  common: common$1,
  login: login$2,
  register: register$2
};
const sidePanel$1 = { "title": "BUILDER", "newBuild": "New Build", "guideHint": "Unsure where to start? Head on over to the", "guideLink": "guide", "loadBuildError": "Failed to load build" };
const budgetSlider$1 = { "anyBudget": "Any Budget", "totalBudget": "Total Budget", "remainingBudget": "Remaining Budget" };
const componentCard$1 = { "stores": "Stores", "moreStores": "+{{count}} stores", "inStockWithQty": "In Stock ({{count}})", "orderableWithQty": "Can be ordered ({{count}})", "orderable": "Can be ordered", "outOfStock": "Out of Stock", "inStock": "Available", "seeInStore": "See in store", "remove": "Remove", "replace": "Replace", "startingFrom": "Starting from €{{price}}", "more": "More", "availabilityTitle": "Availability", "lastScraped": "Last checked: {{date}}", "neverScraped": "Last checked: never", "checkManually": "Missing spec data — please check this fits manually" };
const componentPopup$1 = { "required": "Required", "optional": "Optional", "ram": { "fullName": "Random Access Memory", "description": "Short-term working memory. Holds data the CPU is actively using." }, "gpu": { "fullName": "Graphics Processing Unit", "description": "Renders graphics and visuals. Handles parallel processing tasks." }, "psu": { "fullName": "Power Supply Unit", "description": "Converts wall power into voltages the components need." }, "ssd": { "fullName": "Solid State Drive", "description": "Fast permanent storage. Loads your OS and apps quickly." }, "hdd": { "fullName": "Hard Disk Drive", "description": "Optional large, slower storage. Good for bulk files and backups." }, "case": { "fullName": "Computer Case", "description": "Houses and protects all components, and manages airflow." }, "fan": { "fullName": "Case Fan", "description": "Moves air through the case to prevent heat buildup." }, "cooler": { "fullName": "CPU Cooler", "description": "Sits on the CPU and pulls heat away from it." }, "cpu": { "fullName": "Central Processing Unit", "description": "The brain. Executes all instructions and runs your software." }, "motherboard": { "fullName": "Motherboard", "description": "The backbone. Connects and lets all components communicate." } };
const addComponent$1 = { "title": "Add {{component}}", "failedToFetch": "Failed to fetch components", "noComponentsFound": "No Components Found", "tryAdjustingFilters": "Try adjusting your filters", "includedInCase": "Included in case", "outOfStock": "Out Of Stock", "notCompatible": "Not Compatible", "caseIncludesPsu": "Case includes PSU", "select": "Select", "startingFrom": "Starting from €{{price}}", "viewDetails": "Full details" };
const componentFilters$1 = { "searchPlaceholder": "Search {{component}}...", "sort": { "recommended": "Recommended", "priceAsc": "Price: Low to High", "priceDesc": "Price: High to Low", "nameAsc": "Name: A to Z", "nameDesc": "Name: Z to A" }, "price": "Price (€)", "minPrice": "Min price (€)", "maxPrice": "Max price (€)", "failedToFetchFilters": "Failed to fetch filters", "all": "All", "yes": "Yes", "no": "No", "display": "Display", "inStock": "In Stock", "canBeOrdered": "Can Be Ordered", "compatibleOnly": "Compatible Only", "clearFilters": "Clear Filters", "labels": { "brand": "Brand", "socket": "Socket", "cores": "Cores", "integrated_graphics": "Integrated Graphics", "cooler_included": "Cooler Included", "chipset": "Chipset", "form_factor": "Form Factor", "memory_type": "Memory Type", "wifi": "WiFi", "capacity": "Capacity (GB)", "frequency": "Frequency (MHz)", "vram": "VRAM (GB)", "min_psu": "Min PSU Req (W)", "tdp_support": "Min TDP Support (W)", "wattage": "Min Wattage (W)", "efficiency_rating": "Efficiency Rating", "modular": "Modular", "psu_type": "PSU Type", "pcie_5": "PCIe 5.0 Connector", "modules_count": "Kit Size", "xmp": "XMP/EXPO", "gpu_family": "GPU Brand", "type": "Type", "interface": "Interface", "fan_size_mm": "Fan Size (mm)", "size_mm": "Size (mm)", "units_in_package": "Pack Size", "psu_included": "PSU Included" } };
const buildDesc$1 = { "currentlyEditing": 'Currently editing "{{name}}"', "total": "Total", "components": "Components", "compatibility": "Compatibility", "validateFailed": "Couldn't verify compatibility right now — the results shown may be outdated.", "aboutThisBuild": "About This Build", "fullyFunctionalNote": "Your build is fully functional. These are just recommendations to get the best experience." };
const buildGenerator$1 = { "title": "Auto Generate Build", "intro": "Not sure where to start? Let us pick the best compatible components for your budget. For more information visit", "guideLink": "Automatic Builder", "guideSuffix": "guide .", "recommendBudgetIncrease": "We recommend increasing your budget for this type of build.", "preferences": "Preferences", "gpu": "GPU", "cpu": "CPU", "usage": "Usage", "any": "Any", "nvidia": "NVIDIA", "amd": "AMD", "intel": "INTEL", "gaming": "Gaming", "office": "Office", "rendering": "Rendering", "streaming": "Streaming", "includeOnlyOrderable": "Include Only Orderable Items", "somethingWentWrong": "Something went wrong", "incompatibleWarning": "One or more components in your current build are incompatible. Please change or remove them to generate.", "manualCheckWarning": "One or more selected components are missing spec data needed to verify fit. Please replace or remove them to generate.", "generating": "Generating...", "generate": "Generate", "generateSuccess": "Build generated successfully", "loginRequired": "Sign in to use the automatic build generator.", "loginLink": "Log in" };
const componentGenerator$1 = { "title": "Auto Generate Component", "intro": "Not sure what component to choose? Let us pick the best compatible component for your budget. For more information visit", "guideLink": "Automatic Builder", "guideSuffix": "guide .", "preferences": "Preferences", "cpu": "CPU", "gpu": "GPU", "any": "Any", "nvidia": "NVIDIA", "amd": "AMD", "intel": "INTEL", "includeOnlyOrderable": "Include Only Orderable Items", "somethingWentWrong": "Something went wrong", "incompatibleWarning": "One or more components in your current build are incompatible. Please change or remove them to generate.", "manualCheckWarning": "One or more selected components are missing spec data needed to verify fit. Please replace or remove them to generate.", "generating": "Generating...", "generate": "Generate", "generateSuccess": "Component generated successfully", "loginRequired": "Sign in to use the automatic component generator.", "loginLink": "Log in" };
const buildInfo$1 = { "selectComponents": "Select your components", "enterBuildName": "Please enter a build name", "selectAtLeastOne": "Please select at least one component", "savedAsNew": "Saved as new build!", "savedSuccessfully": "Build saved successfully", "failedToSave": "Failed to save build", "nameLabel": "Name", "namePlaceholder": "build name...", "notesLabel": "Notes", "notesPlaceholder": "build notes...", "buildTypeLabel": "Build Type", "none": "None", "gaming": "Gaming", "office": "Office", "rendering": "Rendering", "streaming": "Streaming", "saving": "Saving...", "saveBuild": "Save Build", "clearBuild": "Clear Build", "saveAsNewBuild": "Save as New Build", "loginToSave": "Sign in to save your build.", "loginLink": "Log in", "restoredNudge": "We restored your in-progress build. Save it now to keep it on your account." };
const enBuilder = {
  sidePanel: sidePanel$1,
  budgetSlider: budgetSlider$1,
  componentCard: componentCard$1,
  componentPopup: componentPopup$1,
  addComponent: addComponent$1,
  componentFilters: componentFilters$1,
  buildDesc: buildDesc$1,
  buildGenerator: buildGenerator$1,
  componentGenerator: componentGenerator$1,
  buildInfo: buildInfo$1
};
const accountSettings$1 = { "heading": "Account Settings", "personalInfoHeading": "Personal Information", "nameLabel": "Name", "emailLabel": "Email", "emailVerified": "Verified", "emailNotVerified": "Not verified", "nameTooShort": "Name field must contain at least 3 letters", "infoUpdated": "Information updated", "infoUpdateError": "Failed to save personal information", "save": "Save", "edit": "Edit", "cancel": "Cancel", "changePasswordHeading": "Change Password", "oldPasswordLabel": "Old Password", "newPasswordLabel": "New Password", "confirmNewPasswordLabel": "Confirm New Password", "passwordUpdated": "Password updated", "passwordUpdateError": "Failed to save Password", "deleteAccountHeading": "Delete my account", "deleteAccountButton": "Delete my account", "deleteConfirmTitle": "Are you sure you want to delete your account?", "deleteConfirmSubtitle": "This action is permanent and cannot be undone", "deleteConfirmInstruction": "Please type", "deleteConfirmInstructionSuffix": "to confirm", "deleteConfirmKeyword": "delete-my-account", "deleteConfirmIncorrect": "Delete confirmation is incorrect", "delete": "Delete", "cancelDelete": "Cancel" };
const enProfile = {
  accountSettings: accountSettings$1
};
const seo$1 = { "home": { "title": "PC Builder — Build Your PC Online | Latvia", "description": "Build and compare PCs using real components from the Latvian market, with live pricing and automatic compatibility checks." }, "builder": { "title": "PC Builder — Build Your PC", "description": "Pick components or generate a build automatically within your budget, with real-time compatibility checks and live Latvian store pricing." }, "guide": { "title": "Guide — PC Builder", "description": "Learn how to build a PC, use the automatic builder, and manage your saved builds." }, "login": { "title": "Sign In — PC Builder", "description": "Sign in to your PC Builder account to save and manage your builds." }, "register": { "title": "Sign Up — PC Builder", "description": "Create a free PC Builder account to save your builds and access the automatic builder." }, "savedBuilds": { "title": "Saved Builds — PC Builder" }, "notFound": { "title": "Page Not Found — PC Builder" }, "picker": { "cpu": { "title": "CPU Prices in Latvia — Pick a Processor | PC Builder", "description": "Browse processors with live prices from Latvian stores. Filter by socket, cores and price, with automatic compatibility checks for your build." }, "motherboard": { "title": "Motherboard Prices in Latvia | PC Builder", "description": "Browse motherboards with live prices from Latvian stores. Filter by socket, chipset and form factor, with automatic compatibility checks." }, "ram": { "title": "RAM Prices in Latvia — DDR4 & DDR5 | PC Builder", "description": "Browse memory kits with live prices from Latvian stores. Filter by type, capacity and speed, with automatic compatibility checks." }, "gpu": { "title": "Graphics Card (GPU) Prices in Latvia | PC Builder", "description": "Browse graphics cards with live prices from Latvian stores. Filter by brand, VRAM and price, with automatic compatibility checks." }, "psu": { "title": "Power Supply (PSU) Prices in Latvia | PC Builder", "description": "Browse power supplies with live prices from Latvian stores. Filter by wattage, efficiency and modularity, with automatic compatibility checks." }, "ssd": { "title": "SSD Prices in Latvia | PC Builder", "description": "Browse solid state drives with live prices from Latvian stores. Filter by capacity, type and interface, with automatic compatibility checks." }, "hdd": { "title": "Hard Drive (HDD) Prices in Latvia | PC Builder", "description": "Browse hard drives with live prices from Latvian stores. Filter by capacity and interface, with automatic compatibility checks." }, "case": { "title": "PC Case Prices in Latvia | PC Builder", "description": "Browse PC cases with live prices from Latvian stores. Filter by form factor, with automatic compatibility checks for your components." }, "cooler": { "title": "CPU Cooler Prices in Latvia | PC Builder", "description": "Browse CPU coolers with live prices from Latvian stores. Filter by TDP support and fan size, with automatic compatibility checks." }, "fan": { "title": "Case Fan Prices in Latvia | PC Builder", "description": "Browse case fans with live prices from Latvian stores. Filter by size and pack count, with automatic compatibility checks." } }, "componentDetail": { "title": "{{name}} — Price in Latvia | PC Builder", "description": "Compare prices and availability for {{name}} across Latvian stores and check compatibility with your PC build." } };
const home$1 = { "build": { "title": "BUILD YOUR PC", "description": "Design your PC using our simple builder. Choose from components available in the Latvian market, all with live, accurate pricing." }, "auto": { "title": "MAKE THE BUILDING EASY", "description": "Automatically complete your build at any stage using our smart auto-builder." } };
const guide$1 = { "sidePanelTitle": "GUIDE", "sections": { "builder": "Building a PC", "auto": "Automatic Builder", "saved": "Managing Saved Builds" } };
const guides$1 = { "note": { "label": "Note:" }, "builderSection": { "title": "Building Your First PC", "selectingComponentsHeading": "Selecting Components", "step1": "1. Go to the <buildLink>Build</buildLink> page by clicking the <buildButton>Build</buildButton> button in the navigation bar.", "step2": "2. Find the component list section and click the <addButton></addButton> button to add a new component.", "step3": "3. Use the search bar and filters to browse and find components that match your preferences.", "step3Note": 'Incompatible components will be marked with an "Incompatible" flag.', "step4": "4. Select a component from the list and click <selectText>Select</selectText> to add it to your build. It will then appear in the build info panel and the component list.", "step4Note": "You can remove a component or view it in the store using the buttons at the bottom of the component card.", "step5": "5. Repeat these steps until your build is complete.", "savingHeading": "Saving Your Build", "step6": "6. Make sure to name your build and add the optional notes by filling out their fields.", "step7": "7. Once you’ve selected all your components and named your build, click the <saveButtonText>Save Build</saveButtonText> button in the build info panel.", "step7Note": "You can clear the entire build or remove individual components by clicking the Clear Build button or pressing the <closeIcon></closeIcon> icon next to each component." }, "autoSection": { "title": "Using the Automatic Builder", "selectingComponentsHeading": "Selecting Components", "step1": "1. Optionally, start by adding any components you want included in your build. You can also use the automatic component generator under the filters to find a compatable component automatically.", "step1Note": "This step is optional. You can skip it to generate a fully automatic build.", "selectingBudgetHeading": "Selecting a Budget", "step2": "2. Scroll to the bottom of the build information panel and select the <autoBuilderText>Auto Builder</autoBuilderText> option.", "step3": "3. Set your budget using the slider, or choose the unlimited budget option to get the best possible components.", "step3Note": "The budget applies to the entire build. If you have already selected components, their cost will be deducted from your available budget.", "step4": "4. Set your preferences for GPU, CPU and Usage type under the budget slider.", "step4Note": 'Make sure to check the "Include Orderable Items" to also use components that are not in store, but can be ordered.', "generatingHeading": "Generating the Build", "step5": "5. Once your budget is set, click the generate button to automatically complete your build.", "step5Note": "Budget also affects component allocation. For example, lower-budget builds (e.g. under 500€) may exclude a GPU and instead select a CPU with integrated graphics. The same applies to components like CPU coolers. <link>See all budget allocations below</link>.", "step6": "6. After generating a build we recommend checking the compatability for the build manually before purchasing any of the items.", "step6Note": "The HDD component is not automatically included, as it is optional. If the CPU comes with a built-in cooler and the budget is limited, a separate CPU cooler may also be treated as optional.", "budgetAllocationsHeading": "Budget Allocations", "table": { "component": "Component", "budgetLow": "Budget (<500€)", "budgetMid": "Mid (500–1500€)", "budgetHigh": "High-end (>1500€)", "general": "General", "office": "Office", "gaming": "Gaming", "streaming": "Streaming", "rendering": "Rendering", "gpu": "GPU", "cpu": "CPU", "motherboard": "Motherboard", "ram": "RAM", "cooler": "Cooler", "case": "Case", "psu": "PSU", "ssd": "SSD" } }, "savedSection": { "title": "Managing Your Saved Builds", "viewingBuildsHeading": "Viewing Your Saved Builds", "step1": "1. Go to the <savedLink>Saved</savedLink> page by clicking the <savedButton>Saved</savedButton> button in the navigation bar.", "step2": "2. Locate the build list and select the build you want to view.", "viewingComponentsHeading": "Viewing Build Components", "step3": "3. Click on any component to view its details and description below.", "step4": "4. To view a component in store, click the <seeInStore>See In Store</seeInStore> button in the description or the <buy>Buy</buy> button next to the component in the list.", "editingHeading": "Editing Build Information", "editStep1": "1. Click the <edit>Edit</edit> button next to your build name.", "editStep2": "2. Update the fields as needed. You can leave the notes field empty if you prefer.", "editStep3": "3. Click <save>Save</save> to apply your changes or <cancel>Cancel</cancel> to discard them.", "continuingHeading": "Continuing the Build", "continueStep1": "1. Click the <continueBuild>Continue Build</continueBuild> button to resume editing your build from where you left off. You will be redirected to the build page with your current configuration.", "deletingHeading": "Deleting a Build", "deleteStep1": "1. Click the <deleteBuild>Delete Build</deleteBuild> button (or the delete option in the build info panel) to remove the selected build.", "deleteStep2": "2. A confirmation popup will appear. Confirm to permanently delete the build." } };
const savedBuilds$1 = { "sidePanelTitle": "SAVED BUILDS", "noSavedBuilds": "You have no saved builds yet.", "delete": "Delete", "loading": "Loading...", "selectBuildPrompt": "Select a build to view details.", "notesPlaceholder": "Notes", "save": "Save", "cancel": "Cancel", "edit": "Edit", "continueBuild": "Continue Build", "buy": "Buy", "deleteConfirmTitle": "Are you sure you want to delete this build?", "deleteError": "Failed to delete build", "share": "Share", "unshare": "Disable sharing", "copyLink": "Copy link", "shareLinkCopied": "Share link copied to clipboard", "unshared": "Build is no longer shared", "shareError": "Failed to update sharing settings", "slotLabels": { "cpu": "CPU", "motherboard": "Motherboard", "ram": "RAM", "gpu": "GPU", "ssd": "SSD", "hdd": "HDD", "pc_case": "Case", "cooler": "Cooler", "psu": "PSU", "fan": "Fan" } };
const notFound$2 = { "heading": "Page not found.", "description": "The page you're looking for doesn't exist.", "goHome": "Go back home" };
const components$2 = { "buildCard": { "compatibilityIssues": "Compatibility Issues" }, "sidePanel": { "brand": "PC BUILDER" } };
const enPages = {
  seo: seo$1,
  home: home$1,
  guide: guide$1,
  guides: guides$1,
  savedBuilds: savedBuilds$1,
  notFound: notFound$2,
  components: components$2
};
const appName = "BUILDER";
const loading = "Ielādē...";
const error = "Kaut kas nogāja greizi";
const save = "Saglabāt";
const cancel = "Atcelt";
const edit = "Redzēt";
const close = "Aizvērt";
const yes = "Jā";
const no = "Nē";
const next = "Tālāk";
const previous = "Atpakaļ";
const page = "{{current}}. lapa no {{total}}";
const verifyEmail = { "banner": "Apstipriniet savu e-pastu, lai atbloķētu konfigurācijas ģenerēšanu un saglabāšanu.", "resend": "Nosūtīt vēlreiz", "resendSuccess": "Apstiprināšanas e-pasts nosūtīts.", "resendError": "Neizdevās nosūtīt apstiprināšanas e-pastu.", "gatedAction": "Lūdzu, apstipriniet savu e-pastu, pirms darbības.", "verifiedTitle": "E-pasts apstiprināts", "verifiedText": "Jūsu e-pasta adrese ir apstiprināta.", "backHome": "Atpakaļ uz sākumu" };
const components$1 = { "cpu": "Procesors", "motherboard": "Sistēmplate", "ram": "Operatīvā atmiņa", "gpu": "Videokarte", "ssd": "SSD", "hdd": "HDD", "case": "Korpuss", "cooler": "Dzesētājs", "psu": "Barošanas bloks", "fan": "Ventilators" };
const stockStatus = { "in_stock": "Pieejams", "orderable": "Pieejams pēc pasūtījuma", "out_of_stock": "Nav pieejams" };
const fieldLabels = { "name": "Nosaukums", "type": "Tips", "price": "Cena", "stock_status": "Pieejamība", "stock_quantity": "Pieejamais daudzums", "socket": "Ligzda", "cores": "Kodoli", "threads": "Pavedieni", "clock_rate": "Bāzes frekvence", "turbo_frequency": "Turbo frekvence", "tdp": "TDP", "integrated_graphics": "Iebūvēta grafika", "cooler_included": "Dzesētājs komplektā", "passmark": "Passmark vērtējums", "chipset": "Mikroshēma", "form_factor": "Formfaktors", "memory_type": "Atmiņas tips", "memory_slots": "Atmiņas sloti", "memory_max_speed": "Maks. atmiņas frekvence", "m2_slots": "M.2 sloti", "sata_ports": "SATA pieslēgvietas", "wifi": "Wi-Fi", "gpu_model": "GPU modelis", "vram": "Video atmiņa (VRAM)", "cuda": "CUDA kodoli", "bus": "Atmiņas kopnes platums", "vram_freq": "Video atmiņas frekvence", "min_psu": "Min. barošanas bloka jauda", "pcie_version": "PCIe versija", "length_mm": "Garums (mm)", "power_connectors": "Barošanas savienotāji", "capacity": "Apjoms", "interface": "Interfeiss", "read_speed": "Lasīšanas ātrums", "write_speed": "Rakstīšanas ātrums", "max_gpu_length": "Maks. videokartes garums", "max_cpu_cooler_height": "Maks. dzesētāja augstums", "bays_25": '2.5" nodalījumi', "bays_35": '3.5" nodalījumi', "psu_wattage": "Maks. barošanas bloka jauda", "size_mm": "Izmērs (mm)", "connector": "Savienotājs", "rpm_max": "Maks. apgriezieni (RPM)", "units_in_package": "Vienības iepakojumā", "wattage": "Jauda (W)", "efficiency_rating": "Efektivitātes sertifikāts", "psu_type": "Barošanas bloka tips", "modular": "Modulārs", "fan_size_mm": "Ventilatora izmērs (mm)", "pcie_connectors": "PCIe savienotāji", "sata_connectors": "SATA savienotāji", "compatibility": "Saderība", "tdp_support": "Atbalstītais TDP", "height_mm": "Augstums (mm)", "frequency": "Frekvence", "cl_latency": "CL aizture", "modules_count": "Moduļu skaits", "ean": "EAN", "brand": "Ražotājs", "max_memory_capacity": "Maks. atmiņas apjoms", "voltage": "Spriegums", "xmp": "XMP atbalsts", "vram_type": "Video atmiņas tips", "gpu_family": "GPU saime", "nand_type": "NAND tips", "tbw": "Izturība (TBW)", "random_read_iops": "Nejaušā lasīšana (IOPS)", "random_write_iops": "Nejaušā rakstīšana (IOPS)", "rpm": "Apgriezieni (RPM)", "cache_mb": "Kešatmiņa (MB)", "psu_included": "Barošanas bloks komplektā", "fans_included": "Ventilatori komplektā", "max_psu_length": "Maks. barošanas bloka garums (mm)", "max_radiator_size": "Maks. radiatora izmērs (mm)", "rgb_type": "RGB tips", "led_color": "LED krāsa", "noise_max_db": "Maks. trokšņa līmenis (dB)", "rpm_min": "Min. apgriezieni (RPM)", "amps_12v": "+12V strāva (A)", "pcie_5": "PCI-E 5.0/5.1 atbalsts", "cpu_connectors": "Procesora spraudnis", "fan_count": "Ventilatoru skaits" };
const lvCommon = {
  appName,
  loading,
  error,
  save,
  cancel,
  "delete": "Dzēst",
  edit,
  close,
  yes,
  no,
  next,
  previous,
  page,
  verifyEmail,
  components: components$1,
  stockStatus,
  fieldLabels
};
const nav = { "build": "Veidot", "saved": "Saglabātie", "guide": "Pamācība", "profile": "Profils", "signIn": "Pieslēgties", "signOut": "Iziet", "hello": "Sveiki, {{name}}" };
const footer = { "tagline": "Veido un kopīgo savu datoru." };
const lvLayout = {
  nav,
  footer
};
const common = { "emailLabel": "E-pasts", "passwordLabel": "Parole", "emailRequired": "E-pasts ir obligāts.", "emailInvalid": "Lūdzu, ievadiet derīgu e-pasta adresi.", "passwordRequired": "Parole ir obligāta.", "passwordMinLength": "Parolei jābūt vismaz 8 simbolus garai.", "passwordComplexity": "Parolei jāsatur lielie un mazie burti, cipars un simbols." };
const login$1 = { "title": "Pieslēgties", "createAccount": "Izveidot kontu", "submit": "Pieslēgties", "heroText": "PC BUILDER" };
const register$1 = { "title": "Reģistrēties", "nameLabel": "Vārds", "nameRequired": "Vārds ir obligāts.", "nameMinLength": "Vārdam jābūt vismaz 3 simbolus garam.", "confirmPasswordLabel": "Apstipriniet paroli", "confirmPasswordRequired": "Lūdzu, apstipriniet paroli.", "passwordsDoNotMatch": "Paroles nesakrīt.", "alreadyHaveAccount": "Jau ir konts?", "submit": "Reģistrēties", "heroText": "SĀC VEIDOT" };
const lvAuth = {
  common,
  login: login$1,
  register: register$1
};
const sidePanel = { "title": "VEIDOTĀJS", "newBuild": "Jauna konfigurācija", "guideHint": "Nezini, ar ko sākt? Apskati", "guideLink": "ceļvedi", "loadBuildError": "Neizdevās ielādēt konfigurāciju" };
const budgetSlider = { "anyBudget": "Bez budžeta ierobežojuma", "totalBudget": "Kopējais budžets", "remainingBudget": "Atlikušais budžets" };
const componentCard = { "stores": "Veikali", "moreStores": "+{{count}} veikali", "inStockWithQty": "Pieejams ({{count}})", "orderableWithQty": "Pieejams pēc pasūtījuma ({{count}})", "orderable": "Pieejams pēc pasūtījuma", "outOfStock": "Nav pieejams", "inStock": "Pieejams", "seeInStore": "Apskatīt veikalā", "remove": "Noņemt", "replace": "Aizvietot", "startingFrom": "Sākot no €{{price}}", "more": "Vairāk", "availabilityTitle": "Pieejamība", "lastScraped": "Pēdējā pārbaude: {{date}}", "neverScraped": "Pēdējā pārbaude: nekad", "checkManually": "Trūkst specifikāciju datu — lūdzu, pārbaudiet atbilstību manuāli" };
const componentPopup = { "required": "Obligāts", "optional": "Neobligāts", "ram": { "fullName": "Operatīvā atmiņa", "description": "Īslaicīga darba atmiņa. Glabā datus, ko procesors aktīvi izmanto." }, "gpu": { "fullName": "Grafikas karte", "description": "Renderē grafiku un attēlus. Veic paralēlās apstrādes uzdevumus." }, "psu": { "fullName": "Barošanas bloks", "description": "Pārveido elektrotīkla strāvu spriegumos, kas nepieciešami komponentēm." }, "ssd": { "fullName": "SSD disks", "description": "Ātra pastāvīgā atmiņa. Ātri ielādē operētājsistēmu un programmas." }, "hdd": { "fullName": "Cietais disks", "description": "Papildu liela, lēnāka atmiņa. Labi piemērota liela apjoma failiem un rezerves kopijām." }, "case": { "fullName": "Datora korpuss", "description": "Aizsargā visas komponentes un nodrošina gaisa plūsmu." }, "fan": { "fullName": "Korpusa ventilators", "description": "Virza gaisu caur korpusu, lai novērstu pārkaršanu." }, "cooler": { "fullName": "Procesora dzesētājs", "description": "Uzstādīts uz procesora un novada no tā siltumu." }, "cpu": { "fullName": "Centrālais procesors", "description": "Datora smadzenes. Izpilda visas instrukcijas un palaiž programmatūru." }, "motherboard": { "fullName": "Mātesplate", "description": "Pamatkomponente, kas savieno visas daļas un nodrošina to saziņu." } };
const addComponent = { "title": "Pievienot {{component}}", "failedToFetch": "Neizdevās iegūt komponentes", "noComponentsFound": "Komponentes nav atrastas", "tryAdjustingFilters": "Pamēģiniet pielāgot filtrus", "outOfStock": "Nav pieejams", "includedInCase": "Iekļauts korpusā", "notCompatible": "Nav saderīgs", "caseIncludesPsu": "Korpusā iekļauts barošanas bloks", "select": "Izvēlēties", "startingFrom": "Sākot no €{{price}}", "viewDetails": "Pilna informācija" };
const componentFilters = { "searchPlaceholder": "Meklēt {{component}}...", "sort": { "recommended": "Ieteicamais", "priceAsc": "Cena: no zemākās", "priceDesc": "Cena: no augstākās", "nameAsc": "Nosaukums: A līdz Z", "nameDesc": "Nosaukums: Z līdz A" }, "price": "Cena (€)", "minPrice": "Min. cena (€)", "maxPrice": "Maks. cena (€)", "failedToFetchFilters": "Neizdevās iegūt filtrus", "all": "Visi", "yes": "Jā", "no": "Nē", "display": "Attēlošana", "inStock": "Pieejams", "canBeOrdered": "Pieejams pēc pasūtījuma", "compatibleOnly": "Tikai saderīgi", "clearFilters": "Notīrīt filtrus", "labels": { "brand": "Zīmols", "socket": "Ligzda", "cores": "Kodoli", "integrated_graphics": "Iebūvēta grafika", "cooler_included": "Iekļauts dzesētājs", "chipset": "Mikroshēmu komplekts", "form_factor": "Formfaktors", "memory_type": "Atmiņas tips", "wifi": "WiFi", "capacity": "Kapacitāte (GB)", "frequency": "Frekvence (MHz)", "vram": "VRAM (GB)", "min_psu": "Min PSU jauda (W)", "tdp_support": "Min. TDP atbalsts (W)", "wattage": "Min. jauda (W)", "efficiency_rating": "Efektivitātes klase", "modular": "Modulārs", "psu_type": "Barošanas bloka tips", "pcie_5": "PCIe 5.0 savienotājs", "modules_count": "Komplekta lielums", "xmp": "XMP/EXPO", "gpu_family": "GPU zīmols", "type": "Tips", "interface": "Interfeiss", "fan_size_mm": "Ventilatora izmērs (mm)", "size_mm": "Izmērs (mm)", "units_in_package": "Iepakojuma lielums", "psu_included": "Barošanas bloks iekļauts" } };
const buildDesc = { "currentlyEditing": 'Tiek rediģēta konfigurācija: "{{name}}"', "total": "Kopā", "components": "Komponentes", "compatibility": "Saderība", "validateFailed": "Pašlaik neizdevās pārbaudīt saderību — redzamie rezultāti var būt novecojuši.", "aboutThisBuild": "Par šo konfigurāciju", "fullyFunctionalNote": "Jūsu konfigurācija ir pilnībā funkcionāla. Šie ir tikai ieteikumi labākai pieredzei." };
const buildGenerator = { "title": "Automātiski generēt konfigurāciju", "intro": "Nezini, ar ko sākt? Mēs izvēlēsimies labākās savietojamās komponentes jūsu budžetam. Lai uzzinātu vairāk, apskatiet", "guideLink": "automātiskā veidotāja", "guideSuffix": "ceļvedi.", "recommendBudgetIncrease": "Iesakām palielināt budžetu šim konfigurācijas tipam.", "preferences": "Iestatījumi", "gpu": "Videokarte", "cpu": "Procesors", "usage": "Pielietojums", "any": "Jebkurš", "nvidia": "NVIDIA", "amd": "AMD", "intel": "INTEL", "gaming": "Spēles", "office": "Birojs", "rendering": "Renderēšana", "streaming": "Straumēšana", "includeOnlyOrderable": "Iekļaut tikai pasūtāmās preces", "somethingWentWrong": "Kaut kas nogāja greizi", "incompatibleWarning": "Viena vai vairākas komponentes jūsu konfigurācijā nav saderīgas. Lai generētu, nomainiet vai noņemiet tās.", "manualCheckWarning": "Vienai vai vairākām izvēlētajām komponentēm trūkst specifikācijas datu, lai pārbaudītu atbilstību. Lūdzu, samainiet vai noņemiet to pirms ģenerēšanas.", "generating": "Generē...", "generate": "Generēt", "generateSuccess": "Konfigurācija veiksmīgi generēta", "loginRequired": "Pieslēdzieties, lai izmantotu automātisko konfigurācijas ģeneratoru.", "loginLink": "Pieslēgties" };
const componentGenerator = { "title": "Automātiski generēt komponenti", "intro": "Nezini, kuru komponenti izvēlēties? Mēs izvēlēsimies labāko savietojamo komponenti jūsu budžetam. Lai uzzinātu vairāk, apskatiet", "guideLink": "automātiskā veidotāja", "guideSuffix": "ceļvedi.", "preferences": "Iestatījumi", "cpu": "Procesors", "gpu": "Videokarte", "any": "Jebkurš", "nvidia": "NVIDIA", "amd": "AMD", "intel": "INTEL", "includeOnlyOrderable": "Iekļaut tikai pasūtāmās preces", "somethingWentWrong": "Kaut kas nogāja greizi", "incompatibleWarning": "Viena vai vairākas komponentes jūsu konfigurācijā nav saderīgas. Lai generētu, nomainiet vai noņemiet tās.", "manualCheckWarning": "Vienai vai vairākām izvēlētajām komponentēm trūkst specifikācijas datu, lai pārbaudītu atbilstību. Lūdzu, samainiet vai noņemiet to pirms ģenerēšanas.", "generating": "Ģenerē...", "generate": "Ģenerēt", "generateSuccess": "Komponente veiksmīgi generēta", "loginRequired": "Pieslēdzieties, lai izmantotu automātisko komponentes ģeneratoru.", "loginLink": "Pieslēgties" };
const buildInfo = { "selectComponents": "Izvēlieties savas komponentes", "enterBuildName": "Lūdzu, ievadiet konfigurācijas nosaukumu", "selectAtLeastOne": "Lūdzu, izvēlieties vismaz vienu komponenti", "savedAsNew": "Saglabāts kā jauna konfigurācija!", "savedSuccessfully": "Konfigurācija saglabāta", "failedToSave": "Neizdevās saglabāt konfigurāciju", "nameLabel": "Nosaukums", "namePlaceholder": "konfigurācijas nosaukums...", "notesLabel": "Piezīmes", "notesPlaceholder": "konfigurācijas piezīmes...", "buildTypeLabel": "Konfigurācijas tips", "none": "Nav", "gaming": "Spēles", "office": "Birojs", "rendering": "Renderēšana", "streaming": "Straumēšana", "saving": "Saglabā...", "saveBuild": "Saglabāt", "clearBuild": "Notīrīt", "saveAsNewBuild": "Saglabāt kā jaunu konfigurāciju", "loginToSave": "Pieslēdzieties, lai saglabātu konfigurāciju.", "loginLink": "Pieslēgties", "restoredNudge": "Mēs atjaunojām jūsu iesākto konfigurāciju. Saglabājiet to tagad, lai tā paliktu jūsu kontā." };
const lvBuilder = {
  sidePanel,
  budgetSlider,
  componentCard,
  componentPopup,
  addComponent,
  componentFilters,
  buildDesc,
  buildGenerator,
  componentGenerator,
  buildInfo
};
const accountSettings = { "heading": "Konta iestatījumi", "personalInfoHeading": "Personas informācija", "nameLabel": "Vārds", "emailLabel": "E-pasts", "emailVerified": "Apstiprināts", "emailNotVerified": "Nav apstiprināts", "nameTooShort": "Vārdam jābūt vismaz 3 burtu garam", "infoUpdated": "Informācija atjaunināta", "infoUpdateError": "Neizdevās saglabāt personas informāciju", "save": "Saglabāt", "edit": "Labot", "cancel": "Atcelt", "changePasswordHeading": "Mainīt paroli", "oldPasswordLabel": "Vecā parole", "newPasswordLabel": "Jaunā parole", "confirmNewPasswordLabel": "Apstiprināt jauno paroli", "passwordUpdated": "Parole atjaunināta", "passwordUpdateError": "Neizdevās saglabāt paroli", "deleteAccountHeading": "Dzēst manu kontu", "deleteAccountButton": "Dzēst manu kontu", "deleteConfirmTitle": "Vai tiešām vēlaties dzēst savu kontu?", "deleteConfirmSubtitle": "Šo darbību nevar atsaukt, un tā ir neatgriezeniska", "deleteConfirmInstruction": "Lai apstiprinātu, lūdzu, ierakstiet", "deleteConfirmInstructionSuffix": "", "deleteConfirmKeyword": "delete-my-account", "deleteConfirmIncorrect": "Apstiprinājuma teksts nav pareizs", "delete": "Dzēst", "cancelDelete": "Atcelt" };
const lvProfile = {
  accountSettings
};
const seo = { "home": { "title": "PC Builder — Izveido Savu Datoru Tiešsaistē | Latvija", "description": "Izveido un salīdzini datorus, izmantojot reālas Latvijas tirgus komponentes ar aktuālām cenām un automātisku saderības pārbaudi." }, "builder": { "title": "PC Builder — Izveido Savu Datoru", "description": "Izvēlies komponentes vai automātiski izveido konfigurāciju sava budžeta ietvaros ar reāllaika saderības pārbaudi un aktuālām Latvijas veikalu cenām." }, "guide": { "title": "Pamācība — PC Builder", "description": "Uzzini, kā izveidot datoru, izmantot automātisko konstruktoru un pārvaldīt saglabātās konfigurācijas." }, "login": { "title": "Pieslēgties — PC Builder", "description": "Pieslēdzies savam PC Builder kontam, lai saglabātu un pārvaldītu savas konfigurācijas." }, "register": { "title": "Reģistrēties — PC Builder", "description": "Izveido bezmaksas PC Builder kontu, lai saglabātu konfigurācijas un izmantotu automātisko konstruktoru." }, "savedBuilds": { "title": "Saglabātās Konfigurācijas — PC Builder" }, "notFound": { "title": "Lapa Nav Atrasta — PC Builder" }, "picker": { "cpu": { "title": "Procesoru (CPU) cenas Latvijā | PC Builder", "description": "Pārlūko procesorus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc ligzdas, kodolu skaita un cenas ar automātisku saderības pārbaudi." }, "motherboard": { "title": "Mātesplašu cenas Latvijā | PC Builder", "description": "Pārlūko mātesplates ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc ligzdas, mikroshēmojuma un formfaktora ar automātisku saderības pārbaudi." }, "ram": { "title": "Operatīvās atmiņas (RAM) cenas Latvijā | PC Builder", "description": "Pārlūko atmiņas komplektus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc tipa, ietilpības un ātruma ar automātisku saderības pārbaudi." }, "gpu": { "title": "Videokaršu (GPU) cenas Latvijā | PC Builder", "description": "Pārlūko videokartes ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc ražotāja, VRAM un cenas ar automātisku saderības pārbaudi." }, "psu": { "title": "Barošanas bloku (PSU) cenas Latvijā | PC Builder", "description": "Pārlūko barošanas blokus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc jaudas, efektivitātes un modularitātes ar automātisku saderības pārbaudi." }, "ssd": { "title": "SSD disku cenas Latvijā | PC Builder", "description": "Pārlūko SSD diskus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc ietilpības, tipa un saskarnes ar automātisku saderības pārbaudi." }, "hdd": { "title": "Cieto disku (HDD) cenas Latvijā | PC Builder", "description": "Pārlūko cietos diskus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc ietilpības un saskarnes ar automātisku saderības pārbaudi." }, "case": { "title": "Datoru korpusu cenas Latvijā | PC Builder", "description": "Pārlūko datoru korpusus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc formfaktora ar automātisku saderības pārbaudi." }, "cooler": { "title": "Procesora dzesētāju cenas Latvijā | PC Builder", "description": "Pārlūko procesora dzesētājus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc TDP atbalsta un ventilatora izmēra ar automātisku saderības pārbaudi." }, "fan": { "title": "Korpusa ventilatoru cenas Latvijā | PC Builder", "description": "Pārlūko korpusa ventilatorus ar aktuālām cenām no Latvijas veikaliem. Filtrē pēc izmēra un skaita komplektā ar automātisku saderības pārbaudi." } }, "componentDetail": { "title": "{{name}} — cena Latvijā | PC Builder", "description": "Salīdzini {{name}} cenas un pieejamību Latvijas veikalos un pārbaudi saderību ar savu datora konfigurāciju." } };
const home = { "build": { "title": "IZVEIDO SAVU DATORU", "description": "Izveido savu datoru, izmantojot mūsu vienkāršo konstruktoru. Izvēlies no Latvijas tirgū pieejamām komponentēm ar precīzām, aktuālām cenām." }, "auto": { "title": "BŪVĒ VIEGLI UN ĀTRI", "description": "Automātiski pabeidz savu konfigurāciju jebkurā posmā, izmantojot mūsu inteliģento automātisko konstruktoru." } };
const guide = { "sidePanelTitle": "PAMĀCĪBA", "sections": { "builder": "Datora salikšana", "auto": "Automātiskais konstruktors", "saved": "Saglabāto konfigurāciju pārvaldība" } };
const guides = { "note": { "label": "Piezīme:" }, "builderSection": { "title": "Pirmā datora salikšana", "selectingComponentsHeading": "Komponenšu izvēle", "step1": "1. Dodies uz <buildLink>Veidot</buildLink> lapu, navigācijas joslā nospiežot pogu <buildButton>Veidot</buildButton>.", "step2": "2. Atrodi komponenšu saraksta sadaļu un nospied pogu <addButton></addButton>, lai pievienotu jaunu komponentu.", "step3": "3. Izmanto meklēšanas lauku un filtrus, lai pārlūkotu un atrastu komponentes, kas atbilst tavām vēlmēm.", "step3Note": 'Nesaderīgas komponentes būs atzīmētas ar norādi "Nesaderīgs".', "step4": "4. Izvēlies komponentu no saraksta un nospied <selectText>Izvēlēties</selectText>, lai pievienotu to savai konfigurācijai. Tā parādīsies konfigurācijas informācijas panelī un komponenšu sarakstā.", "step4Note": "Komponentu var noņemt vai apskatīt veikalā, izmantojot pogas komponenta kartītes apakšā.", "step5": "5. Atkārto šos soļus, kamēr konfigurācija ir pabeigta.", "savingHeading": "Konfigurācijas saglabāšana", "step6": "6. Noteikti nosauc savu konfigurāciju un, ja vēlies, pievieno piezīmes attiecīgajos laukos.", "step7": "7. Kad esi izvēlējies visas komponentes un nosaucis konfigurāciju, nospied pogu <saveButtonText>Saglabāt konfigurāciju</saveButtonText> konfigurācijas informācijas panelī.", "step7Note": 'Visu konfigurāciju var notīrīt vai noņemt atsevišķas komponentes, nospiežot pogu "Notīrīt konfigurāciju" vai ikonu <closeIcon></closeIcon> pie katras komponentes.' }, "autoSection": { "title": "Automātiskā konstruktora izmantošana", "selectingComponentsHeading": "Komponenšu izvēle", "step1": "1. Pēc izvēles vari sākt, pievienojot komponentes, kuras vēlies redzēt savā konfigurācijā. Vari arī izmantot automātisko komponenšu generatoru pie filtriem, lai automātiski atrastu saderīgu komponentu.", "step1Note": "Šis solis nav obligāts. Vari to izlaist, lai izveidotu pilnībā automātisku konfigurāciju.", "selectingBudgetHeading": "Budžeta izvēle", "step2": "2. Ritini līdz konfigurācijas informācijas paneļa beigām un izvēlies <autoBuilderText>Automātiskais konstruktors</autoBuilderText> opciju.", "step3": "3. Iestati savu budžetu, izmantojot slīdni, vai izvēlies neierobežotu budžetu, lai iegūtu pēc iespējas labākas komponentes.", "step3Note": "Budžets attiecas uz visu konfigurāciju. Ja jau esi izvēlējies kādas komponentes, to izmaksas tiks atskaitītas no pieejamā budžeta.", "step4": "4. Iestati savas GPU, CPU un izmantošanas veida vēlmes zem budžeta slīdņa.", "step4Note": 'Pārliecinies, ka atzīmēta opcija "Ietvert pasūtāmās preces", lai izmantotu arī komponentes, kuru nav noliktavā, bet ko var pasūtīt.', "generatingHeading": "Konfigurācijas generēšana", "step5": "5. Kad budžets ir iestatīts, nospied generēšanas pogu, lai automātiski pabeigtu savu konfigurāciju.", "step5Note": "Budžets ietekmē arī komponenšu sadalījumu. Piemēram, mazāka budžeta konfigurācijās (zem 500€) GPU var netikt iekļauts, tā vietā izvēloties CPU ar iebūvētu grafiku. Tas pats attiecas uz tādām komponentēm kā CPU dzesētāji. <link>Apskati visus budžeta sadalījumus zemāk</link>.", "step6": "6. Pēc konfigurācijas izveides iesakām pirms pirkuma manuāli pārbaudīt visu komponenšu saderību.", "step6Note": "HDD komponente netiek automātiski iekļauta, jo tā ir izvēles. Ja CPU ir iebūvēts dzesētājs un budžets ir ierobežots, atsevišķs CPU dzesētājs arī var tikt uzskatīts par izvēles komponentu.", "budgetAllocationsHeading": "Budžeta sadalījumi", "table": { "component": "Komponente", "budgetLow": "Budžets (<500€)", "budgetMid": "Vidējs (500–1500€)", "budgetHigh": "Augsta klase (>1500€)", "general": "Vispārīgs", "office": "Birojam", "gaming": "Spēlēm", "streaming": "Straumēšanai", "rendering": "Renderēšanai", "gpu": "GPU", "cpu": "CPU", "motherboard": "Mātesplate", "ram": "RAM", "cooler": "Dzesētājs", "case": "Korpuss", "psu": "Barošanas bloks", "ssd": "SSD" } }, "savedSection": { "title": "Saglabāto konfigurāciju pārvaldība", "viewingBuildsHeading": "Saglabāto konfigurāciju apskate", "step1": "1. Dodies uz <savedLink>Saglabātās</savedLink> lapu, navigācijas joslā nospiežot pogu <savedButton>Saglabātās</savedButton>.", "step2": "2. Atrodi konfigurāciju sarakstu un izvēlies konfigurāciju, kuru vēlies apskatīt.", "viewingComponentsHeading": "Konfigurācijas komponenšu apskate", "step3": "3. Nospied uz jebkuras komponentes, lai zemāk apskatītu tās detaļas un aprakstu.", "step4": "4. Lai apskatītu komponentu veikalā, nospied pogu <seeInStore>Apskatīt veikalā</seeInStore> aprakstā vai pogu <buy>Pirkt</buy> pie komponentes sarakstā.", "editingHeading": "Konfigurācijas informācijas redigēšana", "editStep1": "1. Nospied pogu <edit>Redigēt</edit> pie konfigurācijas nosaukuma.", "editStep2": "2. Atjaunini laukus pēc nepieciešamības. Piezīmju lauku vari atstāt tukšu, ja vēlies.", "editStep3": "3. Nospied <save>Saglabāt</save>, lai pievienotu izmaiņas, vai <cancel>Atcelt</cancel>, lai tās atceltu.", "continuingHeading": "Konfigurācijas turpināšana", "continueStep1": "1. Nospied pogu <continueBuild>Turpināt konfigurāciju</continueBuild>, lai turpinātu konfigurācijas veidošanu no vietas, kur to pārtrauci. Tu tiksi pārvirzīts uz konstruktora lapu ar savu pašreizējo konfigurāciju.", "deletingHeading": "Konfigurācijas dzēšana", "deleteStep1": "1. Nospied pogu <deleteBuild>Dzēst konfigurāciju</deleteBuild> (vai dzēšanas opciju konfigurācijas informācijas panelī), lai noņemtu izvēlēto konfigurāciju.", "deleteStep2": "2. Parādīsies apstiprinājuma logs. Apstiprini, lai neatgriezeniski dzēstu konfigurāciju." } };
const savedBuilds = { "sidePanelTitle": "SAGLABĀTĀS KONFIGURĀCIJAS", "noSavedBuilds": "Tev pagaidām nav saglabātu konfigurāciju.", "delete": "Dzēst", "loading": "Ielādē...", "selectBuildPrompt": "Izvēlies konfigurāciju, lai apskatītu detaļas.", "notesPlaceholder": "Piezīmes", "save": "Saglabāt", "cancel": "Atcelt", "edit": "Redigēt", "continueBuild": "Turpināt konfigurāciju", "buy": "Pirkt", "deleteConfirmTitle": "Vai tiešām vēlies dzēst šo konfigurāciju?", "deleteError": "Neizdevās izdzēst konfigurāciju", "share": "Kopīgot", "unshare": "Pārtraukt kopīgošanu", "copyLink": "Kopēt saiti", "shareLinkCopied": "Saite nokopēta", "unshared": "Konfigurācijas kopīgošana pārtraukta", "shareError": "Neizdevās atjaunināt kopīgošanas iestatījumus", "slotLabels": { "cpu": "Procesors", "motherboard": "Mātesplate", "ram": "Operatīvā atmiņa", "gpu": "Videokarte", "ssd": "SSD", "hdd": "HDD", "pc_case": "Korpuss", "cooler": "Dzesētājs", "psu": "Barošanas bloks", "fan": "Ventilators" } };
const notFound$1 = { "heading": "Lapa nav atrasta.", "description": "Lapa, kuru meklē, neeksistē.", "goHome": "Atpakaļ uz sākumlapu" };
const components = { "buildCard": { "compatibilityIssues": "Saderības problēmas" }, "sidePanel": { "brand": "PC BUILDER" } };
const lvPages = {
  seo,
  home,
  guide,
  guides,
  savedBuilds,
  notFound: notFound$1,
  components
};
const resources = {
  en: {
    common: enCommon,
    layout: enLayout,
    auth: enAuth,
    builder: enBuilder,
    profile: enProfile,
    pages: enPages
  },
  lv: {
    common: lvCommon,
    layout: lvLayout,
    auth: lvAuth,
    builder: lvBuilder,
    profile: lvProfile,
    pages: lvPages
  }
};
function createI18n(lng) {
  const i18n = createInstance();
  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "lv",
    supportedLngs: ["en", "lv"],
    defaultNS: "common",
    ns: ["common", "layout", "auth", "builder", "profile", "pages"],
    interpolation: {
      escapeValue: false
    }
  });
  return i18n;
}
const langFromParams = (params) => params.lang === "en" ? "en" : "lv";
const langFromPathname = (pathname) => pathname === "/en" || pathname.startsWith("/en/") ? "en" : "lv";
const localePath = (lang, path) => {
  if (lang !== "en") return path;
  return path === "/" ? "/en" : `/en${path}`;
};
const stripLocale = (pathname) => {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
};
function useLocalePath() {
  const params = useParams();
  const lang = langFromParams(params);
  return (path) => localePath(lang, path);
}
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) ? "onAllReady" : "onShellReady";
    const lang = langFromPathname(new URL(request.url).pathname);
    const i18n = createI18n(lang);
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(I18nextProvider, { i18n, children: /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }) }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error2) {
          reject(error2);
        },
        onError(error2) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error2);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(void 0);
  const [verifyBannerVisible, setVerifyBannerVisible] = useState(true);
  useEffect(() => {
    axios.get("/api/user").then((res) => setUser(res.data)).catch(() => setUser(null));
  }, []);
  const login2 = async (email, password) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/login", { email, password });
    setUser(res.data);
    return res.data;
  };
  const register2 = async (name, email, password, password_confirmation) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/register", {
      name,
      email,
      password,
      password_confirmation
    });
    setUser(res.data);
    return res.data;
  };
  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
  };
  const resendVerification = () => {
    return axios.post("/api/email/verification-notification");
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        setUser,
        login: login2,
        register: register2,
        logout,
        resendVerification,
        verifyBannerVisible,
        dismissVerifyBanner: () => setVerifyBannerVisible(false),
        showVerifyBanner: () => setVerifyBannerVisible(true)
      },
      children
    }
  );
};
const useAuth = () => useContext(AuthContext);
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  const lp = useLocalePath();
  if (user === void 0) return null;
  return user ? /* @__PURE__ */ jsx(Navigate, { to: lp("/"), replace: true }) : children;
};
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  const lp = useLocalePath();
  if (user === void 0) return null;
  return user ? children : /* @__PURE__ */ jsx(Navigate, { to: lp("/login"), replace: true });
};
const ToastContext = createContext(null);
const DEFAULT_DURATION = 5e3;
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const addToast = useCallback(
    (message, { type = "info", duration = DEFAULT_DURATION } = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );
  return /* @__PURE__ */ jsx(ToastContext.Provider, { value: { toasts, addToast, removeToast }, children });
};
const useToast = () => useContext(ToastContext);
function MenuIcon({ size = 24, className = "transition" }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      children: /* @__PURE__ */ jsx("path", { strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })
    }
  );
}
function ArrowIcon({ size = 16, active }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      className: `transition ${active ? "rotate-180" : ""}`,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      children: /* @__PURE__ */ jsx("path", { strokeWidth: 2, d: "M19 9l-7 7-7-7" })
    }
  );
}
function TrashIcon({ size = 24, color = "currentColor", className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 7H20M9 7V4.5C9 3.67 9.67 3 10.5 3H13.5C14.33 3 15 3.67 15 4.5V7M18.5 7L17.79 19.14C17.74 19.92 17.09 20.5 16.3 20.5H7.7C6.91 20.5 6.26 19.92 6.21 19.14L5.5 7",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: "10",
            y1: "11",
            x2: "10",
            y2: "16",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: "14",
            y1: "11",
            x2: "14",
            y2: "16",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
function CloseIcon({ size = 24 }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "5", y1: "5", x2: "19", y2: "19" }),
        /* @__PURE__ */ jsx("line", { x1: "19", y1: "5", x2: "5", y2: "19" })
      ]
    }
  );
}
function AddIcon({ size = 24 }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
        /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
      ]
    }
  );
}
function InfoIcon({ size = 24, color = "currentColor", className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: "12",
            y1: "11",
            x2: "12",
            y2: "17",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7.5", r: "0.5", fill: color, stroke: color, strokeWidth: "1.2" })
      ]
    }
  );
}
function AlertIcon({ size = 24, color = "currentColor", className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: "12",
            y1: "7",
            x2: "12",
            y2: "13",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "16.5", r: "0.5", fill: color, stroke: color, strokeWidth: "1.2" })
      ]
    }
  );
}
function CopyIcon({ size = 24, color = "currentColor", className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: "9",
            y: "9",
            width: "12",
            height: "12",
            rx: "0",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M6 15H4.5C3.67 15 3 14.33 3 13.5V4.5C3 3.67 3.67 3 4.5 3H13.5C14.33 3 15 3.67 15 4.5V6",
            stroke: color,
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function DotsIcon({ size = 24, color = "currentColor", className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "5", cy: "12", r: "1.8", fill: color }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1.8", fill: color }),
        /* @__PURE__ */ jsx("circle", { cx: "19", cy: "12", r: "1.8", fill: color })
      ]
    }
  );
}
const TYPE_CLASSES = {
  success: "border-success/80 bg-success/10 text-success",
  danger: "border-danger/80 bg-danger/10 text-danger",
  info: "border-info/80 bg-info/10 text-info"
};
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed top-16 right-4 z-100 flex flex-col gap-2 w-90 max-w-[calc(100vw-2rem)]", children: toasts.map((toast) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `p-3 border shadow flex items-start justify-between gap-3 ${TYPE_CLASSES[toast.type] ?? TYPE_CLASSES.info}`,
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: toast.message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "cursor-pointer shrink-0 opacity-80 hover:opacity-100",
            onClick: () => removeToast(toast.id),
            children: /* @__PURE__ */ jsx(CloseIcon, { size: 18 })
          }
        )
      ]
    },
    toast.id
  )) });
};
const NotFound = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("pages");
  return /* @__PURE__ */ jsx("div", { className: "bg-primary h-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center px-6 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-9xl font-bold text-muted opacity-30 select-none mt-4", children: "404" }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-white mt-2", children: t("notFound.heading") }),
    /* @__PURE__ */ jsx("p", { className: "text-muted mt-2 text-sm", children: t("notFound.description") }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: lp("/"),
        className: "px-8 py-4 text-sm font-medium bg-secondary-light text-text hover:bg-secondary-light/50 transition",
        children: t("notFound.goHome")
      }
    )
  ] }) });
};
const appCss = "/assets/app-BDDBi5Ue.css";
const links = () => [{
  rel: "stylesheet",
  href: appCss
}];
function Layout$1({
  children
}) {
  const params = useParams();
  return /* @__PURE__ */ jsxs("html", {
    lang: langFromParams(params),
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "UTF-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx("div", {
        id: "app",
        children
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function Root() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false
      }
    }
  }));
  return /* @__PURE__ */ jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsx(AuthProvider, {
      children: /* @__PURE__ */ jsxs(ToastProvider, {
        children: [/* @__PURE__ */ jsx(ToastContainer, {}), /* @__PURE__ */ jsx(Outlet, {})]
      })
    })
  });
});
const ErrorBoundary$1 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
  const error2 = useRouteError();
  if (isRouteErrorResponse(error2) && error2.status === 404) {
    return /* @__PURE__ */ jsx(NotFound, {});
  }
  return /* @__PURE__ */ jsx("div", {
    className: "bg-primary h-full min-h-screen flex items-center justify-center",
    children: /* @__PURE__ */ jsx("p", {
      className: "text-white text-xl",
      children: "Something went wrong."
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  Layout: Layout$1,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function loader$3({
  params,
  request
}) {
  const {
    lang
  } = params;
  if (lang === "lv") {
    const url = new URL(request.url);
    throw redirect((url.pathname.replace(/^\/lv(?=\/|$)/, "") || "/") + url.search, 301);
  }
  if (lang !== void 0 && lang !== "en") throw data(null, {
    status: 404
  });
  return null;
}
const locale = UNSAFE_withComponentProps(function Locale() {
  const params = useParams();
  const lang = langFromParams(params);
  const {
    i18n
  } = useTranslation();
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: locale,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "lv", label: "LV" }
];
const LanguageSwitcher = ({ className = "" }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const current = langFromPathname(pathname);
  const switchTo = (code) => {
    if (code === current) return;
    navigate(localePath(code, stripLocale(pathname)) + search);
  };
  return /* @__PURE__ */ jsx("div", { className: `flex items-center gap-1 ${className}`, children: LANGUAGES.map(({ code, label }) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => switchTo(code),
      className: `px-2 py-1 text-xs font-semibold transition cursor-pointer ${current === code ? "bg-primary text-white" : "text-text hover:bg-surface"}`,
      children: label
    },
    code
  )) });
};
const VerifyEmailBanner = () => {
  const { t } = useTranslation("common");
  const { resendVerification, verifyBannerVisible, dismissVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);
  if (!verifyBannerVisible) return null;
  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      addToast(t("verifyEmail.resendSuccess"), { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.message ?? t("verifyEmail.resendError"), { type: "danger" });
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-primary border-b border-secondary px-6 py-2 flex flex-wrap items-center justify-center gap-3 text-center relative", children: [
    /* @__PURE__ */ jsx("p", { className: "text-background text-sm", children: t("verifyEmail.banner") }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleResend,
        disabled: sending,
        className: "text-white text-sm underline hover:no-underline cursor-pointer disabled:opacity-50",
        children: t("verifyEmail.resend")
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: dismissVerifyBanner,
        className: "text-white/70 hover:text-white cursor-pointer sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2",
        "aria-label": t("close"),
        children: /* @__PURE__ */ jsx(CloseIcon, { size: 16 })
      }
    )
  ] });
};
const Layout = () => {
  const { t } = useTranslation("layout");
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const lp = useLocalePath();
  const basePath = stripLocale(pathname);
  const [profileActive, setProfileActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setProfileActive(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target)) {
        setMenuActive(false);
      }
    };
    if (profileActive || menuActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileActive, menuActive]);
  const navLinkClass = (path) => {
    const isActive = basePath.startsWith(path);
    return `flex-1 text-center py-4 px-6 transition ${isActive ? "bg-primary text-white hover:bg-primary-light" : "hover:bg-surface text-text"}`;
  };
  const menuLinkClass = (path) => {
    const isActive = basePath.startsWith(path);
    return `block py-3 px-4 transition ${isActive ? "bg-primary text-white hover:bg-primary-light" : "hover:bg-surface text-text"}`;
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };
  return /* @__PURE__ */ jsxs("div", { className: "h-screen flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center bg-background shadow", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "lg:hidden py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition",
            to: lp("/"),
            children: "BUILDER"
          }
        ),
        user ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-120.5 shrink-0", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                className: "py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition",
                to: lp("/"),
                children: "BUILDER"
              }
            ),
            /* @__PURE__ */ jsx(Link, { className: navLinkClass("/builder"), to: lp("/builder"), children: t("nav.build") }),
            /* @__PURE__ */ jsx(Link, { className: navLinkClass("/builds"), to: lp("/builds"), children: t("nav.saved") })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              ref: menuButtonRef,
              className: `lg:hidden py-4 px-6 transition flex items-center gap-2 ${menuActive ? "bg-primary text-white" : "hover:bg-surface text-text"}`,
              onClick: () => setMenuActive((prev) => !prev),
              children: /* @__PURE__ */ jsx(MenuIcon, {})
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: menuRef,
              className: `lg:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${menuActive ? "h-24" : "h-0"}`,
              children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: menuLinkClass("/builder"),
                    to: lp("/builder"),
                    onClick: () => setMenuActive(false),
                    children: t("nav.build")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: menuLinkClass("/builds"),
                    to: lp("/builds"),
                    onClick: () => setMenuActive(false),
                    children: t("nav.saved")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ml-auto relative flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsxs(
              "button",
              {
                ref: buttonRef,
                className: `py-4 px-6 transition flex items-center gap-2 font-medium ${profileActive ? "bg-primary text-white" : "hover:bg-surface text-text"}`,
                onClick: () => setProfileActive((prev) => !prev),
                children: [
                  /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center text-xs font-bold", children: user.name?.charAt(0).toUpperCase() }),
                  !user.email_verified_at && /* @__PURE__ */ jsx(AlertIcon, { size: 18, className: "text-alert" }),
                  /* @__PURE__ */ jsx(ArrowIcon, { active: profileActive })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                ref: dropdownRef,
                className: `absolute right-0 top-14 sm:w-80 w-screen bg-background overflow-hidden transition-all shadow z-50 ${profileActive ? "h-42" : "h-0"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-surface flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-text font-semibold uppercase", children: t("nav.hello", { name: user.name }) }),
                    /* @__PURE__ */ jsx(LanguageSwitcher, {})
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: lp("/profile"),
                        className: "flex items-center gap-2 px-4 py-2 text-text hover:bg-secondary-light transition",
                        children: [
                          t("nav.profile"),
                          !user.email_verified_at && /* @__PURE__ */ jsx(AlertIcon, { size: 18, className: "text-alert" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        to: lp("/guide"),
                        className: "flex items-center gap-2 px-4 py-2 text-text hover:bg-secondary-light transition",
                        children: t("nav.guide")
                      }
                    ),
                    /* @__PURE__ */ jsx("form", { onSubmit: handleLogout, children: /* @__PURE__ */ jsx("button", { className: "w-full px-4 py-2 text-danger hover:bg-danger/50 transition text-left cursor-pointer", children: t("nav.signOut") }) })
                  ] })
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex shrink-0", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                className: "py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition",
                to: lp("/"),
                children: "BUILDER"
              }
            ),
            /* @__PURE__ */ jsx(Link, { className: navLinkClass("/builder"), to: lp("/builder"), children: t("nav.build") })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              ref: menuButtonRef,
              className: `lg:hidden py-4 px-6 transition flex items-center gap-2 ${menuActive ? "bg-primary text-white" : "hover:bg-surface text-text"}`,
              onClick: () => setMenuActive((prev) => !prev),
              children: /* @__PURE__ */ jsx(MenuIcon, {})
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: menuRef,
              className: `lg:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${menuActive ? "h-12" : "h-0"}`,
              children: /* @__PURE__ */ jsx(
                Link,
                {
                  className: menuLinkClass("/builder"),
                  to: lp("/builder"),
                  onClick: () => setMenuActive(false),
                  children: t("nav.build")
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center", children: [
            /* @__PURE__ */ jsx(LanguageSwitcher, { className: "mr-2" }),
            /* @__PURE__ */ jsx(Link, { className: "py-4 px-6 hover:bg-surface transition", to: lp("/login"), children: t("nav.signIn") })
          ] })
        ] })
      ] }),
      user && !user.email_verified_at && /* @__PURE__ */ jsx(VerifyEmailBanner, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { id: "page-scroll", className: "flex flex-col flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx("footer", { className: "bg-primary border-t border-primary-light", children: /* @__PURE__ */ jsxs("div", { className: "max-w-348 mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center sm:items-start", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-white", children: "BUILDER" }),
          /* @__PURE__ */ jsx("p", { className: "text-surface text-sm mt-1", children: t("footer.tagline") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-sm text-surface", children: [
          /* @__PURE__ */ jsx(Link, { to: lp("/builder"), className: "hover:text-white transition", children: t("nav.build") }),
          user && /* @__PURE__ */ jsx(Link, { to: lp("/builds"), className: "hover:text-white transition", children: t("nav.saved") }),
          /* @__PURE__ */ jsx(Link, { to: lp("/guide"), className: "hover:text-white transition", children: t("nav.guide") })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://github.com/karlisye",
            target: "_blank",
            className: "text-surface hover:text-white transition text-sm",
            children: "@karlisye"
          }
        )
      ] }) })
    ] })
  ] });
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Layout
}, Symbol.toStringTag, { value: "Module" }));
const SITE_URL$1 = "https://pcbuilder.lv";
const pagesSeo = (lang, key) => (lang === "en" ? enPages : lvPages).seo[key] ?? {};
function seoMeta({ lang, path, title, description, noindex = false, image }) {
  const url = `${SITE_URL$1}${localePath(lang, path)}`;
  const tags = [
    { title },
    ...description ? [{ name: "description", content: description }] : [],
    { property: "og:title", content: title },
    ...description ? [{ property: "og:description", content: description }] : []
  ];
  if (noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
    return tags;
  }
  tags.push(
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hreflang: "lv", href: `${SITE_URL$1}${path}` },
    {
      tagName: "link",
      rel: "alternate",
      hreflang: "en",
      href: `${SITE_URL$1}${localePath("en", path)}`
    },
    { tagName: "link", rel: "alternate", hreflang: "x-default", href: `${SITE_URL$1}${path}` },
    { property: "og:url", content: url }
  );
  if (image) tags.push({ property: "og:image", content: image });
  return tags;
}
const Home = () => {
  const { t } = useTranslation("pages");
  return /* @__PURE__ */ jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex xl:flex-row flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "xl:w-1/2 bg-primary px-6 py-10 text-text", children: /* @__PURE__ */ jsxs("div", { className: "xl:max-w-2xl xl:h-220 ml-auto border-4 border-secondary p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap", children: t("home.build.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-surface", children: t("home.build.description") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex h-full" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "xl:w-1/2 px-6 py-10 text-text", children: /* @__PURE__ */ jsxs("div", { className: "xl:max-w-2xl xl:h-220 mr-auto border-4 border-secondary-light p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-full" }),
      /* @__PURE__ */ jsxs("div", { className: "self-end", children: [
        /* @__PURE__ */ jsx("h1", { className: "sm:text-9xl text-7xl font-bold text-text mb-4 flex flex-wrap", children: t("home.auto.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-text", children: t("home.auto.description") })
      ] })
    ] }) })
  ] }) });
};
const meta$a = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/",
    ...pagesSeo(lang, "home")
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
const Note = ({ children }) => {
  const { t } = useTranslation("pages");
  return /* @__PURE__ */ jsxs("div", { className: "border border-border p-4 bg-background text-sm text-muted mt-1.5 shadow", children: [
    /* @__PURE__ */ jsxs("span", { className: "font-medium text-text", children: [
      t("guides.note.label"),
      " "
    ] }),
    children
  ] });
};
const AddButton = () => /* @__PURE__ */ jsx("button", { className: "bg-surface border border-secondary-light p-1 text-muted hover:bg-secondary-light transition cursor-pointer", children: /* @__PURE__ */ jsx(AddIcon, { size: 12 }) });
const CloseButton = () => /* @__PURE__ */ jsx("button", { className: "p-1 bg-secondary text-muted hover:bg-danger/20 hover:text-danger cursor-pointer transition border border-secondary-light", children: /* @__PURE__ */ jsx(CloseIcon, { size: 12 }) });
const BuilderSection = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("pages");
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 pb-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold mb-8 text-text", children: t("guides.builderSection.title") }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.builderSection.selectingComponentsHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.builderSection.step1",
          components: {
            buildLink: /* @__PURE__ */ jsx(
              Link,
              {
                className: "text-info hover:underline font-medium",
                to: lp("/builder")
              }
            ),
            buildButton: /* @__PURE__ */ jsx("span", { className: "font-medium" })
          }
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.builderSection.step2",
          components: {
            addButton: /* @__PURE__ */ jsx(AddButton, {})
          }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.builderSection.step3") }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.builderSection.step3Note") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
          Trans,
          {
            t,
            i18nKey: "guides.builderSection.step4",
            components: { selectText: /* @__PURE__ */ jsx("span", { className: "font-medium" }) }
          }
        ) }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.builderSection.step4Note") })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.builderSection.step5") }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.builderSection.savingHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.builderSection.step6") }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
          Trans,
          {
            t,
            i18nKey: "guides.builderSection.step7",
            components: { saveButtonText: /* @__PURE__ */ jsx("span", { className: "font-medium" }) }
          }
        ) }),
        /* @__PURE__ */ jsx(Note, { children: /* @__PURE__ */ jsx(
          Trans,
          {
            t,
            i18nKey: "guides.builderSection.step7Note",
            components: {
              closeIcon: /* @__PURE__ */ jsx(CloseButton, {})
            }
          }
        ) })
      ] })
    ] })
  ] });
};
const AutoSection = () => {
  const { t } = useTranslation("pages");
  const tableRef = useRef(null);
  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 pb-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold mb-8 text-text", children: t("guides.autoSection.title") }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.autoSection.selectingComponentsHeading") }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.autoSection.step1") }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.autoSection.step1Note") })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.autoSection.selectingBudgetHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.autoSection.step2",
          components: { autoBuilderText: /* @__PURE__ */ jsx("span", {}) }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.autoSection.step3") }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.autoSection.step3Note") }),
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.autoSection.step4") }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.autoSection.step4Note") })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.autoSection.generatingHeading") }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.autoSection.step5") }),
        /* @__PURE__ */ jsx(Note, { children: /* @__PURE__ */ jsx(
          Trans,
          {
            t,
            i18nKey: "guides.autoSection.step5Note",
            components: {
              link: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: scrollToTable,
                  className: "text-info hover:underline font-medium cursor-pointer"
                }
              )
            }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.autoSection.step6") }),
        /* @__PURE__ */ jsx(Note, { children: t("guides.autoSection.step6Note") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text my-5", children: t("guides.autoSection.budgetAllocationsHeading") }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", ref: tableRef, children: /* @__PURE__ */ jsxs("table", { className: "text-left text-text", children: [
        /* @__PURE__ */ jsxs("thead", { className: "bg-secondary-light/50", children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.component") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", colSpan: 2, children: t("guides.autoSection.table.budgetLow") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", colSpan: 4, children: t("guides.autoSection.table.budgetMid") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", colSpan: 5, children: t("guides.autoSection.table.budgetHigh") })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light" }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.general") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.office") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.general") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.gaming") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.office") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.streaming") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.general") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.gaming") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.office") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.rendering") }),
            /* @__PURE__ */ jsx("th", { className: "p-2 border border-secondary-light", children: t("guides.autoSection.table.streaming") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.gpu") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "24%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "27%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "25%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "27%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "25%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "22%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.cpu") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "26%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "28%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "16%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "14%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "25%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "14%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "12%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "22%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "15%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.motherboard") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "22%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "18%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "16%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.ram") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "24%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "25%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "30%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "20%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "22%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "23%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "35%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "28%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "22%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.cooler") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "—" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "3%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "3%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "3%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "3%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "2%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "2%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "2%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "2%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "2%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.case") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "9%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "8%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "5%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.psu") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "9%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "8%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "5%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "6%" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: t("guides.autoSection.table.ssd") }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "7%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "13%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "12%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "8%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "13%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "15%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "14%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "13%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "10%" }),
            /* @__PURE__ */ jsx("td", { className: "p-2 border border-border", children: "12%" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const SavedSection = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("pages");
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 pb-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold mb-8 text-text", children: t("guides.savedSection.title") }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.savedSection.viewingBuildsHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.step1",
          components: {
            savedLink: /* @__PURE__ */ jsx(
              Link,
              {
                className: "text-info hover:underline font-medium",
                to: lp("/builds")
              }
            ),
            savedButton: /* @__PURE__ */ jsx("span", { className: "font-medium" })
          }
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.savedSection.step2") }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.savedSection.viewingComponentsHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.savedSection.step3") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.step4",
          components: {
            seeInStore: /* @__PURE__ */ jsx("span", { className: "font-medium" }),
            buy: /* @__PURE__ */ jsx("span", { className: "font-medium" })
          }
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.savedSection.editingHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.editStep1",
          components: { edit: /* @__PURE__ */ jsx("span", { className: "font-medium" }) }
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.savedSection.editStep2") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.editStep3",
          components: {
            save: /* @__PURE__ */ jsx("span", { className: "font-semibold" }),
            cancel: /* @__PURE__ */ jsx("span", { className: "font-semibold" })
          }
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.savedSection.continuingHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.continueStep1",
          components: { continueBuild: /* @__PURE__ */ jsx("span", { className: "font-semibold" }) }
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-text", children: t("guides.savedSection.deletingHeading") }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: /* @__PURE__ */ jsx(
        Trans,
        {
          t,
          i18nKey: "guides.savedSection.deleteStep1",
          components: { deleteBuild: /* @__PURE__ */ jsx("span", { className: "font-semibold" }) }
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-text", children: t("guides.savedSection.deleteStep2") })
    ] })
  ] });
};
const SidePanel = ({ children, title = null, width = "lg:w-120.5", headerRight = null }) => {
  const { t } = useTranslation("pages");
  const [expanded, setExpanded] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0 z-10", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setExpanded((prev) => !prev),
        className: "bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition",
        children: /* @__PURE__ */ jsx("span", { className: "rotate-270", children: /* @__PURE__ */ jsx(ArrowIcon, { size: 32 }) })
      }
    ) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        id: "side-panel-scroll",
        className: `bg-primary flex flex-col fixed left-0 right-0 bottom-0 top-14 transition-transform lg:static ${width} lg:translate-x-0 overflow-y-auto z-10 pb-6
          ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
        children: [
          (title || headerRight) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-6 px-4", children: [
            title && /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-white", children: title }),
            headerRight && /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center gap-2", children: headerRight }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2 ml-4",
                onClick: () => setExpanded(false),
                children: /* @__PURE__ */ jsx(CloseIcon, {})
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 px-4 flex flex-col flex-1", children }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto pt-6 lg:hidden", children: /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-primary-light flex", children: /* @__PURE__ */ jsx("h2", { className: "text-6xl p-2 font-bold text-surface border border-secondary-light", children: t("components.sidePanel.brand") }) }) })
        ]
      }
    )
  ] });
};
const sectionIds = ["builder", "auto", "saved"];
const contentMap = {
  builder: /* @__PURE__ */ jsx(BuilderSection, {}),
  auto: /* @__PURE__ */ jsx(AutoSection, {}),
  saved: /* @__PURE__ */ jsx(SavedSection, {})
};
const Guide = () => {
  const { t } = useTranslation("pages");
  const [active, setActive] = useState(sectionIds[0]);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex", children: [
    /* @__PURE__ */ jsx(SidePanel, { title: t("guide.sidePanelTitle"), children: sectionIds.map((id) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActive(id),
        className: `p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer mb-2 hover:bg-secondary ${active === id ? "border-l-10" : ""}`,
        children: t(`guide.sections.${id}`)
      },
      id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 pt-6", children: contentMap[active] })
  ] });
};
const meta$9 = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/guide",
    ...pagesSeo(lang, "guide")
  });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Guide,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
const EmailVerified = () => {
  const lp = useLocalePath();
  const { t } = useTranslation("common");
  return /* @__PURE__ */ jsx("div", { className: "bg-primary h-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center px-6 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-white mt-4", children: t("verifyEmail.verifiedTitle") }),
    /* @__PURE__ */ jsx("p", { className: "text-muted mt-2 text-sm", children: t("verifyEmail.verifiedText") }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: lp("/"),
        className: "px-8 py-4 text-sm font-medium bg-secondary-light text-text hover:bg-secondary-light/50 transition",
        children: t("verifyEmail.backHome")
      }
    )
  ] }) });
};
const meta$8 = ({
  params
}) => {
  const lang = langFromParams(params);
  const common2 = lang === "en" ? enCommon : lvCommon;
  return seoMeta({
    lang,
    path: "/email-verified",
    title: common2.verifyEmail.verifiedTitle,
    noindex: true
  });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EmailVerified,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
const Login = () => {
  const lp = useLocalePath();
  const { t } = useTranslation(["auth", "pages"]);
  const { login: login2 } = useAuth();
  const navigate = useNavigate();
  const [data2, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const set = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!data2.email.trim()) e.email = t("common.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data2.email)) e.email = t("common.emailInvalid");
    if (!data2.password) e.password = t("common.passwordRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      await login2(data2.email, data2.password);
      navigate(lp("/"));
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({ email: err.response?.data?.message ?? err.message ?? "Something went wrong." });
        console.log(err.response);
      }
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full md:w-200 px-8 py-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold mb-1", children: t("login.title") }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 transition-all duration-300 bg-background", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "email", children: t("common.emailLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.email ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "email",
              type: "email",
              value: data2.email,
              onChange: set("email")
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "password", children: t("common.passwordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.password ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "password",
              type: "password",
              value: data2.password,
              onChange: set("password")
            }
          ),
          errors.password && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col mx-4 my-4", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-info", to: lp("/register"), children: t("login.createAccount") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4",
              disabled: processing,
              children: t("login.submit")
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "border-4 border-secondary m-2 h-full flex items-center justify-center p-2", children: /* @__PURE__ */ jsx("span", { className: "text-7xl font-bold text-surface", children: t("login.heroText") }) }) })
    ] })
  ] }) });
};
const login = UNSAFE_withComponentProps(function LoginRoute() {
  return /* @__PURE__ */ jsx(GuestRoute, {
    children: /* @__PURE__ */ jsx(Login, {})
  });
});
const meta$7 = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/login",
    ...pagesSeo(lang, "login"),
    noindex: true
  });
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const Register = () => {
  const lp = useLocalePath();
  const { t } = useTranslation(["auth", "pages"]);
  const { register: register2 } = useAuth();
  const navigate = useNavigate();
  const [data2, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const set = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!data2.name.trim()) e.name = t("register.nameRequired");
    else if (data2.name.trim().length < 3) e.name = t("register.nameMinLength");
    if (!data2.email.trim()) e.email = t("common.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data2.email)) e.email = t("common.emailInvalid");
    if (!data2.password) e.password = t("common.passwordRequired");
    else if (data2.password.length < 8) e.password = t("common.passwordMinLength");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(data2.password))
      e.password = t("common.passwordComplexity");
    if (!data2.password_confirmation)
      e.password_confirmation = t("register.confirmPasswordRequired");
    else if (data2.password !== data2.password_confirmation)
      e.password_confirmation = t("register.passwordsDoNotMatch");
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      await register2(data2.name, data2.email, data2.password, data2.password_confirmation);
      navigate(lp("/"));
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({ name: err.response?.data?.message ?? err.message ?? "Something went wrong." });
      }
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full md:w-200 px-8 py-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold mb-1", children: t("register.title") }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 transition-all duration-300 bg-background", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "name", children: t("register.nameLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.name ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "name",
              type: "text",
              value: data2.name,
              onChange: set("name")
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "email", children: t("common.emailLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.email ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "email",
              type: "email",
              value: data2.email,
              onChange: set("email")
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "password", children: t("common.passwordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.password ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "password",
              type: "password",
              value: data2.password,
              onChange: set("password")
            }
          ),
          errors.password && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-2 mx-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-text", htmlFor: "password_confirmation", children: t("register.confirmPasswordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: `bg-surface flex-1 p-2 ${errors.password_confirmation ? "outline-1 outline-danger" : "focus: outline-border"}`,
              id: "password_confirmation",
              type: "password",
              value: data2.password_confirmation,
              onChange: set("password_confirmation")
            }
          ),
          errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-danger", children: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col mx-4 my-4", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-info", to: lp("/login"), children: t("register.alreadyHaveAccount") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4",
              disabled: processing,
              children: t("register.submit")
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "border-4 border-secondary m-2 h-full flex items-center justify-center p-2", children: /* @__PURE__ */ jsx("span", { className: "text-7xl font-bold text-surface", children: t("register.heroText") }) }) })
    ] })
  ] }) });
};
const register = UNSAFE_withComponentProps(function RegisterRoute() {
  return /* @__PURE__ */ jsx(GuestRoute, {
    children: /* @__PURE__ */ jsx(Register, {})
  });
});
const meta$6 = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/register",
    ...pagesSeo(lang, "register"),
    noindex: true
  });
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: register,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const UNITS = {
  clock_rate: "GHz",
  turbo_frequency: "GHz",
  tdp: "W",
  tdp_support: "W",
  wattage: "W",
  min_psu: "W",
  psu_wattage: "W",
  memory_max_speed: "MHz",
  frequency: "MHz",
  vram_freq: "MHz",
  vram: "GB",
  capacity: "GB",
  max_memory_capacity: "GB",
  read_speed: "MB/s",
  write_speed: "MB/s",
  max_gpu_length: "mm",
  max_cpu_cooler_height: "mm",
  rpm: "RPM",
  rpm_min: "RPM",
  rpm_max: "RPM",
  voltage: "V",
  bus: "bit",
  size_mm: "mm",
  noise_max_db: "dB",
  fan_size_mm: "mm",
  amps_12v: "A",
  cache_mb: "MB",
  height_mm: "mm",
  max_psu_length: "mm",
  max_radiator_size: "mm"
};
const BOOLEAN_FIELDS = /* @__PURE__ */ new Set([
  "integrated_graphics",
  "cooler_included",
  "wifi",
  "xmp",
  "pcie_5",
  "psu_included"
]);
const ComponentInfo = ({ component }) => {
  const { t } = useTranslation("common");
  const formatValue = (key, value) => {
    if (key === "price") return `€${value}`;
    if (key === "stock_status") {
      return t(`stockStatus.${value}`, value);
    }
    if (key === "type") return String(value).toUpperCase();
    if (typeof value === "boolean" || BOOLEAN_FIELDS.has(key))
      return value === true || value === 1 || value === "1" ? t("yes") : t("no");
    if (value === "Nav") return t("no");
    if (value === "Ir") return t("yes");
    if (UNITS[key] !== void 0 && value !== null && value !== "") return `${value} ${UNITS[key]}`;
    return value;
  };
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(component).filter(
    ([key, value]) => value !== null && value !== "" && ![
      "id",
      "product_code",
      "url",
      "image_url",
      "scraped_at",
      "selected",
      "compatible",
      "needs_manual_check",
      "out_of_stock",
      "listings",
      "selected_source",
      "price",
      "stock_status",
      "stock_quantity"
    ].includes(key)
  ).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col wrap-anywhere", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted text-xs capitalize", children: t(`fieldLabels.${key}`, { defaultValue: key.replace(/_/g, " ") }) }),
    /* @__PURE__ */ jsx("span", { className: "text-text text-sm", children: formatValue(key, value) })
  ] }, key)) });
};
const formatPrice = (price) => parseFloat(price ?? 0).toFixed(2);
const getCheapestPrice = (component) => {
  if (!component) return 0;
  if (component.listings?.length) {
    const cheapest = Math.min(
      ...component.listings.map((l) => parseFloat(l.price ?? Infinity))
    );
    if (Number.isFinite(cheapest)) return cheapest;
  }
  return parseFloat(component.price ?? 0);
};
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const GRID_CLASSES = {
  sm: "grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]",
  xl: "grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]"
};
const LINK_CLASSES = {
  sm: "col-span-2 sm:col-span-1 sm:py-2",
  xl: "col-span-2 xl:col-span-1 xl:py-2"
};
const ListingsTable = ({ listings, breakpoint = "sm", onVisit }) => {
  const { t } = useTranslation("builder");
  const stockLabel = (listing) => {
    if (listing.stock_status === "in_stock")
      return listing.stock_quantity != null ? t("componentCard.inStockWithQty", { count: listing.stock_quantity }) : t("componentCard.inStock");
    if (listing.stock_status === "orderable")
      return listing.stock_quantity != null ? t("componentCard.orderableWithQty", { count: listing.stock_quantity }) : t("componentCard.orderable");
    return t("componentCard.outOfStock");
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: listings.map((listing) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `grid ${GRID_CLASSES[breakpoint]} items-center gap-2 border border-border bg-surface p-3 transition`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-text font-medium", children: capitalize(listing.source) }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted", children: [
          "€",
          formatPrice(listing.price)
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-muted", children: stockLabel(listing) }),
        /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: listing.scraped_at ? t("componentCard.lastScraped", {
          date: new Date(listing.scraped_at).toLocaleDateString()
        }) : t("componentCard.neverScraped") }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: listing.url,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: onVisit ? (e) => onVisit(e, listing) : void 0,
            className: `px-4 py-4 bg-primary text-white text-sm hover:bg-primary-light transition cursor-pointer text-center ${LINK_CLASSES[breakpoint]}`,
            children: t("componentCard.seeInStore")
          }
        )
      ]
    },
    listing.source
  )) });
};
const ComponentDetail = ({ component, title, onClose, actions }) => {
  const { t } = useTranslation(["builder", "common"]);
  return /* @__PURE__ */ jsxs("div", { className: "border border-border w-full hover:bg-background transition p-4 mb-auto bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl text-muted", children: title }),
        /* @__PURE__ */ jsx("h2", { className: "text-text font-semibold text-3xl", children: component.name }),
        /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: t("componentCard.startingFrom", { price: formatPrice(getCheapestPrice(component)) }) })
      ] }),
      onClose && /* @__PURE__ */ jsx(
        "button",
        {
          className: "w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2",
          onClick: onClose,
          "aria-label": t("common:close"),
          children: /* @__PURE__ */ jsx(CloseIcon, {})
        }
      )
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-4", children: actions }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col xl:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full xl:w-80 h-80 bg-surface shrink-0 flex items-center justify-center overflow-hidden", children: component.image_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: component.image_url,
          alt: component.name,
          loading: "lazy",
          className: "w-full h-full object-contain"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(ComponentInfo, { component }) })
    ] }),
    component.listings?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-text mb-2", children: t("componentCard.availabilityTitle") }),
      /* @__PURE__ */ jsx(ListingsTable, { listings: component.listings, breakpoint: "sm" })
    ] })
  ] });
};
const Modal = ({ children, close: close2 }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed backdrop-blur-xs top-0 bottom-0 left-0 right-0 flex items-center justify-center z-10",
      onClick: close2,
      children: /* @__PURE__ */ jsx("div", { className: "relative bg-background p-1 m-4", onClick: (e) => e.stopPropagation(), children })
    }
  );
};
const BuildIssuesPopup = ({ issues, x, y }) => {
  const { t } = useTranslation(["pages", "common"]);
  const popupWidth = 288;
  const offset = 12;
  const left = x + offset + popupWidth > window.innerWidth ? x - offset - popupWidth : x + offset;
  const top = y + offset;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "p-2 border border-danger/50 bg-background z-10 w-72 max-h-64 overflow-auto space-y-2",
      style: {
        position: "fixed",
        top,
        left,
        pointerEvents: "none"
      },
      children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-danger", children: t("components.buildCard.compatibilityIssues") }),
        Object.entries(issues).map(
          ([slot, slotIssues]) => slotIssues.map((issue, i) => /* @__PURE__ */ jsxs("p", { className: "text-sm text-danger", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              t(`common:components.${slot}`, { defaultValue: slot }),
              ":",
              " "
            ] }),
            issue
          ] }, `${slot}-${i}`))
        )
      ]
    }
  );
};
const currentLang = () => typeof document !== "undefined" ? document.documentElement.lang || "lv" : "lv";
const formatDate = (date, options = { year: "numeric", month: "short", day: "numeric" }) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(currentLang(), options);
};
const SLOT_KEYS = [
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "ssd",
  "hdd",
  "pc_case",
  "cooler",
  "psu",
  "fan"
];
const SavedBuilds = () => {
  const { t } = useTranslation(["pages", "builder"]);
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [builds2, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loadingBuild, setLoadingBuild] = useState(false);
  useEffect(() => {
    axios.get("/api/builds").then((res) => setBuilds(res.data));
  }, []);
  useEffect(() => {
    const buildId = searchParams.get("buildId");
    if (buildId) {
      handleSelect({ id: buildId });
    }
  }, [searchParams]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", notes: "" });
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [buildIssues, setBuildIssues] = useState({});
  const [issuesPopup, setIssuesPopup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);
  useEffect(() => {
    if (!selectedBuild) {
      setBuildIssues({});
      return;
    }
    const selected = Object.fromEntries(
      SLOT_KEYS.map((slot) => [slot === "pc_case" ? "case" : slot, selectedBuild[slot]]).filter(([, component]) => component !== null && component !== void 0).map(([key, component]) => [key, component.product_code])
    );
    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }
    axios.post("/api/builder/validate", { selected }).then((res) => setBuildIssues(res.data.issues)).catch(() => setBuildIssues({}));
  }, [selectedBuild]);
  const handleIssuesPopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIssuesPopup({ x: rect.left, y: rect.bottom });
  };
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);
  const handleExpandSlot = (slot) => {
    setExpandedSlot((prev) => prev === slot ? null : slot);
  };
  const handleSelect = async (build) => {
    setLoadingBuild(true);
    setEditing(false);
    setExpandedSlot(null);
    setMenuOpen(false);
    try {
      const res = await axios.get(`/api/builds/${build.id}`);
      setSelectedBuild(res.data);
      setEditData({ name: res.data.name, notes: res.data.notes ?? "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBuild(false);
    }
  };
  const refreshBuilds = () => axios.get("/api/builds").then((res) => setBuilds(res.data));
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/builds/${id}`);
      if (selectedBuild?.id === id) setSelectedBuild(null);
      refreshBuilds();
      addToast(res.data.message, { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.error ?? t("savedBuilds.deleteError"), {
        type: "danger"
      });
    }
  };
  const handleSaveEdit = async () => {
    try {
      const res = await axios.patch(`/api/builds/${selectedBuild.id}`, editData);
      setSelectedBuild(res.data);
      setEditing(false);
      refreshBuilds();
    } catch (err) {
      console.error(err);
    }
  };
  const copyShareLink = async (token) => {
    const url = `${window.location.origin}/builder?shared=${token}`;
    await navigator.clipboard.writeText(url);
    addToast(t("savedBuilds.shareLinkCopied"), { type: "success" });
  };
  const handleShare = async () => {
    setMenuOpen(false);
    try {
      const res = await axios.post(`/api/builds/${selectedBuild.id}/share`, { enabled: true });
      setSelectedBuild((prev) => ({ ...prev, ...res.data }));
      refreshBuilds();
      await copyShareLink(res.data.share_token);
    } catch (err) {
      addToast(err.response?.data?.error ?? t("savedBuilds.shareError"), { type: "danger" });
    }
  };
  const handleUnshare = async () => {
    setMenuOpen(false);
    try {
      const res = await axios.post(`/api/builds/${selectedBuild.id}/share`, { enabled: false });
      setSelectedBuild((prev) => ({ ...prev, ...res.data }));
      refreshBuilds();
      addToast(t("savedBuilds.unshared"), { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.error ?? t("savedBuilds.shareError"), { type: "danger" });
    }
  };
  const expandedComponent = expandedSlot ? selectedBuild?.[expandedSlot] : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "h-full flex", children: [
      /* @__PURE__ */ jsx(SidePanel, { title: t("savedBuilds.sidePanelTitle"), children: /* @__PURE__ */ jsx("div", { className: "max-h-100", children: builds2.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted", children: t("savedBuilds.noSavedBuilds") }) : builds2.map((build) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => handleSelect(build),
          className: `hover:bg-secondary border transition-all cursor-pointer p-2 flex justify-between items-center border-secondary mb-2 ${selectedBuild?.id === build.id ? "border-l-10" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-white font-semibold text-xl", children: build.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-muted text-sm", children: [
                "€",
                formatPrice(build.total_price)
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setDeleting(build.id);
                },
                className: "text-muted hover:text-danger transition p-2 cursor-pointer",
                children: /* @__PURE__ */ jsx(TrashIcon, { size: 20 })
              }
            )
          ]
        },
        build.id
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-6 px-4 mb-6", children: [
        loadingBuild && /* @__PURE__ */ jsx("p", { className: "text-muted", children: t("savedBuilds.loading") }),
        !loadingBuild && !selectedBuild && /* @__PURE__ */ jsx("p", { className: "font-medium text-text text-center", children: t("savedBuilds.selectBuildPrompt") }),
        !loadingBuild && selectedBuild && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          editing ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: editData.name,
                onChange: (e) => setEditData((prev) => ({ ...prev, name: e.target.value })),
                className: "bg-surface border border-border text-text p-2 w-full focus:outline-1 outline-border"
              }
            ),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: editData.notes,
                onChange: (e) => setEditData((prev) => ({
                  ...prev,
                  notes: e.target.value
                })),
                placeholder: t("savedBuilds.notesPlaceholder"),
                className: "bg-surface border border-border text-text p-2 w-full focus:outline-1 outline-border"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleSaveEdit,
                  className: "bg-primary text-white p-4 flex-1 hover:bg-primary-light transition cursor-pointer",
                  children: t("savedBuilds.save")
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditing(false),
                  className: "bg-surface text-muted p-4 flex-1 hover:bg-secondary-light transition cursor-pointer",
                  children: t("savedBuilds.cancel")
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-text font-semibold text-3xl uppercase", children: selectedBuild.name }),
                  selectedBuild.type && /* @__PURE__ */ jsx("span", { className: "py-0.5 px-3 text-text border border-border bg-secondary-light", children: t(`builder:buildInfo.${selectedBuild.type}`, {
                    defaultValue: selectedBuild.type
                  }) }),
                  Object.keys(buildIssues).length > 0 && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "text-danger/80 hover:text-danger/60 transition flex gap-2",
                      onMouseEnter: handleIssuesPopup,
                      onMouseLeave: () => setIssuesPopup(null),
                      children: /* @__PURE__ */ jsx(InfoIcon, {})
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-muted text-sm", children: formatDate(selectedBuild.created_at) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    ref: menuButtonRef,
                    onClick: () => setMenuOpen((prev) => !prev),
                    className: `p-2 transition cursor-pointer ${menuOpen ? "text-text" : "text-muted hover:text-text"}`,
                    children: /* @__PURE__ */ jsx(DotsIcon, { size: 20 })
                  }
                ),
                menuOpen && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    ref: menuRef,
                    className: "absolute right-0 top-10 w-72 bg-background border border-border shadow z-10",
                    children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => {
                            setEditing(true);
                            setMenuOpen(false);
                          },
                          className: "w-full px-4 py-2 text-left text-text hover:bg-secondary-light transition cursor-pointer",
                          children: t("savedBuilds.edit")
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => {
                            setDeleting(selectedBuild.id);
                            setMenuOpen(false);
                          },
                          className: "w-full px-4 py-2 text-left text-danger hover:bg-danger/20 transition cursor-pointer",
                          children: t("savedBuilds.delete")
                        }
                      )
                    ]
                  }
                )
              ] })
            ] }),
            selectedBuild.notes && /* @__PURE__ */ jsx("p", { className: "text-muted mt-1", children: selectedBuild.notes })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-text font-semibold text-2xl", children: [
              "€",
              formatPrice(selectedBuild.total_price)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse xl:flex-row items-stretch gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative xl:w-64 my-auto", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex border border-border", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      readOnly: true,
                      disabled: !selectedBuild.is_public,
                      value: selectedBuild.share_token ? `${window.location.origin}/builder?shared=${selectedBuild.share_token}` : "",
                      className: "flex-1 min-w-0 bg-surface text-text px-3 truncate outline-none py-1 disabled:text-muted disabled:cursor-not-allowed"
                    }
                  ),
                  selectedBuild.is_public ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => copyShareLink(selectedBuild.share_token),
                      className: "px-3 text-background hover:text-white bg-primary hover:bg-primary-light transition cursor-pointer",
                      children: /* @__PURE__ */ jsx(CopyIcon, { size: 18 })
                    }
                  ) : /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleShare,
                      className: "px-4 text-background hover:text-white bg-primary hover:bg-primary-light transition cursor-pointer",
                      children: t("savedBuilds.share")
                    }
                  )
                ] }),
                selectedBuild.is_public && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleUnshare,
                    className: "absolute -bottom-5 left-0 text-muted hover:text-danger text-sm transition cursor-pointer",
                    children: t("savedBuilds.unshare")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  className: "py-4 px-8 bg-primary text-white text-center cursor-pointer hover:bg-primary-light transition",
                  to: `/builder?build=${selectedBuild.id}`,
                  children: t("savedBuilds.continueBuild")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 xl:grid-cols-3 gap-4", children: SLOT_KEYS.map((slot) => {
            const component = selectedBuild[slot];
            if (!component) return null;
            const isExpanded = expandedSlot === slot;
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => handleExpandSlot(slot),
                  className: `flex cursor-pointer transition-all border border-border ${isExpanded ? "bg-secondary-light hover:bg-secondary-light/80" : "bg-surface hover:bg-secondary-light"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-background shrink-0 m-2 flex items-center justify-center overflow-hidden", children: component.image_url && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: component.image_url,
                        alt: component.name,
                        className: "w-full h-full object-contain"
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 m-2 ml-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: t(`savedBuilds.slotLabels.${slot}`) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-muted text-sm", children: [
                          "€",
                          formatPrice(component.price)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "text-text line-clamp-2", children: component.name })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `lg:hidden grid transition-all overflow-hidden ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
                  children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
                    ComponentDetail,
                    {
                      component,
                      title: t(`savedBuilds.slotLabels.${slot}`),
                      onClose: () => setExpandedSlot(null)
                    }
                  ) })
                }
              )
            ] }, slot);
          }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `hidden lg:grid transition-all overflow-hidden ${expandedComponent ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
              children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: expandedComponent && /* @__PURE__ */ jsx(
                ComponentDetail,
                {
                  component: expandedComponent,
                  title: t(`savedBuilds.slotLabels.${expandedSlot}`),
                  onClose: () => setExpandedSlot(null)
                }
              ) })
            }
          )
        ] })
      ] })
    ] }),
    issuesPopup && /* @__PURE__ */ jsx(BuildIssuesPopup, { issues: buildIssues, ...issuesPopup }),
    deleting && /* @__PURE__ */ jsxs(Modal, { close: () => setDeleting(null), children: [
      /* @__PURE__ */ jsx("h1", { className: "text-text text-3xl mb-10 m-4 max-w-120", children: t("savedBuilds.deleteConfirmTitle") }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 m-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition",
            onClick: () => {
              handleDelete(deleting);
              setDeleting(null);
            },
            children: t("savedBuilds.delete")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition",
            onClick: () => setDeleting(null),
            children: t("savedBuilds.cancel")
          }
        )
      ] })
    ] })
  ] });
};
const builds = UNSAFE_withComponentProps(function BuildsRoute() {
  return /* @__PURE__ */ jsx(AuthRoute, {
    children: /* @__PURE__ */ jsx(SavedBuilds, {})
  });
});
const meta$5 = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/builds",
    ...pagesSeo(lang, "savedBuilds"),
    noindex: true
  });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: builds,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const AccountSettings = () => {
  const { t } = useTranslation(["profile", "common"]);
  const { user, setUser, resendVerification } = useAuth();
  const { addToast } = useToast();
  const [resending, setResending] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [error2, setError] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [passError, setPassError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editActive) {
      setEditActive(true);
      return;
    }
    if (name.length < 3) {
      setError(t("accountSettings.nameTooShort"));
      return;
    }
    try {
      const res = await axios.patch(`/api/users/${user.id}`, {
        name
      });
      if (res.status === 200) {
        setUser(res.data);
        setError("");
        addToast(t("accountSettings.infoUpdated"), { type: "success" });
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors ? Object.values(errors).flat().join(", ") : t("accountSettings.infoUpdateError")
      );
    } finally {
      setEditActive(false);
    }
  };
  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/api/users/${user.id}`, {
        password: oldPass,
        new_password: newPass,
        new_password_confirmation: newPassConfirm
      });
      if (res.status === 200) {
        setPassError("");
        addToast(t("accountSettings.passwordUpdated"), { type: "success" });
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setPassError(
        errors ? Object.values(errors).flat().map((err2, i) => /* @__PURE__ */ jsx("span", { className: "text-danger text-sm block", children: err2 }, i)) : t("accountSettings.passwordUpdateError")
      );
    } finally {
      setOldPass("");
      setNewPass("");
      setNewPassConfirm("");
    }
  };
  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerification();
      addToast(t("common:verifyEmail.resendSuccess"), { type: "success" });
    } catch (err) {
      addToast(err.response?.data?.message ?? t("common:verifyEmail.resendError"), {
        type: "danger"
      });
    } finally {
      setResending(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== t("accountSettings.deleteConfirmKeyword")) {
      setDeleteError(t("accountSettings.deleteConfirmIncorrect"));
      return;
    }
    try {
      await axios.delete(`/api/users/${user.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "py-6 px-4", children: [
    !user.email_verified_at && /* @__PURE__ */ jsxs("div", { className: "bg-alert/10 border border-alert/80 px-4 py-2 mb-4 flex gap-4 items-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-alert", children: /* @__PURE__ */ jsx(AlertIcon, {}) }),
      /* @__PURE__ */ jsx("p", { className: "text-alert text-sm flex-1", children: t("common:verifyEmail.banner") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleResendVerification,
          disabled: resending,
          className: "text-alert text-sm underline hover:no-underline cursor-pointer disabled:opacity-50 whitespace-nowrap",
          children: t("common:verifyEmail.resend")
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl text-text font-semibold mb-4", children: t("accountSettings.heading") }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl text-text font-semibold mb-4", children: t("accountSettings.personalInfoHeading") }),
    /* @__PURE__ */ jsxs("p", { className: "text-muted mb-4", children: [
      user.email,
      " · ",
      /* @__PURE__ */ jsx("span", { className: user.email_verified_at ? "text-success" : "text-alert", children: user.email_verified_at ? t("accountSettings.emailVerified") : t("accountSettings.emailNotVerified") }),
      !user.email_verified_at && /* @__PURE__ */ jsxs(Fragment, { children: [
        " · ",
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleResendVerification,
            disabled: resending,
            className: "text-alert underline hover:no-underline cursor-pointer disabled:opacity-50",
            children: t("common:verifyEmail.resend")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { children: [
      /* @__PURE__ */ jsx("div", { className: "grid xl:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-muted", htmlFor: "name", children: t("accountSettings.nameLabel") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition",
            type: "text",
            id: "name",
            value: name,
            onChange: (e) => setName(e.target.value),
            disabled: !editActive
          }
        )
      ] }) }),
      error2 && /* @__PURE__ */ jsx("p", { className: "text-danger text-sm", children: error2 }),
      /* @__PURE__ */ jsxs("div", { className: "space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "py-2 px-6 bg-primary text-white hover:bg-primary-light cursor-pointer mt-2 transition",
            onClick: handleEdit,
            children: editActive ? t("accountSettings.save") : t("accountSettings.edit")
          }
        ),
        editActive && /* @__PURE__ */ jsx(
          "button",
          {
            className: "py-2 px-6 bg-surface text-text hover:bg-secondary-light cursor-pointer mt-2 transition",
            onClick: (e) => {
              setEditActive(false);
              setName(user.name);
              setError("");
            },
            children: t("accountSettings.cancel")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl text-text font-semibold my-4", children: t("accountSettings.changePasswordHeading") }),
    /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-muted", htmlFor: "oldPass", children: t("accountSettings.oldPasswordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition",
              type: "password",
              id: "oldPass",
              value: oldPass,
              onChange: (e) => setOldPass(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsxs("div", { className: "", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-muted", htmlFor: "newPass", children: t("accountSettings.newPasswordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition",
              type: "password",
              id: "newPass",
              value: newPass,
              onChange: (e) => setNewPass(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-muted", htmlFor: "newPassConfirm", children: t("accountSettings.confirmNewPasswordLabel") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition",
              type: "password",
              id: "newPassConfirm",
              value: newPassConfirm,
              onChange: (e) => setNewPassConfirm(e.target.value)
            }
          )
        ] })
      ] }),
      passError && /* @__PURE__ */ jsx("p", { className: "text-danger text-sm", children: passError }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "py-2 px-6 bg-primary text-white hover:bg-primary-light cursor-pointer mt-2 transition disabled:text-muted",
          disabled: !oldPass || !newPass || !newPassConfirm,
          children: t("accountSettings.save")
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl text-text font-semibold my-4", children: t("accountSettings.deleteAccountHeading") }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "py-4 px-8 bg-primary text-white hover:bg-danger/80 cursor-pointer mt-2 transition disabled:text-muted mb-6",
        onClick: () => setDeleting(true),
        children: t("accountSettings.deleteAccountButton")
      }
    ),
    deleting && /* @__PURE__ */ jsxs(Modal, { close: () => setDeleting(false), children: [
      /* @__PURE__ */ jsx("h1", { className: "text-text font-semibold text-3xl mt-4 mx-4 max-w-120", children: t("accountSettings.deleteConfirmTitle") }),
      /* @__PURE__ */ jsx("p", { className: "text-muted text-sm mb-4 mx-4", children: t("accountSettings.deleteConfirmSubtitle") }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col m-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-muted", children: [
          t("accountSettings.deleteConfirmInstruction"),
          /* @__PURE__ */ jsxs("span", { className: "text-danger", children: [
            " ",
            t("accountSettings.deleteConfirmKeyword"),
            " "
          ] }),
          t("accountSettings.deleteConfirmInstructionSuffix")
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "text-danger p-2 bg-surface focus:outline outline-border",
            value: deleteConfirm,
            onChange: (e) => setDeleteConfirm(e.target.value)
          }
        )
      ] }),
      deleteError && /* @__PURE__ */ jsx("p", { className: "text-danger text-sm", children: deleteError }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 m-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition",
            onClick: handleDeleteAccount,
            children: t("accountSettings.delete")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition",
            onClick: () => {
              setDeleting(false);
              setDeleteError("");
            },
            children: t("accountSettings.cancelDelete")
          }
        )
      ] })
    ] })
  ] });
};
const profile = UNSAFE_withComponentProps(function ProfileRoute() {
  return /* @__PURE__ */ jsx(AuthRoute, {
    children: /* @__PURE__ */ jsx(AccountSettings, {})
  });
});
const meta$4 = ({
  params
}) => {
  const lang = langFromParams(params);
  const profile2 = lang === "en" ? enProfile : lvProfile;
  return seoMeta({
    lang,
    path: "/profile",
    title: profile2.accountSettings.heading,
    noindex: true
  });
};
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: profile,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const BuilderContext = createContext();
const useBuilder = () => useContext(BuilderContext);
const BuildMetaContext = createContext();
const useBuildMeta = () => useContext(BuildMetaContext);
const ClosedSection = ({ children, title }) => {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((prev) => !prev),
        className: "w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: title }),
          /* @__PURE__ */ jsx(ArrowIcon, { active: open })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden space-y-2 px-px", children })
      }
    )
  ] });
};
const BuildDesc = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { selectedComponents, warnings, notes, buildIssues, buildWarnings, validateFailed } = useBuilder();
  const { buildId, buildName } = useBuildMeta();
  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + getCheapestPrice(c), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;
  const manualCheckSlots = Object.entries(selectedComponents).filter(
    ([, component]) => component?.needs_manual_check === true
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    buildId && /* @__PURE__ */ jsx("p", { className: "text-secondary-light text-sm", children: t("buildDesc.currentlyEditing", { name: buildName }) }),
    /* @__PURE__ */ jsxs("div", { className: "border border-secondary p-4 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-secondary-light text-sm", children: t("buildDesc.total") }),
        /* @__PURE__ */ jsxs("span", { className: "text-secondary-light font-semibold text-xl", children: [
          "€",
          total.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-secondary-light text-sm", children: t("buildDesc.components") }),
        /* @__PURE__ */ jsxs("span", { className: "text-secondary-light text-sm", children: [
          count,
          "/",
          totalSlots
        ] })
      ] })
    ] }),
    validateFailed && /* @__PURE__ */ jsx("div", { className: "border border-alert/80 bg-alert/10 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: t("buildDesc.validateFailed") }) }),
    (Object.keys(buildIssues).length > 0 || Object.keys(buildWarnings).length > 0 || manualCheckSlots.length > 0) && /* @__PURE__ */ jsx(ClosedSection, { title: t("buildDesc.compatibility"), children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      Object.entries(buildIssues).map(
        ([slot, issues]) => issues.map((issue, i) => /* @__PURE__ */ jsx("div", { className: "border border-danger/80 bg-danger/10 p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-danger text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            t(`common:components.${slot}`, { defaultValue: slot }),
            ":",
            " "
          ] }),
          issue
        ] }) }, `issue-${slot}-${i}`))
      ),
      Object.entries(buildWarnings).map(
        ([slot, warningList]) => warningList.map((warning, i) => /* @__PURE__ */ jsx("div", { className: "border border-alert/80 bg-alert/10 p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-alert text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            t(`common:components.${slot}`, { defaultValue: slot }),
            ":",
            " "
          ] }),
          warning
        ] }) }, `warn-${slot}-${i}`))
      ),
      manualCheckSlots.map(([slot]) => /* @__PURE__ */ jsx("div", { className: "border border-alert/80 bg-alert/10 p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-alert text-sm", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          t(`common:components.${slot}`, { defaultValue: slot }),
          ":",
          " "
        ] }),
        t("componentCard.checkManually")
      ] }) }, `manual-check-${slot}`))
    ] }) }),
    (warnings?.length > 0 || notes?.length > 0) && /* @__PURE__ */ jsxs(ClosedSection, { title: t("buildDesc.aboutThisBuild"), children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        notes.map((note, i) => /* @__PURE__ */ jsx("div", { className: "border border-info/80 bg-info/10 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-info text-sm", children: note }) }, i)),
        warnings.map((warning, i) => /* @__PURE__ */ jsx("div", { className: "border border-alert/80 bg-alert/10 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: warning }) }, i))
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted border-l pl-4 mt-2", children: t("buildDesc.fullyFunctionalNote") })
    ] })
  ] });
};
const EMPTY_SLOTS = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
  ssd: null,
  hdd: null,
  case: null,
  fan: null,
  cooler: null
};
const selectedProductCodes = (selectedComponents) => Object.fromEntries(
  Object.entries(selectedComponents).filter(([, component]) => component !== null).map(([type, component]) => [type, component.product_code])
);
const hasIncompatibleSelection = (selectedComponents, buildIssues = {}) => Object.values(selectedComponents).some(
  (component) => component !== null && component.compatible === false
) || Object.keys(buildIssues).length > 0;
const needsManualCheckSelection = (selectedComponents) => Object.values(selectedComponents).some(
  (component) => component !== null && component.needs_manual_check === true
);
const STORAGE_KEY = "pcbuilder.draft.v1";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
const isEmptyDraft = (draft) => {
  const hasComponent = Object.values(draft.selectedComponents ?? {}).some((c) => c !== null);
  return !hasComponent && !draft.buildName && !draft.buildNotes && !draft.buildType;
};
const loadDraft = () => {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let draft;
  try {
    draft = JSON.parse(raw);
  } catch {
    clearDraft();
    return null;
  }
  if (!draft.savedAt || Date.now() - draft.savedAt > MAX_AGE_MS) {
    clearDraft();
    return null;
  }
  return {
    buildId: draft.buildId ?? void 0,
    selectedComponents: { ...EMPTY_SLOTS, ...draft.selectedComponents ?? {} },
    buildName: draft.buildName ?? "",
    buildNotes: draft.buildNotes ?? "",
    buildType: draft.buildType ?? ""
  };
};
const saveDraft = ({ buildId, selectedComponents, buildName, buildNotes, buildType }) => {
  const draft = { buildId, selectedComponents, buildName, buildNotes, buildType };
  if (isEmptyDraft(draft)) {
    clearDraft();
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
  }
};
const clearDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
};
let nudgeShownThisLoad = false;
const BuildInfo = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const {
    selectedComponents,
    setSelectedComponents,
    closePicker,
    setWarnings,
    setBuildIssues,
    setNotes,
    buildIssues
  } = useBuilder();
  const lp = useLocalePath();
  const {
    buildId,
    setBuildId,
    buildName,
    setBuildName,
    buildNotes,
    setBuildNotes,
    buildType,
    setBuildType,
    restoredDraft,
    setRestoredDraft
  } = useBuildMeta();
  const [, setSearchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error2, setError] = useState("");
  const hasComponents = Object.values(selectedComponents).some(
    (v) => v !== null
  );
  useEffect(() => {
    if (nudgeShownThisLoad || !restoredDraft) return;
    nudgeShownThisLoad = true;
    addToast(t("buildInfo.restoredNudge"), { type: "info" });
  }, [restoredDraft, addToast, t]);
  const handleRemove = (name) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null
    }));
    closePicker();
  };
  const handleSave = async (asNew = false) => {
    if (!buildName.trim()) {
      setError(t("buildInfo.enterBuildName"));
      return;
    }
    const components2 = selectedProductCodes(selectedComponents);
    if (Object.keys(components2).length === 0) {
      setError(t("buildInfo.selectAtLeastOne"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await axios.post("/api/builds", {
        build_id: asNew ? void 0 : buildId,
        name: buildName,
        notes: buildNotes,
        type: buildType,
        components: components2
      });
      setBuildId(res.data.id);
      setSearchParams(
        (prev) => {
          const next2 = new URLSearchParams(prev);
          next2.set("build", res.data.id);
          return next2;
        },
        { replace: true }
      );
      clearDraft();
      addToast(
        asNew ? t("buildInfo.savedAsNew") : t("buildInfo.savedSuccessfully"),
        { type: "success" }
      );
    } catch (err) {
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t("common:verifyEmail.gatedAction"), { type: "danger" });
      } else {
        addToast(err.response?.data?.error ?? t("buildInfo.failedToSave"), {
          type: "danger"
        });
      }
    } finally {
      setSaving(false);
    }
  };
  const handleClear = () => {
    clearDraft();
    setRestoredDraft(false);
    setSelectedComponents(
      (prev) => Object.fromEntries(Object.keys(prev).map((key) => [key, null]))
    );
    setBuildName("");
    setBuildNotes("");
    setBuildType("");
    setWarnings([]);
    setBuildIssues({});
    setNotes([]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
    hasComponents ? Object.entries(selectedComponents).filter(([_, value]) => value).map(([key, value]) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex border border-muted hover:bg-primary-light transition relative",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "overflow-hidden flex", children: [
            /* @__PURE__ */ jsxs("span", { className: "capitalize text-secondary-light p-2 whitespace-nowrap shrink-0", children: [
              t(`common:components.${key}`),
              ":",
              " "
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-surface p-2 truncate", children: value.name })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "p-2 bg-secondary text-muted hover:bg-danger/50 hover:text-danger/70 cursor-pointer transition border-l border-muted ml-auto",
              onClick: () => handleRemove(key),
              "aria-label": t("componentCard.remove"),
              children: /* @__PURE__ */ jsx(CloseIcon, {})
            }
          ),
          buildIssues[key]?.length > 0 && /* @__PURE__ */ jsx("div", { className: "bg-danger/10 absolute w-full h-full pointer-events-none border-2 border-danger/20" })
        ]
      },
      key
    )) : /* @__PURE__ */ jsx("p", { className: "text-secondary-light mb-4", children: t("buildInfo.selectComponents") }),
    (buildId || hasComponents) && !user && /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-primary-light", children: /* @__PURE__ */ jsxs("p", { className: "text-secondary-light", children: [
      t("buildInfo.loginToSave"),
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-info/80 cursor-pointer hover:underline",
          to: lp("/login"),
          children: t("buildInfo.loginLink")
        }
      ),
      "."
    ] }) }),
    (buildId || hasComponents) && user && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-primary-light", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-secondary-light", htmlFor: "name", children: t("buildInfo.nameLabel") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: buildName,
            onChange: (e) => setBuildName(e.target.value),
            id: "name",
            placeholder: t("buildInfo.namePlaceholder"),
            className: "bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full"
          }
        ),
        error2 && /* @__PURE__ */ jsx("p", { className: "text-danger text-sm", children: error2 })
      ] }),
      /* @__PURE__ */ jsx("label", { className: "text-secondary-light", htmlFor: "notes", children: t("buildInfo.notesLabel") }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full",
          value: buildNotes,
          placeholder: t("buildInfo.notesPlaceholder"),
          onChange: (e) => setBuildNotes(e.target.value),
          id: "notes"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "buildType", className: "text-secondary-light", children: t("buildInfo.buildTypeLabel") }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            onChange: (e) => setBuildType(e.target.value),
            className: "p-2 text-secondary-light text-sm border hover:outline focus:outline outline-surface transition",
            value: buildType,
            id: "buildType",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: t("buildInfo.none") }),
              /* @__PURE__ */ jsx("option", { value: "gaming", children: t("buildInfo.gaming") }),
              /* @__PURE__ */ jsx("option", { value: "office", children: t("buildInfo.office") }),
              /* @__PURE__ */ jsx("option", { value: "rendering", children: t("buildInfo.rendering") }),
              /* @__PURE__ */ jsx("option", { value: "streaming", children: t("buildInfo.streaming") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSave(),
            disabled: saving,
            className: "py-4 px-8 bg-secondary text-left text-white hover:bg-success/50 cursor-pointer disabled:opacity-50 transition flex-1",
            children: saving ? t("buildInfo.saving") : t("buildInfo.saveBuild")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "py-4 px-8 bg-secondary text-white hover:bg-danger/50 cursor-pointer disabled:opacity-50 transition",
            onClick: handleClear,
            children: t("buildInfo.clearBuild")
          }
        )
      ] }),
      buildId && /* @__PURE__ */ jsx(
        "button",
        {
          className: "text-secondary-light hover:text-muted transition cursor-pointer border px-4 py-2 text-sm",
          onClick: () => handleSave(true),
          children: t("buildInfo.saveAsNewBuild")
        }
      )
    ] })
  ] });
};
const BudgetSlider = ({
  value,
  onChange,
  min = 350,
  max = 1e4,
  recommended = 1,
  step = 50,
  showRemaining = true
}) => {
  const { t } = useTranslation("builder");
  const { selectedComponents } = useBuilder();
  const [inputValue, setInputValue] = useState(value);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + getCheapestPrice(c), 0);
  const remaining = value - total;
  const percentage = ((isUnlimited ? min : value) - min) / (max - min) * 100;
  const reccomendedPercentage = (recommended - min) / (max - min) * 100;
  const clamp = (val) => {
    const num = parseInt(val);
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  };
  const handleBlur = () => {
    const clamped = clamp(inputValue);
    setInputValue(clamped);
    onChange(clamped);
  };
  const handleSlider = (e) => {
    const val = parseInt(e.target.value);
    setInputValue(val);
    onChange(val);
  };
  const handleUnlimited = (e) => {
    const checked = e.target.checked;
    setIsUnlimited(checked);
    if (checked) {
      onChange(null);
    } else {
      const restored = clamp(inputValue);
      onChange(restored);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 my-2 mt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "accent-secondary-light",
          id: "unlimited",
          type: "checkbox",
          checked: isUnlimited,
          onChange: handleUnlimited
        }
      ),
      /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: "unlimited", children: t("budgetSlider.anyBudget") })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex justify-between items-center transition-opacity ${isUnlimited ? "opacity-40 pointer-events-none" : ""}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-secondary-light text-sm", children: t("budgetSlider.totalBudget") }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: "€" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: isUnlimited ? "-" : inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onBlur: handleBlur,
                onKeyDown: (e) => e.key === "Enter" && e.target.blur(),
                disabled: isUnlimited,
                "aria-label": t("budgetSlider.totalBudget"),
                className: "text-secondary-light font-semibold w-13 text-right focus:outline-none"
              }
            )
          ] })
        ]
      }
    ),
    showRemaining && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex justify-between items-center transition-opacity ${isUnlimited ? "opacity-40 pointer-events-none" : ""}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-secondary-light text-sm", children: t("budgetSlider.remainingBudget") }),
          /* @__PURE__ */ jsxs("div", { className: "space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: "€" }),
            /* @__PURE__ */ jsx("span", { className: "text-secondary-light font-semibold", children: isUnlimited ? "-" : remaining.toFixed(2) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      !isUnlimited && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-danger/50 pointer-events-none z-15",
          style: { width: `${reccomendedPercentage}%` }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute w-full left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-secondary pointer-events-none z-5" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-secondary-light pointer-events-none z-10",
          style: { width: `${percentage}%` }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min,
          max,
          step,
          value: isUnlimited ? min : value,
          onChange: handleSlider,
          disabled: isUnlimited,
          "aria-label": t("budgetSlider.totalBudget"),
          className: `relative z-20 w-full h-2 appearance-none bg-transparent transition-opacity 
            ${isUnlimited ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            ${value <= recommended ? "accent-danger/80" : "accent-secondary-light"}
          `
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-muted text-xs", children: [
        "€",
        min.toLocaleString()
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted text-xs", children: [
        "€",
        max.toLocaleString()
      ] })
    ] })
  ] });
};
const RECOMMENDED_BUDGETS = {
  gaming: 1e3,
  office: 600,
  streaming: 1200,
  rendering: 1500
};
const MIN_TYPE_BUDGETS = {
  gaming: 500,
  streaming: 500,
  rendering: 1500
};
const typeAvailableFor = (type, budget) => !budget || !MIN_TYPE_BUDGETS[type] || budget >= MIN_TYPE_BUDGETS[type];
const BuildGenerator = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const {
    selectedComponents,
    setSelectedComponents,
    closePicker,
    setWarnings,
    setNotes,
    buildIssues
  } = useBuilder();
  const { setBuildType } = useBuildMeta();
  const lp = useLocalePath();
  const [loading2, setLoading] = useState(false);
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
    include_orderable: true
  });
  const [info, setInfo] = useState("");
  const recommendedBudget = RECOMMENDED_BUDGETS[preferences.type] ?? 600;
  const updateInfo = (newBudget, newType) => {
    const recommended = RECOMMENDED_BUDGETS[newType] ?? 600;
    if (newBudget && newBudget < recommended) {
      setInfo(t("buildGenerator.recommendBudgetIncrease"));
    } else {
      setInfo("");
    }
  };
  const updatePref = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    updateInfo(budget, newPrefs.type);
  };
  const updateBudget = (value) => {
    setBudget(value);
    const newType = preferences.type && !typeAvailableFor(preferences.type, value) ? null : preferences.type;
    if (newType !== preferences.type) {
      setPreferences((prev) => ({ ...prev, type: newType }));
    }
    updateInfo(value, newType);
  };
  const handleGenerate = async () => {
    setLoading(true);
    setWarnings([]);
    setNotes([]);
    try {
      const selected = selectedProductCodes(selectedComponents);
      const res = await axios.post("/api/builder", {
        selected,
        budget,
        preferences
      });
      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build
        }));
        setBuildType(res.data.type);
        closePicker();
        setWarnings(res.data.warnings);
        setNotes(res.data.notes);
        addToast(t("buildGenerator.generateSuccess"), { type: "success" });
        document.getElementById("side-panel-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
        document.getElementById("page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        addToast(res.data.error, { type: "danger" });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t("common:verifyEmail.gatedAction"), { type: "danger" });
      } else {
        addToast(
          err.response?.data?.error ?? t("buildGenerator.somethingWentWrong"),
          { type: "danger" }
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const hasIncompatible = hasIncompatibleSelection(selectedComponents, buildIssues);
  const needsManualCheck = needsManualCheckSelection(selectedComponents);
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "pt-4 border-t mt-4 border-secondary", children: /* @__PURE__ */ jsx(ClosedSection, { title: t("buildGenerator.title"), children: /* @__PURE__ */ jsxs("p", { className: "text-muted text-sm", children: [
      t("buildGenerator.loginRequired"),
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-info/80 cursor-pointer hover:underline",
          to: lp("/login"),
          children: t("buildGenerator.loginLink")
        }
      ),
      "."
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "pt-4 border-t mt-4 border-secondary", children: /* @__PURE__ */ jsxs(ClosedSection, { title: t("buildGenerator.title"), children: [
    /* @__PURE__ */ jsxs("p", { className: "text-muted text-sm", children: [
      t("buildGenerator.intro"),
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-info/80 cursor-pointer hover:underline",
          to: lp("/guide"),
          children: t("buildGenerator.guideLink")
        }
      ),
      " ",
      t("buildGenerator.guideSuffix")
    ] }),
    /* @__PURE__ */ jsx(
      BudgetSlider,
      {
        value: budget,
        onChange: updateBudget,
        recommended: recommendedBudget
      }
    ),
    info && /* @__PURE__ */ jsx("div", { className: "p-2 border bg-alert/10 border-alert/80", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: info }) }),
    /* @__PURE__ */ jsx("p", { className: "text-secondary-light text-sm mb-1 mt-4", children: t("buildGenerator.preferences") }),
    /* @__PURE__ */ jsxs("div", { className: `flex ${budget >= 500 || !budget ? "gap-2" : ""}`, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col transition-all p-px overflow-hidden ${budget >= 500 || !budget ? "flex-1" : "w-0"}`,
          children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: "build_gpu_pref", children: t("buildGenerator.gpu") }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "build_gpu_pref",
                onChange: (e) => updatePref("gpu", e.target.value),
                className: "p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light",
                value: preferences.gpu ?? "",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: t("buildGenerator.any") }),
                  /* @__PURE__ */ jsx("option", { value: "nvidia", children: t("buildGenerator.nvidia") }),
                  /* @__PURE__ */ jsx("option", { value: "amd", children: t("buildGenerator.amd") }),
                  /* @__PURE__ */ jsx("option", { value: "intel", children: t("buildGenerator.intel") })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: "build_cpu_pref", children: t("buildGenerator.cpu") }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "build_cpu_pref",
            onChange: (e) => updatePref("cpu", e.target.value),
            className: "p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light",
            value: preferences.cpu ?? "",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: t("buildGenerator.any") }),
              /* @__PURE__ */ jsx("option", { value: "amd", children: t("buildGenerator.amd") }),
              /* @__PURE__ */ jsx("option", { value: "intel", children: t("buildGenerator.intel") })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: "build_usage_pref", children: t("buildGenerator.usage") }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "build_usage_pref",
          onChange: (e) => updatePref("type", e.target.value),
          className: "p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light",
          value: preferences.type ?? "",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: t("buildGenerator.any") }),
            typeAvailableFor("gaming", budget) && /* @__PURE__ */ jsx("option", { value: "gaming", children: t("buildGenerator.gaming") }),
            /* @__PURE__ */ jsx("option", { value: "office", children: t("buildGenerator.office") }),
            typeAvailableFor("rendering", budget) && /* @__PURE__ */ jsx("option", { value: "rendering", children: t("buildGenerator.rendering") }),
            typeAvailableFor("streaming", budget) && /* @__PURE__ */ jsx("option", { value: "streaming", children: t("buildGenerator.streaming") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "accent-secondary-light",
          id: "include_orderable",
          type: "checkbox",
          checked: preferences.include_orderable,
          onChange: (e) => updatePref("include_orderable", e.target.checked)
        }
      ),
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "text-secondary-light text-sm",
          htmlFor: "include_orderable",
          children: t("buildGenerator.includeOnlyOrderable")
        }
      )
    ] }),
    hasIncompatible && /* @__PURE__ */ jsx("div", { className: "p-2 border bg-alert/10 border-alert/80", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: t("buildGenerator.incompatibleWarning") }) }),
    !hasIncompatible && needsManualCheck && /* @__PURE__ */ jsx("div", { className: "p-2 border bg-alert/10 border-alert/80", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: t("buildGenerator.manualCheckWarning") }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50",
        onClick: handleGenerate,
        disabled: loading2 || hasIncompatible || needsManualCheck,
        children: loading2 ? /* @__PURE__ */ jsx("p", { children: t("buildGenerator.generating") }) : t("buildGenerator.generate")
      }
    )
  ] }) });
};
const BuildGenerator$1 = React.memo(BuildGenerator);
const RangeSlider = ({
  label,
  values,
  min: minProp,
  max: maxProp,
  step = 1,
  minValue,
  maxValue,
  onChange,
  format,
  fullWidth = false,
  className = ""
}) => {
  const sorted = useMemo(() => {
    if (values?.length) return [...values].sort((a, b) => a - b);
    const arr = [];
    for (let v = minProp; v < maxProp; v += step) arr.push(Math.round(v * 100) / 100);
    arr.push(maxProp);
    return arr;
  }, [values, minProp, maxProp, step]);
  const lastIdx = sorted.length - 1;
  const toIdx = useCallback(
    (val) => {
      const exact = sorted.indexOf(val);
      if (exact !== -1) return exact;
      return sorted.reduce(
        (best, v, i) => Math.abs(v - val) < Math.abs(sorted[best] - val) ? i : best,
        0
      );
    },
    [sorted]
  );
  const [minIdx, setMinIdx] = useState(() => toIdx(minValue));
  const [maxIdx, setMaxIdx] = useState(() => toIdx(maxValue));
  const minIdxRef = useRef(minIdx);
  const maxIdxRef = useRef(maxIdx);
  useEffect(() => {
    minIdxRef.current = minIdx;
  }, [minIdx]);
  useEffect(() => {
    maxIdxRef.current = maxIdx;
  }, [maxIdx]);
  useEffect(() => {
    setMinIdx(toIdx(minValue));
    setMaxIdx(toIdx(maxValue));
  }, [minValue, maxValue, toIdx]);
  const fillRef = useRef(null);
  useEffect(() => {
    if (fillRef.current) {
      const minPct = Math.round(minIdx / lastIdx * 100);
      const maxPct = Math.round(maxIdx / lastIdx * 100);
      fillRef.current.style.left = `${minPct}%`;
      fillRef.current.style.width = `${maxPct - minPct}%`;
    }
  }, [minIdx, maxIdx, lastIdx]);
  const commit = useCallback(() => {
    onChange(sorted[minIdxRef.current], sorted[maxIdxRef.current]);
  }, [sorted, onChange]);
  const fmt = format ?? ((v) => v);
  const atBounds = minIdx === 0 && maxIdx === lastIdx;
  const displayMin = sorted[minIdx];
  const displayMax = sorted[maxIdx];
  return /* @__PURE__ */ jsxs("div", { className: ` ${fullWidth ? "col-span-2" : ""} ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-2 mt-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-secondary-light truncate min-w-0", title: label, children: label }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `text-sm tabular-nums whitespace-nowrap shrink-0 ${atBounds ? "text-secondary-light" : "text-white"}`,
          children: displayMin === displayMax ? fmt(displayMin) : `${fmt(displayMin)} – ${fmt(displayMax)}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center h-9", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute w-full h-1 rounded bg-secondary" }),
      /* @__PURE__ */ jsx("div", { ref: fillRef, className: "absolute h-1 rounded bg-secondary-light" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: lastIdx,
          step: 1,
          value: minIdx,
          onChange: (e) => {
            const val = Math.min(Number(e.target.value), maxIdx);
            setMinIdx(val);
          },
          onMouseUp: commit,
          onTouchEnd: commit,
          "aria-label": `${label} min`,
          className: "range-thumb absolute w-full",
          style: { zIndex: minIdx >= lastIdx - 1 ? 5 : 3 }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: lastIdx,
          step: 1,
          value: maxIdx,
          onChange: (e) => {
            const val = Math.max(Number(e.target.value), minIdx);
            setMaxIdx(val);
          },
          onMouseUp: commit,
          onTouchEnd: commit,
          "aria-label": `${label} max`,
          className: "range-thumb absolute w-full",
          style: { zIndex: 4 }
        }
      )
    ] })
  ] });
};
const RANGE_FILTER_FIELDS = /* @__PURE__ */ new Set([
  "cores",
  "capacity",
  "frequency",
  "vram",
  "min_psu",
  "wattage",
  "size_mm",
  "fan_size_mm",
  "tdp_support"
]);
const BOOLEAN_FILTERS = /* @__PURE__ */ new Set([
  "integrated_graphics",
  "cooler_included",
  "wifi",
  "xmp",
  "pcie_5",
  "psu_included"
]);
const FILTER_CONFIG = {
  cpu: ["socket", "memory_type", "cores", "integrated_graphics", "cooler_included"],
  motherboard: ["socket", "chipset", "form_factor", "memory_type", "wifi"],
  ram: ["memory_type", "modules_count", "capacity", "frequency", "xmp"],
  gpu: ["gpu_family", "vram", "min_psu"],
  case: ["form_factor", "psu_included"],
  cooler: ["tdp_support", "fan_size_mm"],
  hdd: ["capacity", "interface"],
  fan: ["size_mm", "units_in_package"],
  psu: ["wattage", "efficiency_rating", "modular", "psu_type", "pcie_5"],
  ssd: ["capacity", "type", "form_factor", "interface"]
};
const ComponentFilters = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [open, setOpen] = useState(false);
  const [prevType, setPrevType] = useState(type);
  if (prevType !== type) {
    setPrevType(type);
    setSearch(searchParams.get("search") ?? "");
  }
  const lastWrittenSearchRef = useRef(search);
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch !== lastWrittenSearchRef.current) {
      lastWrittenSearchRef.current = urlSearch;
      setSearch(urlSearch);
    }
  }, [searchParams]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((searchParams.get("search") ?? "") === search) return;
      lastWrittenSearchRef.current = search;
      setSearchParams(
        (prev) => {
          const next2 = new URLSearchParams(prev);
          if (search) next2.set("search", search);
          else next2.delete("search");
          next2.delete("page");
          return next2;
        },
        { replace: true, preventScrollReset: true }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const loaderData = useRouteLoaderData("routes/builder-picker");
  const { data: availableFilters = {}, isError } = useQuery({
    queryKey: ["component-filters", type],
    initialData: loaderData?.type === type ? loaderData.filterOptions : void 0,
    queryFn: ({ signal }) => axios.get(`/api/components/${type}/filters`, { signal }).then((res) => res.data),
    enabled: Boolean(type),
    staleTime: 5 * 6e4
  });
  const sort = searchParams.get("sort") ?? "";
  const filterValue = (key) => searchParams.get(key);
  const boolFilter = (key, fallback) => {
    const raw = searchParams.get(key);
    return raw === null ? fallback : raw === "true";
  };
  const updateParams = (mutate, opts) => {
    setSearchParams(
      (prev) => {
        const next2 = new URLSearchParams(prev);
        mutate(next2);
        next2.delete("page");
        return next2;
      },
      { preventScrollReset: true, ...opts }
    );
  };
  const updateFilter = (key, value) => {
    updateParams((next2) => {
      if (value === void 0 || value === null || value === "") next2.delete(key);
      else next2.set(key, String(value));
    });
  };
  const clearFilters = () => {
    setSearch("");
    lastWrittenSearchRef.current = "";
    setSearchParams((prev) => {
      const next2 = new URLSearchParams();
      const build = prev.get("build");
      const shared = prev.get("shared");
      if (build) next2.set("build", build);
      if (shared) next2.set("shared", shared);
      return next2;
    });
  };
  const activeColumns = FILTER_CONFIG[type] ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: t("componentFilters.searchPlaceholder", {
            component: t(`common:components.${type}`)
          }),
          "aria-label": t("componentFilters.searchPlaceholder", {
            component: t(`common:components.${type}`)
          }),
          className: "bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: sort,
          onChange: (e) => updateFilter("sort", e.target.value),
          "aria-label": t("componentFilters.sort.recommended"),
          className: "bg-secondary-light p-2 text-text outline-border focus:outline-1",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: t("componentFilters.sort.recommended") }),
            /* @__PURE__ */ jsx("option", { value: "price_asc", children: t("componentFilters.sort.priceAsc") }),
            /* @__PURE__ */ jsx("option", { value: "price_desc", children: t("componentFilters.sort.priceDesc") }),
            /* @__PURE__ */ jsx("option", { value: "name_asc", children: t("componentFilters.sort.nameAsc") }),
            /* @__PURE__ */ jsx("option", { value: "name_desc", children: t("componentFilters.sort.nameDesc") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-2 gap-y-0.5", children: [
      availableFilters.price_min != null && availableFilters.price_max != null && /* @__PURE__ */ jsx(
        RangeSlider,
        {
          fullWidth: true,
          className: "pb-3 mb-1 border-b border-secondary",
          label: t("componentFilters.price"),
          min: availableFilters.price_min,
          max: availableFilters.price_max,
          step: 5,
          minValue: Number(filterValue("min_price") ?? availableFilters.price_min),
          maxValue: Number(filterValue("max_price") ?? availableFilters.price_max),
          format: (v) => `€${v}`,
          onChange: (newMin, newMax) => {
            updateParams((next2) => {
              if (newMin <= availableFilters.price_min) next2.delete("min_price");
              else next2.set("min_price", String(newMin));
              if (newMax >= availableFilters.price_max) next2.delete("max_price");
              else next2.set("max_price", String(newMax));
            });
          }
        }
      ),
      availableFilters["brand"]?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: "filter_brand", children: t("componentFilters.labels.brand") }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "filter_brand",
            value: filterValue("brand") ?? "",
            onChange: (e) => updateFilter("brand", e.target.value || void 0),
            className: "w-full bg-secondary-light p-2 text-text outline-border focus:outline-1",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: t("componentFilters.all") }),
              availableFilters["brand"].map((value) => /* @__PURE__ */ jsx("option", { value, children: value }, value))
            ]
          }
        )
      ] }),
      activeColumns.map((column) => {
        const values = availableFilters[column] ?? [];
        if (values.length === 0 || RANGE_FILTER_FIELDS.has(column)) return null;
        return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm text-secondary-light", htmlFor: `filter_${column}`, children: t(`componentFilters.labels.${column}`, column) }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: `filter_${column}`,
              value: filterValue(column) ?? "",
              onChange: (e) => updateFilter(column, e.target.value || void 0),
              className: "w-full bg-secondary-light p-2 text-text outline-border focus:outline-1",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: t("componentFilters.all") }),
                values.map((value) => /* @__PURE__ */ jsx("option", { value, children: BOOLEAN_FILTERS.has(column) ? value === true || value === 1 || value === "1" ? t("componentFilters.yes") : t("componentFilters.no") : column === "gpu_family" ? String(value).toUpperCase() : value }, value))
              ]
            }
          )
        ] }, column);
      }),
      activeColumns.map((column) => {
        if (!RANGE_FILTER_FIELDS.has(column)) return null;
        const values = availableFilters[column] ?? [];
        if (values.length < 2) return null;
        const boundsMin = Math.min(...values);
        const boundsMax = Math.max(...values);
        const curMin = Number(filterValue(`${column}_min`) ?? boundsMin);
        const curMax = Number(filterValue(`${column}_max`) ?? boundsMax);
        return /* @__PURE__ */ jsx(
          RangeSlider,
          {
            label: t(`componentFilters.labels.${column}`, column),
            values,
            minValue: curMin,
            maxValue: curMax,
            onChange: (newMin, newMax) => {
              updateParams((next2) => {
                if (newMin <= boundsMin) next2.delete(`${column}_min`);
                else next2.set(`${column}_min`, String(newMin));
                if (newMax >= boundsMax) next2.delete(`${column}_max`);
                else next2.set(`${column}_max`, String(newMax));
              });
            }
          },
          column
        );
      }),
      isError && /* @__PURE__ */ jsx("p", { className: "text-danger text-sm", children: t("componentFilters.failedToFetchFilters") })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpen((prev) => !prev),
          className: "w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("span", { className: "", children: t("componentFilters.display") }),
            /* @__PURE__ */ jsx(ArrowIcon, { active: open })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `grid transition-all ${open ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"}`, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "accent-secondary-light",
              id: "show_in_stock",
              type: "checkbox",
              checked: boolFilter("show_in_stock", true),
              onChange: (e) => updateFilter("show_in_stock", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("label", { className: "text-secondary-light text-sm", htmlFor: "show_in_stock", children: t("componentFilters.inStock") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "accent-secondary-light",
              id: "show_orderable",
              type: "checkbox",
              checked: boolFilter("show_orderable", true),
              onChange: (e) => updateFilter("show_orderable", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("label", { className: "text-secondary-light text-sm", htmlFor: "show_orderable", children: t("componentFilters.canBeOrdered") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex col-span-2 gap-2 items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "accent-secondary-light",
              id: "show_compatible_only",
              type: "checkbox",
              checked: boolFilter("show_compatible_only", false),
              onChange: (e) => updateFilter("show_compatible_only", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("label", { className: "text-secondary-light text-sm", htmlFor: "show_compatible_only", children: t("componentFilters.compatibleOnly") })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white",
        onClick: clearFilters,
        children: t("componentFilters.clearFilters")
      }
    )
  ] });
};
const ComponentFilters$1 = React.memo(ComponentFilters);
const DEFAULT_PREFERENCES = {
  gpu: null,
  cpu: null,
  include_orderable: true
};
const ComponentGenerator = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { user, showVerifyBanner } = useAuth();
  const { addToast } = useToast();
  const { pickerType, selectedComponents, setSelectedComponents, closePicker, buildIssues } = useBuilder();
  const lp = useLocalePath();
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(150);
  const [loading2, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const updatePref = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const selected = selectedProductCodes(selectedComponents);
      const res = await axios.post(`/api/builder/${pickerType}`, {
        budget,
        selected,
        preferences
      });
      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build
        }));
        setOpen(false);
        setPreferences(DEFAULT_PREFERENCES);
        closePicker();
        addToast(t("componentGenerator.generateSuccess"), { type: "success" });
        document.getElementById("side-panel-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
        document.getElementById("page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        addToast(res.data.error, { type: "danger" });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        showVerifyBanner();
        addToast(t("common:verifyEmail.gatedAction"), { type: "danger" });
      } else {
        addToast(err.response?.data?.error ?? t("componentGenerator.somethingWentWrong"), {
          type: "danger"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const hasIncompatible = hasIncompatibleSelection(selectedComponents, buildIssues);
  const needsManualCheck = needsManualCheckSelection(selectedComponents);
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t mt-4 border-secondary", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpen((prev) => !prev),
          className: "w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("componentGenerator.title") }),
            /* @__PURE__ */ jsx(ArrowIcon, { active: open })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`,
          children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxs("p", { className: "text-muted text-sm", children: [
            t("componentGenerator.loginRequired"),
            " ",
            /* @__PURE__ */ jsx(Link, { className: "text-info/80 cursor-pointer hover:underline", to: lp("/login"), children: t("componentGenerator.loginLink") }),
            "."
          ] }) })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t mt-4 border-secondary", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((prev) => !prev),
        className: "w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("componentGenerator.title") }),
          /* @__PURE__ */ jsx(ArrowIcon, { active: open })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-muted text-sm", children: [
            t("componentGenerator.intro"),
            " ",
            /* @__PURE__ */ jsx(Link, { className: "text-info/80 cursor-pointer hover:underline", to: lp("/guide"), children: t("componentGenerator.guideLink") }),
            " ",
            t("componentGenerator.guideSuffix")
          ] }),
          /* @__PURE__ */ jsx(
            BudgetSlider,
            {
              min: 5,
              max: 1e3,
              step: 5,
              showRemaining: false,
              value: budget,
              onChange: setBudget
            }
          ),
          pickerType === "cpu" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted text-sm mb-1", children: t("componentGenerator.preferences") }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm text-muted", htmlFor: "comp_cpu_pref", children: t("componentGenerator.cpu") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "comp_cpu_pref",
                  onChange: (e) => updatePref("cpu", e.target.value),
                  className: "p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light",
                  value: preferences.cpu ?? "",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("componentGenerator.any") }),
                    /* @__PURE__ */ jsx("option", { value: "amd", children: t("componentGenerator.amd") }),
                    /* @__PURE__ */ jsx("option", { value: "intel", children: t("componentGenerator.intel") })
                  ]
                }
              )
            ] })
          ] }),
          pickerType === "gpu" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted text-sm mb-1", children: t("componentGenerator.preferences") }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm text-muted", htmlFor: "comp_gpu_pref", children: t("componentGenerator.gpu") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "comp_gpu_pref",
                  onChange: (e) => updatePref("gpu", e.target.value),
                  className: "p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light",
                  value: preferences.gpu ?? "",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("componentGenerator.any") }),
                    /* @__PURE__ */ jsx("option", { value: "nvidia", children: t("componentGenerator.nvidia") }),
                    /* @__PURE__ */ jsx("option", { value: "amd", children: t("componentGenerator.amd") }),
                    /* @__PURE__ */ jsx("option", { value: "intel", children: t("componentGenerator.intel") })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "accent-secondary-light",
                id: "include_orderable",
                type: "checkbox",
                checked: preferences.include_orderable,
                onChange: (e) => updatePref("include_orderable", e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("label", { className: "text-secondary-light text-sm", htmlFor: "include_orderable", children: t("componentGenerator.includeOnlyOrderable") })
          ] }),
          hasIncompatible && /* @__PURE__ */ jsx("div", { className: "p-2 border bg-alert/10 border-alert/80", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: t("componentGenerator.incompatibleWarning") }) }),
          !hasIncompatible && needsManualCheck && /* @__PURE__ */ jsx("div", { className: "p-2 border bg-alert/10 border-alert/80", children: /* @__PURE__ */ jsx("p", { className: "text-alert text-sm", children: t("componentGenerator.manualCheckWarning") }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50",
              onClick: handleGenerate,
              disabled: loading2 || hasIncompatible || needsManualCheck,
              children: loading2 ? /* @__PURE__ */ jsx("p", { children: t("componentGenerator.generating") }) : t("componentGenerator.generate")
            }
          )
        ] })
      }
    )
  ] });
};
const ComponentGenerator$1 = React.memo(ComponentGenerator);
const slotsFromBuild = (build) => Object.fromEntries(Object.keys(EMPTY_SLOTS).map((slot) => [slot, (slot === "case" ? build.pc_case : build[slot]) ?? null]));
const builder = UNSAFE_withComponentProps(function BuilderLayout() {
  const {
    t
  } = useTranslation(["builder", "common", "pages"]);
  const {
    addToast
  } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedComponents, setSelectedComponents] = useState({
    ...EMPTY_SLOTS
  });
  const [buildId, setBuildId] = useState(void 0);
  const [buildName, setBuildName] = useState("");
  const [buildNotes, setBuildNotes] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [buildIssues, setBuildIssues] = useState({});
  const [buildWarnings, setBuildWarnings] = useState({});
  const [validateFailed, setValidateFailed] = useState(false);
  const [buildType, setBuildType] = useState("");
  const [restoredDraft, setRestoredDraft] = useState(false);
  const lang = langFromParams(params);
  const pickerType = params.type ?? null;
  const pickerOpen = Boolean(params.type) && !params.code;
  const buildParam = searchParams.get("build");
  const sharedParam = searchParams.get("shared");
  const buildSearch = useMemo(() => {
    const kept = new URLSearchParams();
    if (buildParam) kept.set("build", buildParam);
    if (sharedParam) kept.set("shared", sharedParam);
    const s = kept.toString();
    return s ? `?${s}` : "";
  }, [buildParam, sharedParam]);
  const builderIndexHref = useCallback(() => localePath(lang, "/builder") + buildSearch, [lang, buildSearch]);
  const pickerHref = useCallback((slot) => localePath(lang, `/builder/components/${slot}`) + buildSearch, [lang, buildSearch]);
  const detailHref = useCallback((slot, productCode) => localePath(lang, `/builder/components/${slot}/${encodeURIComponent(productCode)}`) + buildSearch, [lang, buildSearch]);
  const closePicker = useCallback(() => {
    if (params.type) navigate(builderIndexHref());
  }, [params.type, navigate, builderIndexHref]);
  const draftGateRef = useRef("blocked");
  const dirtyRef = useRef(false);
  useEffect(() => {
    draftGateRef.current = "blocked";
    if (sharedParam) {
      axios.get("/api/builder", {
        params: {
          shared: sharedParam
        }
      }).then((res) => {
        const build = res.data.build;
        if (!build) {
          draftGateRef.current = "open";
          addToast(t("sidePanel.loadBuildError"), {
            type: "danger"
          });
          return;
        }
        draftGateRef.current = "skip-once";
        setRestoredDraft(false);
        setSelectedComponents(slotsFromBuild(build));
        setBuildId(void 0);
        setBuildName(build.name ?? "");
        setBuildNotes(build.notes ?? "");
        setBuildType(build.type ?? "");
      }).catch(() => {
        draftGateRef.current = "open";
        addToast(t("sidePanel.loadBuildError"), {
          type: "danger"
        });
      });
      return;
    }
    if (!buildParam) {
      const draft = loadDraft();
      draftGateRef.current = "skip-once";
      setRestoredDraft(Boolean(draft));
      setSelectedComponents(draft?.selectedComponents ?? {
        ...EMPTY_SLOTS
      });
      setBuildId(draft?.buildId ?? void 0);
      setBuildName(draft?.buildName ?? "");
      setBuildNotes(draft?.buildNotes ?? "");
      setBuildType(draft?.buildType ?? "");
      return;
    }
    axios.get("/api/builder", {
      params: {
        build: buildParam
      }
    }).then((res) => {
      const build = res.data.build;
      if (!build) {
        draftGateRef.current = "open";
        addToast(t("sidePanel.loadBuildError"), {
          type: "danger"
        });
        return;
      }
      const draft = loadDraft();
      const hasMatchingDraft = draft && String(draft.buildId) === String(build.id);
      draftGateRef.current = "skip-once";
      setRestoredDraft(Boolean(hasMatchingDraft));
      setSelectedComponents(hasMatchingDraft ? draft.selectedComponents : slotsFromBuild(build));
      setBuildId(build.id);
      setBuildName(hasMatchingDraft ? draft.buildName : build.name ?? "");
      setBuildNotes(hasMatchingDraft ? draft.buildNotes : build.notes ?? "");
      setBuildType(hasMatchingDraft ? draft.buildType : build.type ?? "");
    }).catch(() => {
      draftGateRef.current = "open";
      addToast(t("sidePanel.loadBuildError"), {
        type: "danger"
      });
    });
  }, [buildParam, sharedParam]);
  useEffect(() => {
    validateCompatibility();
  }, [selectedComponents]);
  const draftRef = useRef(null);
  draftRef.current = {
    buildId,
    selectedComponents,
    buildName,
    buildNotes,
    buildType
  };
  useEffect(() => {
    if (draftGateRef.current === "blocked") return;
    if (draftGateRef.current === "skip-once") {
      draftGateRef.current = "open";
      return;
    }
    dirtyRef.current = true;
    const timer = setTimeout(() => {
      saveDraft(draftRef.current);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedComponents, buildName, buildNotes, buildType, buildId]);
  useEffect(() => {
    return () => {
      if (dirtyRef.current) saveDraft(draftRef.current);
    };
  }, []);
  const validateSeqRef = useRef(0);
  const validateCompatibility = async () => {
    const seq = ++validateSeqRef.current;
    const selected = selectedProductCodes(selectedComponents);
    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      setBuildWarnings({});
      setValidateFailed(false);
      return;
    }
    try {
      const res = await axios.post("/api/builder/validate", {
        selected
      });
      if (seq !== validateSeqRef.current) return;
      setBuildIssues(res.data.issues);
      setBuildWarnings(res.data.warnings ?? {});
      setValidateFailed(false);
    } catch (err) {
      if (seq !== validateSeqRef.current) return;
      setValidateFailed(true);
      addToast(t("buildDesc.validateFailed"), {
        type: "danger"
      });
      console.error(err);
    }
  };
  const handleNewBuild = () => {
    clearDraft();
    setRestoredDraft(false);
    setSelectedComponents({
      ...EMPTY_SLOTS
    });
    setBuildId(void 0);
    setBuildName("");
    setBuildNotes("");
    setBuildType("");
    setWarnings([]);
    setNotes([]);
  };
  const builderValue = useMemo(() => ({
    pickerType,
    builderIndexHref,
    pickerHref,
    detailHref,
    closePicker,
    selectedComponents,
    setSelectedComponents,
    warnings,
    setWarnings,
    notes,
    setNotes,
    buildIssues,
    setBuildIssues,
    buildWarnings,
    setBuildWarnings,
    validateFailed
  }), [pickerType, builderIndexHref, pickerHref, detailHref, closePicker, selectedComponents, warnings, notes, buildIssues, buildWarnings, validateFailed]);
  const metaValue = useMemo(() => ({
    buildId,
    setBuildId,
    buildName,
    setBuildName,
    buildNotes,
    setBuildNotes,
    buildType,
    setBuildType,
    restoredDraft,
    setRestoredDraft
  }), [buildId, buildName, buildNotes, buildType, restoredDraft]);
  return /* @__PURE__ */ jsx(BuilderContext, {
    value: builderValue,
    children: /* @__PURE__ */ jsx(BuildMetaContext, {
      value: metaValue,
      children: /* @__PURE__ */ jsxs("div", {
        className: "h-full flex min-w-0",
        children: [/* @__PURE__ */ jsxs(SidePanel, {
          title: t("sidePanel.title"),
          headerRight: (buildId || Object.values(selectedComponents).some((c) => c !== null)) && /* @__PURE__ */ jsx(Link, {
            className: "px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm",
            to: localePath(lang, "/builder"),
            onClick: handleNewBuild,
            children: t("sidePanel.newBuild")
          }),
          children: [pickerOpen ? /* @__PURE__ */ jsx(ComponentFilters$1, {}) : /* @__PURE__ */ jsx(BuildDesc, {}), /* @__PURE__ */ jsx(BuildInfo, {}), pickerOpen ? /* @__PURE__ */ jsx(ComponentGenerator$1, {}) : /* @__PURE__ */ jsx(BuildGenerator$1, {}), /* @__PURE__ */ jsxs("p", {
            className: "text-muted text-sm pt-4 border-t mt-4 border-secondary",
            children: [t("sidePanel.guideHint"), " ", /* @__PURE__ */ jsx(Link, {
              className: "text-info/80 cursor-pointer hover:underline",
              to: localePath(lang, "/guide"),
              children: t("sidePanel.guideLink")
            }), "."]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex px-4 py-6 min-w-0",
          children: /* @__PURE__ */ jsx(Outlet, {})
        })]
      })
    })
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: builder
}, Symbol.toStringTag, { value: "Module" }));
const ComponentPopup = ({ component, x, y, isOptional, needsManualCheck }) => {
  const { t } = useTranslation("builder");
  const key = component?.toLowerCase();
  const fullName = t(`componentPopup.${key}.fullName`, "");
  const description = t(`componentPopup.${key}.description`, "");
  const popupWidth = 256;
  const popupHeight = needsManualCheck ? 115 : 85;
  const offset = 12;
  const left = x + offset + popupWidth > window.innerWidth ? x - offset - popupWidth : x + offset;
  const top = y + offset + popupHeight > window.innerHeight ? y - offset - popupHeight : y + offset;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "p-2 border border-border bg-background z-10 w-64",
      style: {
        position: "fixed",
        top,
        left,
        pointerEvents: "none"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-text", children: fullName || component }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-xs px-1.5 py-0.5 shrink-0 ${isOptional ? "bg-secondary text-white" : "bg-primary text-white"}`,
              children: isOptional ? t("componentPopup.optional") : t("componentPopup.required")
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: description }),
        needsManualCheck && /* @__PURE__ */ jsx("p", { className: "text-alert text-sm mt-1", children: t("componentCard.checkManually") })
      ]
    }
  );
};
const ComponentCard = ({ component, name }) => {
  const { t } = useTranslation(["builder", "common"]);
  const { setSelectedComponents, selectedComponents, buildIssues, pickerHref, detailHref } = useBuilder();
  const slot = name.toLowerCase();
  const resolveOptional = () => {
    const key = name.toLowerCase();
    if (["cpu", "motherboard", "ram", "ssd", "case"].includes(key)) return false;
    if (["hdd", "fan"].includes(key)) return true;
    if (key === "gpu") return !!selectedComponents.cpu?.integrated_graphics;
    if (key === "cooler") return !!selectedComponents.cpu?.cooler_included;
    if (key === "psu") return !!selectedComponents.case?.psu_included;
    return false;
  };
  const isOptional = resolveOptional();
  const includedInCase = name.toLowerCase() === "psu" && !!selectedComponents.case?.psu_included;
  const [popup, setPopup] = useState(null);
  const handleRemove = () => {
    setSelectedComponents((prev) => ({
      ...prev,
      [slot]: null
    }));
  };
  const handlePopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopup({ component: name, x: rect.left, y: rect.bottom });
  };
  const capitalize2 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const hasIssues = buildIssues[name.toLowerCase()]?.length > 0;
  const needsManualCheck = !!component?.needs_manual_check;
  const displayName = t(`common:components.${name.toLowerCase()}`);
  const listings = component?.listings?.length ? component.listings : component ? [
    {
      source: component.selected_source,
      price: component.price,
      stock_status: component.stock_status,
      stock_quantity: component.stock_quantity,
      url: component.url
    }
  ] : [];
  return /* @__PURE__ */ jsx("div", { className: "w-full xl:w-80 max-h-120 xl:h-120 h-80 border flex flex-col border-border shadow hover:bg-background transition relative", children: /* @__PURE__ */ jsxs(Fragment, { children: [
    component ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row xl:flex-col gap-2 p-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-40 h-40 xl:w-full xl:h-40 bg-surface shrink-0 xl:my-1 flex items-center justify-center overflow-hidden", children: component.image_url && /* @__PURE__ */ jsx(
          "img",
          {
            src: component.image_url,
            alt: component.name,
            loading: "lazy",
            className: "w-full h-full object-contain"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "relative group min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl text-muted", children: displayName }),
          /* @__PURE__ */ jsx("h2", { className: "text-text font-semibold text-3xl xl:line-clamp-2 line-clamp-3", children: component.name }),
          /* @__PURE__ */ jsx("span", { className: "text-muted text-sm", children: t("componentCard.startingFrom", {
            price: formatPrice(getCheapestPrice(component))
          }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 mb-1 hidden group-hover:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10", children: component.name })
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-muted text-sm font-medium pt-2 px-2", children: t("componentCard.stores") }),
      /* @__PURE__ */ jsx("div", { className: "pb-2 px-2 flex flex-col gap-1", children: (() => {
        const sorted = [...listings].sort(
          (a, b) => parseFloat(a.price ?? Infinity) - parseFloat(b.price ?? Infinity)
        );
        const cheapest = sorted[0];
        const remaining = sorted.length - 1;
        if (!cheapest) return null;
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: cheapest.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "grid grid-cols-3 gap-1 text-sm border border-border bg-surface p-1 hover:bg-secondary-light transition cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-text font-medium truncate", children: cheapest.source ? capitalize2(cheapest.source) : "-" }),
                /* @__PURE__ */ jsxs("span", { className: "text-muted", children: [
                  "€",
                  formatPrice(cheapest.price)
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-muted truncate", children: cheapest.stock_status === "in_stock" || cheapest.stock_status === "orderable" ? t("componentCard.inStock") : t("componentCard.outOfStock") })
              ]
            }
          ),
          remaining > 0 && /* @__PURE__ */ jsx(
            Link,
            {
              to: detailHref(slot, component.product_code),
              className: "text-info text-sm text-left hover:underline cursor-pointer",
              children: t("componentCard.moreStores", { count: remaining })
            }
          )
        ] });
      })() }),
      /* @__PURE__ */ jsxs("div", { className: "bg-primary mt-auto flex", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "text-white py-4 px-8 hover:bg-primary-light transition cursor-pointer flex-1 text-center",
            to: detailHref(slot, component.product_code),
            children: t("componentCard.more")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "text-white p-4 hover:bg-danger/50 cursor-pointer transition",
            onClick: handleRemove,
            "aria-label": t("componentCard.remove"),
            children: /* @__PURE__ */ jsx(CloseIcon, { size: 20 })
          }
        )
      ] }),
      hasIssues && /* @__PURE__ */ jsx("div", { className: "bg-danger/10 absolute w-full h-full pointer-events-none border-2 border-danger/20" })
    ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center gap-4 relative", children: [
      includedInCase && /* @__PURE__ */ jsx("div", { className: "bg-muted/10 absolute w-full h-full pointer-events-none border border-muted/20" }),
      includedInCase ? /* @__PURE__ */ jsx("span", { className: "absolute top-2 left-2 text-xs text-muted", children: t("addComponent.includedInCase") }) : !isOptional && /* @__PURE__ */ jsx("span", { className: "absolute top-2 left-2 text-primary text-lg leading-none", children: "*" }),
      /* @__PURE__ */ jsx("span", { className: "text-3xl font-semibold text-muted", children: displayName }),
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "bg-surface p-2 text-muted hover:bg-secondary-light transition cursor-pointer",
          to: pickerHref(slot),
          "aria-label": t("addComponent.title", { component: displayName }),
          children: /* @__PURE__ */ jsx(AddIcon, {})
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute top-0 right-0 m-2 transition ${needsManualCheck ? "text-alert hover:text-alert" : "text-muted hover:text-text"}`,
        tabIndex: 0,
        onMouseEnter: handlePopup,
        onMouseLeave: () => setPopup(null),
        onFocus: handlePopup,
        onBlur: () => setPopup(null),
        children: /* @__PURE__ */ jsx(InfoIcon, {})
      }
    ),
    popup && /* @__PURE__ */ jsx(ComponentPopup, { ...popup, isOptional, needsManualCheck })
  ] }) });
};
const ComponentCard$1 = React.memo(ComponentCard);
const builderIndex = UNSAFE_withComponentProps(function BuilderIndex() {
  const {
    selectedComponents
  } = useBuilder();
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-wrap mb-auto gap-8 justify-center",
    children: [/* @__PURE__ */ jsx(ComponentCard$1, {
      name: "CPU",
      component: selectedComponents.cpu
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "Motherboard",
      component: selectedComponents.motherboard
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "RAM",
      component: selectedComponents.ram
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "GPU",
      component: selectedComponents.gpu
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "PSU",
      component: selectedComponents.psu
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "SSD",
      component: selectedComponents.ssd
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "Case",
      component: selectedComponents.case
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "Cooler",
      component: selectedComponents.cooler
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "HDD",
      component: selectedComponents.hdd
    }), /* @__PURE__ */ jsx(ComponentCard$1, {
      name: "Fan",
      component: selectedComponents.fan
    })]
  });
});
const meta$3 = ({
  params
}) => {
  const lang = langFromParams(params);
  return seoMeta({
    lang,
    path: "/builder",
    ...pagesSeo(lang, "builder")
  });
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: builderIndex,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const AddComponentSkeleton = () => {
  return /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-col gap-2", children: Array.from({ length: 15 }).map((_, index) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex justify-between items-center p-3 border border-border bg-surface hover:bg-secondary-light cursor-pointer transition animate-pulse",
      children: [
        /* @__PURE__ */ jsx("span", { className: "w-60 h-5 bg-muted" }),
        /* @__PURE__ */ jsx("span", { className: "w-10 h-5 bg-muted" })
      ]
    },
    index
  )) });
};
const getPageNumbers = (currentPage, lastPage) => {
  const pages = /* @__PURE__ */ new Set([1, lastPage]);
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i >= 1 && i <= lastPage) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
};
const PaginationControls = ({ pagination, setPage }) => {
  const { t } = useTranslation("common");
  const { currentPage, lastPage } = pagination;
  const pageNumbers = getPageNumbers(currentPage, lastPage);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex justify-between items-center mt-4 gap-2",
      "aria-label": t("page", { current: currentPage, total: lastPage }),
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: currentPage === 1,
            onClick: () => setPage((p) => p - 1),
            className: "text-muted hover:text-text disabled:opacity-30 transition cursor-pointer",
            children: t("previous")
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: pageNumbers.map((page2, i) => {
          const prevPage = pageNumbers[i - 1];
          const showEllipsis = prevPage !== void 0 && page2 - prevPage > 1;
          return /* @__PURE__ */ jsxs(React.Fragment, { children: [
            showEllipsis && /* @__PURE__ */ jsx("span", { className: "text-muted px-1", children: "…" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setPage(page2),
                disabled: page2 === currentPage,
                className: `min-w-8 px-2 py-1 text-sm transition cursor-pointer disabled:cursor-default ${page2 === currentPage ? "bg-primary text-white" : "text-muted hover:text-text"}`,
                children: page2
              }
            )
          ] }, page2);
        }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: currentPage === lastPage,
            onClick: () => setPage((p) => p + 1),
            className: "text-muted hover:text-text disabled:opacity-30 transition cursor-pointer",
            children: t("next")
          }
        )
      ]
    }
  );
};
const RESERVED_PARAMS$1 = /* @__PURE__ */ new Set(["page", "sort", "search", "build", "shared"]);
const AddComponent = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { selectedComponents, setSelectedComponents, closePicker, detailHref } = useBuilder();
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedId, setExpandedId] = useState(null);
  const [chosenSources, setChosenSources] = useState({});
  const page2 = Number(searchParams.get("page") ?? 1);
  const sort = searchParams.get("sort") ?? "";
  const search = searchParams.get("search") ?? "";
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_PARAMS$1.has(key)) filters[key] = value;
  }
  const selected = selectedProductCodes(selectedComponents);
  const selectedKey = JSON.stringify(selected);
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    if (Number(searchParams.get("page") ?? 1) > 1) {
      setSearchParams(
        (prev) => {
          const next2 = new URLSearchParams(prev);
          next2.delete("page");
          return next2;
        },
        { replace: true, preventScrollReset: true }
      );
    }
  }, [selectedKey]);
  const loaderData = useRouteLoaderData("routes/builder-picker");
  const queryKey = ["components", type, selectedKey, search, sort, filtersKey, page2];
  const seed = loaderData?.seedKey === JSON.stringify(queryKey) ? loaderData.list : void 0;
  const { data: data2, error: error2, isPending, isPlaceholderData } = useQuery({
    queryKey,
    initialData: seed,
    queryFn: ({ signal }) => axios.get(`/api/components/${type}`, {
      signal,
      params: {
        selected: selectedKey,
        page: page2,
        search: search || void 0,
        sort: sort || void 0,
        ...filters
      }
    }).then((res) => res.data),
    enabled: Boolean(type),
    placeholderData: keepPreviousData,
    staleTime: 6e4
  });
  const components2 = data2?.data ?? [];
  const pagination = data2 ? { currentPage: data2.current_page, lastPage: data2.last_page, total: data2.total } : null;
  const errorMessage = error2 ? error2.response?.data?.error ?? t("addComponent.failedToFetch") : "";
  const setPage = (next2) => {
    const value = typeof next2 === "function" ? next2(page2) : next2;
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value <= 1) nextParams.delete("page");
      else nextParams.set("page", String(value));
      return nextParams;
    });
  };
  const handleExpand = (id) => {
    setExpandedId((prev) => prev === id ? null : id);
  };
  const handleChooseStore = (component, source) => {
    setChosenSources((prev) => ({ ...prev, [component.product_code]: source }));
  };
  const handleSelect = (component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: component
    }));
    closePicker();
  };
  return /* @__PURE__ */ jsxs("div", { className: "border border-border w-full min-w-0 hover:bg-background transition p-4 mb-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-text", children: t("addComponent.title", {
        component: t(`common:components.${type}`)
      }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2",
          onClick: closePicker,
          "aria-label": t("common:close"),
          children: /* @__PURE__ */ jsx(CloseIcon, {})
        }
      )
    ] }),
    isPending && /* @__PURE__ */ jsx(AddComponentSkeleton, {}),
    errorMessage && /* @__PURE__ */ jsx("p", { className: "text-danger mt-4", children: errorMessage }),
    !isPending && !errorMessage && /* @__PURE__ */ jsx("div", { className: `mt-4 flex flex-col gap-2 ${isPlaceholderData ? "opacity-60" : ""}`, children: components2.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mx-auto text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold text-text", children: t("addComponent.noComponentsFound") }),
      /* @__PURE__ */ jsx("span", { className: "text-muted", children: t("addComponent.tryAdjustingFilters") })
    ] }) : components2.map((component) => {
      const chosenSource = chosenSources[component.product_code] ?? component.listings?.[0]?.source;
      const chosenListing = component.listings?.find((l) => l.source === chosenSource);
      const effectiveComponent = chosenListing ? {
        ...component,
        price: chosenListing.price,
        stock_status: chosenListing.stock_status,
        stock_quantity: chosenListing.stock_quantity,
        url: chosenListing.url,
        selected_source: chosenListing.source
      } : component;
      return /* @__PURE__ */ jsxs("div", { className: "border border-border min-w-0", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => handleExpand(component.id),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleExpand(component.id);
              }
            },
            role: "button",
            tabIndex: 0,
            "aria-expanded": expandedId === component.id,
            className: `flex justify-between items-center gap-2 p-2 min-w-0 cursor-pointer transition ${component.compatible && !component.out_of_stock ? "bg-surface hover:bg-secondary-light" : "bg-muted/50 hover:bg-muted/80"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-background shrink-0 flex items-center justify-center overflow-hidden", children: component.image_url && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: component.image_url,
                    alt: component.name,
                    loading: "lazy",
                    className: "w-full h-full object-contain"
                  }
                ) }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `font-medium truncate min-w-0 ${component.compatible && !component.out_of_stock ? "text-text" : "text-text/50"}`,
                    children: [
                      component.name,
                      type === "motherboard" && (component.socket || component.memory_type) && /* @__PURE__ */ jsxs("span", { className: "text-text font-normal", children: [
                        " ",
                        "(",
                        [component.socket, component.memory_type].filter(Boolean).join(", "),
                        ")"
                      ] }),
                      type === "case" && component.form_factor && /* @__PURE__ */ jsxs("span", { className: "text-text font-normal", children: [
                        " (",
                        component.form_factor,
                        ")"
                      ] })
                    ]
                  }
                ),
                component.compatible && component.needs_manual_check && /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "relative group/manual-check text-alert shrink-0",
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      /* @__PURE__ */ jsx(InfoIcon, { size: 18 }),
                      /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/manual-check:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10", children: t("componentCard.checkManually") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted text-sm whitespace-nowrap", children: component.out_of_stock ? t("addComponent.outOfStock") : !component.compatible ? component.case_includes_psu ? t("addComponent.caseIncludesPsu") : t("addComponent.notCompatible") : t("addComponent.startingFrom", {
                  price: formatPrice(component.price)
                }) }),
                component.compatible && !component.out_of_stock && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleSelect(component);
                    },
                    title: t("addComponent.select"),
                    "aria-label": t("addComponent.select"),
                    className: "text-surface hover:text-white bg-primary hover:bg-primary-light transition cursor-pointer p-1",
                    children: /* @__PURE__ */ jsx(AddIcon, { size: 20 })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `bg-background transition-all overflow-hidden grid ${expandedId === component.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
            children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-full xl:w-80 h-80 bg-surface shrink-0 flex items-center justify-center overflow-hidden", children: component.image_url && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: component.image_url,
                    alt: component.name,
                    loading: "lazy",
                    className: "w-full h-full object-contain"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(ComponentInfo, { component: effectiveComponent }) })
              ] }),
              component.listings?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-text mb-2", children: t("componentCard.availabilityTitle") }),
                /* @__PURE__ */ jsx(
                  ListingsTable,
                  {
                    listings: component.listings,
                    breakpoint: "xl",
                    onVisit: (e, listing) => {
                      e.stopPropagation();
                      handleChooseStore(component, listing.source);
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleSelect(effectiveComponent),
                    className: "p-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1",
                    children: t("addComponent.select")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: detailHref(type, component.product_code),
                    className: "p-4 bg-surface text-text hover:bg-secondary-light transition cursor-pointer text-center",
                    children: t("addComponent.viewDetails")
                  }
                )
              ] })
            ] }) })
          }
        )
      ] }, component.id);
    }) }),
    pagination && pagination.lastPage > 1 && /* @__PURE__ */ jsx(PaginationControls, { pagination, setPage })
  ] });
};
const AddComponent$1 = React.memo(AddComponent);
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000";
async function apiFetch(path, { lang = "lv" } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "X-Locale": lang,
      Accept: "application/json"
    }
  });
  if (!res.ok) throw data(null, { status: res.status });
  return res.json();
}
const RESERVED_PARAMS = /* @__PURE__ */ new Set(["page", "sort", "search", "build", "shared"]);
async function loader$2({
  params,
  request
}) {
  if (!(params.type in EMPTY_SLOTS)) throw data(null, {
    status: 404
  });
  const lang = langFromParams(params);
  const url = new URL(request.url);
  const query = new URLSearchParams();
  query.set("selected", "{}");
  const filters = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (key === "build" || key === "shared") continue;
    query.set(key, value);
    if (!RESERVED_PARAMS.has(key)) filters[key] = value;
  }
  const [list, filterOptions] = await Promise.all([apiFetch(`/api/components/${params.type}?${query}`, {
    lang
  }), apiFetch(`/api/components/${params.type}/filters`, {
    lang
  })]);
  return {
    list,
    filterOptions,
    type: params.type,
    // Mirrors AddComponent's query key so the seed only applies to the exact
    // URL that was server-rendered.
    seedKey: JSON.stringify(["components", params.type, "{}", url.searchParams.get("search") ?? "", url.searchParams.get("sort") ?? "", JSON.stringify(filters), Number(url.searchParams.get("page") ?? 1)])
  };
}
function clientLoader() {
  return null;
}
const shouldRevalidate = () => false;
const builderPicker = UNSAFE_withComponentProps(AddComponent$1);
const meta$2 = ({
  params
}) => {
  const lang = langFromParams(params);
  const seo2 = pagesSeo(lang, "picker")[params.type] ?? pagesSeo(lang, "builder");
  return seoMeta({
    lang,
    path: `/builder/components/${params.type}`,
    ...seo2
  });
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: builderPicker,
  loader: loader$2,
  meta: meta$2,
  shouldRevalidate
}, Symbol.toStringTag, { value: "Module" }));
const SITE_URL = "https://pcbuilder.lv";
async function loader$1({
  params
}) {
  if (!(params.type in EMPTY_SLOTS)) throw data(null, {
    status: 404
  });
  const component = await apiFetch(`/api/components/${params.type}/${encodeURIComponent(params.code)}`, {
    lang: langFromParams(params)
  });
  return {
    component
  };
}
const builderDetail = UNSAFE_withComponentProps(function BuilderDetail() {
  const {
    component
  } = useLoaderData();
  const params = useParams();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation(["builder", "common"]);
  const {
    selectedComponents,
    setSelectedComponents,
    builderIndexHref,
    pickerHref
  } = useBuilder();
  const type = params.type;
  const isSelected = selectedComponents[type]?.product_code === component.product_code;
  const handleSelect = () => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: component
    }));
    navigate(builderIndexHref());
  };
  const handleRemove = () => {
    setSelectedComponents((prev) => ({
      ...prev,
      [type]: null
    }));
    navigate(builderIndexHref());
  };
  return /* @__PURE__ */ jsx(ComponentDetail, {
    component,
    title: t(`common:components.${type}`),
    onClose: () => navigate(builderIndexHref()),
    actions: isSelected ? /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(Link, {
        className: "px-8 py-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1 sm:flex-none text-center",
        to: pickerHref(type),
        children: t("componentCard.replace")
      }), /* @__PURE__ */ jsx("button", {
        className: "px-8 py-4 bg-surface text-text hover:bg-danger/50 transition cursor-pointer flex-1 sm:flex-none",
        onClick: handleRemove,
        children: t("componentCard.remove")
      })]
    }) : /* @__PURE__ */ jsx("button", {
      className: "px-8 py-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1 sm:flex-none",
      onClick: handleSelect,
      children: t("addComponent.select")
    })
  });
});
const meta$1 = ({
  data: loaderData,
  params
}) => {
  const lang = langFromParams(params);
  if (!loaderData?.component) {
    return seoMeta({
      lang,
      path: "/builder",
      ...pagesSeo(lang, "notFound"),
      noindex: true
    });
  }
  const {
    component
  } = loaderData;
  const path = `/builder/components/${params.type}/${encodeURIComponent(params.code)}`;
  const template = pagesSeo(lang, "componentDetail");
  const listings = component.listings ?? [];
  const prices = listings.map((l) => Number(l.price)).filter((p) => p > 0);
  const tags = seoMeta({
    lang,
    path,
    title: template.title?.replace("{{name}}", component.name),
    description: template.description?.replace("{{name}}", component.name),
    image: component.image_url || void 0
  });
  if (prices.length > 0) {
    tags.push({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Product",
        name: component.name,
        ...component.image_url ? {
          image: component.image_url
        } : {},
        sku: component.product_code,
        ...component.brand ? {
          brand: {
            "@type": "Brand",
            name: component.brand
          }
        } : {},
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: listings.length,
          offers: listings.map((l) => ({
            "@type": "Offer",
            price: l.price,
            priceCurrency: "EUR",
            url: l.url,
            availability: ["in_stock", "orderable"].includes(l.stock_status) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: l.source
            }
          }))
        }
      }
    });
  }
  tags.push({
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{
        "@type": "ListItem",
        position: 1,
        name: "Builder",
        item: `${SITE_URL}${localePath(lang, "/builder")}`
      }, {
        "@type": "ListItem",
        position: 2,
        name: params.type.toUpperCase(),
        item: `${SITE_URL}${localePath(lang, `/builder/components/${params.type}`)}`
      }, {
        "@type": "ListItem",
        position: 3,
        name: component.name,
        item: `${SITE_URL}${localePath(lang, path)}`
      }]
    }
  });
  return tags;
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: builderDetail,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function loader() {
  throw data(null, {
    status: 404
  });
}
const ErrorBoundary2 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary3() {
  return /* @__PURE__ */ jsx(NotFound, {});
});
const notFound = UNSAFE_withComponentProps(NotFound);
const meta = ({
  location
}) => {
  const lang = langFromPathname(location.pathname);
  return seoMeta({
    lang,
    path: location.pathname,
    ...pagesSeo(lang, "notFound"),
    noindex: true
  });
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary2,
  default: notFound,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CgG9LBvo.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/index-DcNlVx-A.js", "/assets/i18next-QWGFGhSW.js", "/assets/common-DJwBYBS7.js", "/assets/profile-C8Re-a3L.js", "/assets/pages-FsG97Wgo.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-CMukhORn.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/index-DcNlVx-A.js", "/assets/i18next-QWGFGhSW.js", "/assets/common-DJwBYBS7.js", "/assets/profile-C8Re-a3L.js", "/assets/pages-FsG97Wgo.js", "/assets/QueryClientProvider-ieKKEEbv.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/ToastContext-CDBCYNcr.js", "/assets/Icons-CfIS_OBm.js", "/assets/NotFound-DIn4eJM0.js", "/assets/useTranslation-BRWYrc9o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/locale": { "id": "routes/locale", "parentId": "root", "path": ":lang?", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/locale-DMqGkVaW.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/useTranslation-BRWYrc9o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/layout": { "id": "routes/layout", "parentId": "routes/locale", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/layout-DsuQzc_X.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/Icons-CfIS_OBm.js", "/assets/ToastContext-CDBCYNcr.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/index-DcNlVx-A.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "routes/layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-BO9wFGXu.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/seoMeta-BhED5j-a.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/guide": { "id": "routes/guide", "parentId": "routes/layout", "path": "guide", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/guide-BGrgbVa4.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/seoMeta-BhED5j-a.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/Icons-CfIS_OBm.js", "/assets/i18next-QWGFGhSW.js", "/assets/SidePanel-CunfoRic.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/email-verified": { "id": "routes/email-verified", "parentId": "routes/layout", "path": "email-verified", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/email-verified-CSHRWxAs.js", "imports": ["/assets/common-DJwBYBS7.js", "/assets/localePath-DxHjtI_D.js", "/assets/seoMeta-BhED5j-a.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "routes/layout", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/login-BPIBylb4.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/seoMeta-BhED5j-a.js", "/assets/index-DcNlVx-A.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "routes/layout", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/register-BR1HDDC5.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/seoMeta-BhED5j-a.js", "/assets/index-DcNlVx-A.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/builds": { "id": "routes/builds", "parentId": "routes/layout", "path": "builds", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/builds-C0EXnXm3.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/index-DcNlVx-A.js", "/assets/ComponentDetail-BboAZwOs.js", "/assets/Modal-heksB1zh.js", "/assets/Icons-CfIS_OBm.js", "/assets/SidePanel-CunfoRic.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/componentPrice-DTf1o4uo.js", "/assets/ToastContext-CDBCYNcr.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/seoMeta-BhED5j-a.js", "/assets/ListingsTable-gUhthRtb.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/profile": { "id": "routes/profile", "parentId": "routes/layout", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/profile-D1U05vdN.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/index-DcNlVx-A.js", "/assets/Modal-heksB1zh.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/ToastContext-CDBCYNcr.js", "/assets/Icons-CfIS_OBm.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/profile-C8Re-a3L.js", "/assets/seoMeta-BhED5j-a.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/builder": { "id": "routes/builder", "parentId": "routes/layout", "path": "builder", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/builder-B_l45T9z.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/index-DcNlVx-A.js", "/assets/BuilderContext-udviifwI.js", "/assets/Icons-CfIS_OBm.js", "/assets/componentPrice-DTf1o4uo.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/AuthContext-tNLmIRgU.js", "/assets/buildSlots-BYpHUih1.js", "/assets/ToastContext-CDBCYNcr.js", "/assets/SidePanel-CunfoRic.js", "/assets/QueryClientProvider-ieKKEEbv.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/builder-index": { "id": "routes/builder-index", "parentId": "routes/builder", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/builder-index-Cc_4aey_.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/BuilderContext-udviifwI.js", "/assets/Icons-CfIS_OBm.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/componentPrice-DTf1o4uo.js", "/assets/seoMeta-BhED5j-a.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/builder-picker": { "id": "routes/builder-picker", "parentId": "routes/builder", "path": "components/:type", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/builder-picker-CkeUQND0.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/QueryClientProvider-ieKKEEbv.js", "/assets/buildSlots-BYpHUih1.js", "/assets/BuilderContext-udviifwI.js", "/assets/index-DcNlVx-A.js", "/assets/ListingsTable-gUhthRtb.js", "/assets/Icons-CfIS_OBm.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/componentPrice-DTf1o4uo.js", "/assets/seoMeta-BhED5j-a.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/builder-detail": { "id": "routes/builder-detail", "parentId": "routes/builder", "path": "components/:type/:code", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/builder-detail-BH7WfQMN.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/ComponentDetail-BboAZwOs.js", "/assets/BuilderContext-udviifwI.js", "/assets/seoMeta-BhED5j-a.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/ListingsTable-gUhthRtb.js", "/assets/componentPrice-DTf1o4uo.js", "/assets/Icons-CfIS_OBm.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/not-found": { "id": "routes/not-found", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/not-found-QxQjEEn7.js", "imports": ["/assets/localePath-DxHjtI_D.js", "/assets/NotFound-DIn4eJM0.js", "/assets/seoMeta-BhED5j-a.js", "/assets/useTranslation-BRWYrc9o.js", "/assets/pages-FsG97Wgo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-d71739e3.js", "version": "d71739e3", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "v8_passThroughRequests": false, "v8_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/locale": {
    id: "routes/locale",
    parentId: "root",
    path: ":lang?",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/layout": {
    id: "routes/layout",
    parentId: "routes/locale",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/home": {
    id: "routes/home",
    parentId: "routes/layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/guide": {
    id: "routes/guide",
    parentId: "routes/layout",
    path: "guide",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/email-verified": {
    id: "routes/email-verified",
    parentId: "routes/layout",
    path: "email-verified",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/login": {
    id: "routes/login",
    parentId: "routes/layout",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/register": {
    id: "routes/register",
    parentId: "routes/layout",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/builds": {
    id: "routes/builds",
    parentId: "routes/layout",
    path: "builds",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "routes/layout",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/builder": {
    id: "routes/builder",
    parentId: "routes/layout",
    path: "builder",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/builder-index": {
    id: "routes/builder-index",
    parentId: "routes/builder",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  },
  "routes/builder-picker": {
    id: "routes/builder-picker",
    parentId: "routes/builder",
    path: "components/:type",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/builder-detail": {
    id: "routes/builder-detail",
    parentId: "routes/builder",
    path: "components/:type/:code",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/not-found": {
    id: "routes/not-found",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
