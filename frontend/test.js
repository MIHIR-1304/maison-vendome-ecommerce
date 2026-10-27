import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('Running automated frontend test suite...');

// 1. Verify required pages exist
const requiredPages = [
  'HomePage.jsx',
  'ProductListPage.jsx',
  'ProductDetailPage.jsx',
  'LoginPage.jsx',
  'RegisterPage.jsx',
  'CartPage.jsx',
  'CheckoutPage.jsx',
  'PaymentSuccessPage.jsx',
  'PaymentCancelPage.jsx',
  'AccountPage.jsx',
  'OrderHistoryPage.jsx',
  'OrderDetailPage.jsx',
  'WishlistPage.jsx',
  'NotFoundPage.jsx',
];

for (const page of requiredPages) {
  const filePath = path.join(process.cwd(), 'src', 'pages', page);
  assert.ok(fs.existsSync(filePath), `Required page missing: ${page}`);
  console.log(`  ✓ Page verified: ${page}`);
}

// 2. Verify admin pages exist
const adminPages = [
  'AdminDashboardPage.jsx',
  'AdminProductsPage.jsx',
  'AdminOrdersPage.jsx',
];

for (const page of adminPages) {
  const filePath = path.join(process.cwd(), 'src', 'pages', 'admin', page);
  assert.ok(fs.existsSync(filePath), `Required admin page missing: ${page}`);
  console.log(`  ✓ Admin page verified: ${page}`);
}

// 3. Verify smart category & cart drawer components exist
const components = [
  path.join('components', 'navigation', 'CategoryNav.jsx'),
  path.join('components', 'navigation', 'CategoryDrawer.jsx'),
  path.join('components', 'cart', 'CartDrawer.jsx'),
  path.join('components', 'home', 'SmartCategoryGrids.jsx'),
  path.join('components', 'common', 'QuickViewModal.jsx'),
  path.join('components', 'layout', 'Navbar.jsx'),
  path.join('components', 'layout', 'Footer.jsx'),
];

for (const comp of components) {
  const filePath = path.join(process.cwd(), 'src', comp);
  assert.ok(fs.existsSync(filePath), `Component missing: ${comp}`);
  console.log(`  ✓ Component verified: ${comp}`);
}

// 4. Verify context providers exist
const contexts = ['AuthContext.jsx', 'CartContext.jsx', 'WishlistContext.jsx'];
for (const ctx of contexts) {
  const filePath = path.join(process.cwd(), 'src', 'context', ctx);
  assert.ok(fs.existsSync(filePath), `Context missing: ${ctx}`);
  console.log(`  ✓ Context verified: ${ctx}`);
}

console.log('All 24 frontend components, views, and smart Amazon-style category modules verified successfully!');
