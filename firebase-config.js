// firebase-config.js
// إعدادات Firebase لمشروع gcxc-e18b4.
// ملاحظة: القالب يستخدم Firebase Compat داخل صفحات HTML المباشرة، لذلك أبقينا نفس أسماء المتغيرات العامة حتى تعمل الملفات بدون نظام بناء.

const firebaseConfig5546 = {
  apiKey: "AIzaSyCcrF9hnLIHxGCuR8r5G5Xlqh_WNLsz_QU",
  authDomain: "gcxc-e18b4.firebaseapp.com",
  databaseURL: "https://gcxc-e18b4-default-rtdb.firebaseio.com",
  projectId: "gcxc-e18b4",
  storageBucket: "gcxc-e18b4.firebasestorage.app",
  messagingSenderId: "202016803654",
  appId: "1:202016803654:web:7d198a78ed2f4d552c7347",
  measurementId: "G-XF40P4JNDN"
};

const firebaseConfig = firebaseConfig5546;

const FIREBASE_PATHS_5546 = {
  settingsStore: "settingsMohanad/storeMohanad",
  settingsBanners: "settingsMohanad/bannersMohanad",
  settingsPaymentMethods: "settingsMohanad/paymentMethodsMohanad",
  categories: "categoriesMohanad",
  products: "productsMohanad",
  users: "usersMohanad",
  orders: "ordersMohanad",
  adminNotifications: "settingsMohanad/adminNotificationsMohanad",
  cashierClients: "DFDFG_clients",
  cashierLinks: "settingsMohanad/cashierLinksMohanad"
};

const ADMIN_PATHS_5546 = {
  admin: "settingsMohanad/adminMohanad",
  store: FIREBASE_PATHS_5546.settingsStore,
  banners: FIREBASE_PATHS_5546.settingsBanners,
  categories: FIREBASE_PATHS_5546.categories,
  products: FIREBASE_PATHS_5546.products,
  paymentMethods: FIREBASE_PATHS_5546.settingsPaymentMethods,
  orders: FIREBASE_PATHS_5546.orders,
  adminNotifications: FIREBASE_PATHS_5546.adminNotifications,
  adminPushTokens: "settingsMohanad/adminPushTokensMohanad",
  menuItems: "settingsMohanad/sidebarMenuMohanad",
  pageSections: "settingsMohanad/pageSectionsMohanad",
  shippingZones: "settingsMohanad/shippingZonesMohanad",
  globalCheckoutFields: "settingsMohanad/globalCheckoutFieldsMohanad",
  socialLinks: "settingsMohanad/socialLinksMohanad",
  cashierClients: FIREBASE_PATHS_5546.cashierClients,
  cashierLinks: FIREBASE_PATHS_5546.cashierLinks
};

const STORAGE_KEYS_5546 = {
  cart: "mohanad_cart",
  wishlist: "mohanad_wishlist",
  checkoutSelection: "mohanad_checkout_selection",
  selectedCategory: "mohanad_selected_category"
};

// مفتاح Web Push من Firebase Cloud Messaging.
// ضعه من إعدادات المتجر داخل لوحة الأدمن أو اكتبه هنا إذا أردت تشغيل إشعارات الخلفية عبر FCM.
const FCM_VAPID_KEY_5546 = "";

if (typeof window !== "undefined") {
  window.firebaseConfig5546 = firebaseConfig5546;
  window.firebaseConfig = firebaseConfig;
  window.FIREBASE_PATHS_5546 = FIREBASE_PATHS_5546;
  window.ADMIN_PATHS_5546 = ADMIN_PATHS_5546;
  window.STORAGE_KEYS_5546 = STORAGE_KEYS_5546;
  window.FCM_VAPID_KEY_5546 = FCM_VAPID_KEY_5546;
}
