-- Seed Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Audio & Electronics', 'audio-electronics', 'Premium high-fidelity audio gear and next-generation smart electronics'),
(2, 'Minimalist Timepieces', 'minimalist-timepieces', 'Precision crafted chronographs, automatic watches and modern horology'),
(3, 'Leather & Carry', 'leather-carry', 'Full-grain artisan leather goods, daily backpacks and travel companions'),
(4, 'Workspace & Studio', 'workspace-studio', 'Ergonomic accessories and precision crafted desk setup essentials'),
(5, 'Apparel & Comfort', 'apparel-comfort', 'Sustainably sourced organic cotton, merino layers and modern essentials');

-- Seed Products
INSERT INTO products (name, slug, description, price, stock_quantity, category_id, image_url, active) VALUES
('Aura Studio ANC Wireless Headphones', 'aura-studio-anc-headphones', 'Custom 40mm beryllium drivers delivering acoustic perfection. Active noise cancellation with 45 hours battery life.', 299.00, 35, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', true),

('Precision Wireless Mechanical Keyboard', 'precision-mechanical-keyboard', 'CNC machined aluminium chassis with custom lubricated switches, hot-swappable sockets and wireless Bluetooth 5.3 connectivity.', 189.50, 42, 4, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', true),

('Nordic Ceramic Minimalist Desk Lamp', 'nordic-ceramic-desk-lamp', 'Warm temperature adjustable ambient light with solid oak base and artisan ceramic shade. Touch dimming controls.', 125.00, 28, 4, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', true),

('Monolith Automatic 40mm Chronograph', 'monolith-automatic-chronograph', 'Swiss automatic movement with sapphire crystal face, brushed 316L surgical steel casing and quick-release Milanese mesh band.', 480.00, 15, 2, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', true),

('Heritage Cognac Leather Weekender', 'heritage-leather-weekender', 'Handcrafted from vegetable-tanned Italian full-grain leather with antique brass hardware and waterproof nylon lining.', 345.00, 20, 3, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', true),

('Aerospace Matte Titanium Cardholder', 'aerospace-titanium-cardholder', 'Ultra-slim RFID blocking wallet precision CNC machined from aerospace Grade 5 titanium. Holds up to 12 cards and folded bills.', 85.00, 60, 3, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', true),

('High-Res Portable DAC & Headphone Amp', 'high-res-portable-dac-amp', 'Dual ESS Sabre DAC chips providing pristine 32-bit/768kHz and DSD512 audio decoding for audiophiles on the move.', 159.00, 25, 1, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', true),

('Heavyweight Merino Wool Overshirt', 'heavyweight-merino-overshirt', '100% extra-fine Australian merino wool tailored for thermal insulation, wind resistance, and modern clean lines.', 195.00, 30, 5, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', true),

('Walnut Wood Ergonomic Monitor Riser', 'walnut-ergonomic-monitor-riser', 'Solid American black walnut stand designed to elevate display to ergonomic eye-level with integrated aluminum tray.', 110.00, 45, 4, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', true),

('Artisan Matte Black Pour-Over Kettle', 'matte-black-pourover-kettle', 'Precision gooseneck spout for optimal extraction flow rate with built-in digital temperature gauge.', 95.00, 38, 4, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', true),

('Kevlar Commuter Daily Laptop Pack', 'kevlar-commuter-laptop-pack', 'Ballistic nylon and Kevlar reinforced weather-resistant construction with dedicated padded 16-inch laptop compartment.', 215.00, 22, 3, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', true),

('Organic Pima Cotton Relaxed Tee (Set of 3)', 'organic-pima-cotton-tee-set', 'Ultra-soft Peruvian long-staple pima cotton in washed black, optic white and heather charcoal.', 105.00, 50, 5, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', true);
