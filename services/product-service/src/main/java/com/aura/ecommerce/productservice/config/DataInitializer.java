package com.aura.ecommerce.productservice.config;

import com.aura.ecommerce.productservice.entity.Category;
import com.aura.ecommerce.productservice.entity.Product;
import com.aura.ecommerce.productservice.repository.CategoryRepository;
import com.aura.ecommerce.productservice.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding Maison Vendôme luxury categories...");
            Category horlogerie = categoryRepository.save(new Category(
                    "Haute Horlogerie", "haute-horlogerie",
                    "Swiss precision chronographs, grand complications and skeletonized automatic timepieces."));
            Category maroquinerie = categoryRepository.save(new Category(
                    "Maroquinerie & Fine Leather", "maroquinerie",
                    "Artisan-crafted vegetable-tanned full-grain luggage, briefcases, and refined carryall essentials."));
            Category joaillerie = categoryRepository.save(new Category(
                    "Haute Joaillerie & Accessories", "joaillerie-accessories",
                    "18k precious metals, guilloché cufflinks, titanium eyewear, and bespoke silk appointments."));
            Category acoustic = categoryRepository.save(new Category(
                    "Acoustic & Studio Artistry", "acoustic-studio",
                    "Acoustic reference monitors, custom beryllium drivers, and CNC-machined workspace instruments."));
            Category objets = categoryRepository.save(new Category(
                    "Maison Fragrance & Objets", "fragrance-objets",
                    "Rare extrait de parfum, Italian Carrara marble appointments, and hand-loomed cashmere textiles."));

            if (productRepository.count() == 0) {
                log.info("Seeding Maison Vendôme 20-piece curated luxury collection...");

                // Haute Horlogerie
                seedProduct("Vendôme Grand Complication Tourbillon", "vendome-grand-complication-tourbillon",
                        "Hand-wound flying tourbillon movement with 72-hour power reserve, sapphire crystal exhibition caseback, and hand-stitched alligator leather strap.",
                        new BigDecimal("4850.00"), 8, horlogerie,
                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80");

                seedProduct("Monolith Automatic 40mm Chronograph", "monolith-automatic-chronograph",
                        "Swiss automatic movement with sapphire crystal face, brushed 316L surgical steel casing and quick-release Milanese mesh band.",
                        new BigDecimal("1450.00"), 15, horlogerie,
                        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80");

                seedProduct("Atelier Skeleton Sapphire Automatic", "atelier-skeleton-sapphire-automatic",
                        "Open-worked skeleton caliber featuring blued titanium screws, luminescent baton indices, and anti-reflective double-domed sapphire.",
                        new BigDecimal("2100.00"), 12, horlogerie,
                        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80");

                seedProduct("Heritage Rose Gold Minimalist Dress Watch", "heritage-rose-gold-dress-watch",
                        "Ultra-thin 6.8mm profile with 18k rose gold PVD coating, enamel grand feu dial, and quick-change cordovan strap.",
                        new BigDecimal("980.00"), 20, horlogerie,
                        "https://images.unsplash.com/photo-1539874701005-719fef9ca126?auto=format&fit=crop&w=800&q=80");

                // Maroquinerie & Fine Leather
                seedProduct("Heritage Cognac Leather Weekender Duffel", "heritage-cognac-leather-weekender",
                        "Handcrafted from vegetable-tanned Italian full-grain calfskin with antique brass hardware and waterproof micro-suede lining.",
                        new BigDecimal("890.00"), 25, maroquinerie,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80");

                seedProduct("Sovereign Caviar Leather Briefcase", "sovereign-caviar-leather-briefcase",
                        "Structured French caviar calfskin with lockable palladium clasp, padded 16-inch laptop chamber, and trolley sleeve integration.",
                        new BigDecimal("1250.00"), 14, maroquinerie,
                        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80");

                seedProduct("Full-Grain Vegetable Tanned Bi-Fold Wallet", "full-grain-vegetable-tanned-wallet",
                        "Six hand-beveled card slots, dual banknote compartment, and edge-creased Tuscan bridle leather with RFID shield.",
                        new BigDecimal("195.00"), 50, maroquinerie,
                        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80");

                seedProduct("Italian Nappa Leather Tech Folio", "italian-nappa-leather-tech-folio",
                        "Supple black Nappa leather with magnetic document sleeves, Apple Pencil cradle, and dedicated passport & travel slips.",
                        new BigDecimal("320.00"), 30, maroquinerie,
                        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80");

                // Haute Joaillerie & Accessories
                seedProduct("Artisan 18k Rose Gold Signet Ring", "artisan-rose-gold-signet-ring",
                        "Solid 18k rose gold with a brushed cushion face suitable for bespoke family crest engraving. Hand-polished in our Paris atelier.",
                        new BigDecimal("920.00"), 18, joaillerie,
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80");

                seedProduct("Platinum & Onyx Guilloché Cufflinks", "platinum-onyx-guilloche-cufflinks",
                        "Dual-sided platinum cufflinks centered with natural Brazilian black onyx featuring a sunburst guilloché pattern.",
                        new BigDecimal("460.00"), 22, joaillerie,
                        "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=800&q=80");

                seedProduct("Silk Twill Hand-Rolled Pocket Square", "silk-twill-hand-rolled-pocket-square",
                        "100% 16-momme mulberry silk twill with hand-rolled French edges, featuring a baroque architectural motif in midnight and champagne.",
                        new BigDecimal("145.00"), 40, joaillerie,
                        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80");

                seedProduct("Titanium Aviator Sunglasses with Polarized Optics", "titanium-aviator-sunglasses",
                        "Ultra-lightweight Japanese beta-titanium frame with anti-reflective gradient sapphire-tinted Carl Zeiss lenses.",
                        new BigDecimal("380.00"), 28, joaillerie,
                        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80");

                // Acoustic & Studio Artistry
                seedProduct("Aura Studio ANC Wireless Headphones", "aura-studio-anc-headphones",
                        "Custom 40mm beryllium drivers delivering acoustic perfection. Active noise cancellation with 45 hours battery life.",
                        new BigDecimal("340.00"), 35, acoustic,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");

                seedProduct("Precision Wireless Mechanical Keyboard", "precision-mechanical-keyboard",
                        "CNC machined aluminium chassis with custom lubricated switches, hot-swappable sockets and wireless Bluetooth 5.3 connectivity.",
                        new BigDecimal("220.00"), 42, acoustic,
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80");

                seedProduct("Acoustic Beryllium High-Fidelity Bookshelf Monitors", "acoustic-beryllium-bookshelf-monitors",
                        "Pair of bi-amplified studio reference speakers with pure beryllium dome tweeters, rear bass-reflex ports, and walnut veneered cabinet.",
                        new BigDecimal("1850.00"), 10, acoustic,
                        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80");

                seedProduct("Solid Brass Articulated Desk Lamp", "solid-brass-articulated-desk-lamp",
                        "Hand-turned unlacquered solid brass construction with counterweight balance system and warm 2700K museum-grade CRI 98 LED emitter.",
                        new BigDecimal("410.00"), 16, acoustic,
                        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80");

                // Maison Fragrance & Objets
                seedProduct("Imperial Oud & Bergamot Extrait de Parfum", "imperial-oud-bergamot-extrait",
                        "50ml high-concentration pure perfume oil. Top notes of Calabrian bergamot, heart of Bulgarian damask rose, base of wild Cambodian agarwood.",
                        new BigDecimal("320.00"), 45, objets,
                        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80");

                seedProduct("Carrara Marble & Walnut Desk Valet", "carrara-marble-walnut-desk-valet",
                        "Carved from a single block of Tuscan Bianco Carrara marble and paired with oiled American black walnut catchall tray.",
                        new BigDecimal("260.00"), 24, objets,
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80");

                seedProduct("Handcrafted Crystal Decanter & Tumbler Set", "handcrafted-crystal-decanter-tumbler-set",
                        "Mouth-blown lead-free European crystal decanter with 2 matching rocks glasses featuring diamond-cut geometry.",
                        new BigDecimal("380.00"), 19, objets,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80");

                seedProduct("Atelier Cashmere & Mulberry Silk Throw", "atelier-cashmere-silk-throw",
                        "Woven from Grade-A Mongolian cashmere and grade 6A mulberry silk with gentle fringe borders in a reversible camel and oatmeal weave.",
                        new BigDecimal("580.00"), 15, objets,
                        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80");
            }
        }
    }

    private void seedProduct(String name, String slug, String desc, BigDecimal price, int stock, Category cat, String img) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setDescription(desc);
        p.setPrice(price);
        p.setStockQuantity(stock);
        p.setCategory(cat);
        p.setImageUrl(img);
        p.setActive(true);
        productRepository.save(p);
    }
}
