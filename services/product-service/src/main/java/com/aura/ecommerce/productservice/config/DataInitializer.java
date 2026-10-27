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
            log.info("Seeding categories into Product database...");
            Category audio = categoryRepository.save(new Category("Audio & Electronics", "audio-electronics", "High-fidelity audio equipment and gadgets"));
            Category watches = categoryRepository.save(new Category("Minimalist Timepieces", "minimalist-timepieces", "Precision automatic watches"));
            Category carry = categoryRepository.save(new Category("Leather & Carry", "leather-carry", "Artisan leather bags and accessories"));
            Category studio = categoryRepository.save(new Category("Workspace & Studio", "workspace-studio", "Desk setups and ergonomics"));
            Category apparel = categoryRepository.save(new Category("Apparel & Comfort", "apparel-comfort", "Merino and organic cotton staples"));

            if (productRepository.count() == 0) {
                log.info("Seeding initial products into Product database...");
                seedProduct("Aura Studio ANC Wireless Headphones", "aura-studio-anc-headphones",
                        "Custom 40mm beryllium drivers delivering acoustic perfection. Active noise cancellation with 45 hours battery life.",
                        new BigDecimal("299.00"), 35, audio, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");

                seedProduct("Precision Wireless Mechanical Keyboard", "precision-mechanical-keyboard",
                        "CNC machined aluminium chassis with custom lubricated switches, hot-swappable sockets and wireless Bluetooth 5.3 connectivity.",
                        new BigDecimal("189.50"), 42, studio, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80");

                seedProduct("Monolith Automatic 40mm Chronograph", "monolith-automatic-chronograph",
                        "Swiss automatic movement with sapphire crystal face, brushed 316L surgical steel casing and quick-release Milanese mesh band.",
                        new BigDecimal("480.00"), 15, watches, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80");

                seedProduct("Heritage Cognac Leather Weekender", "heritage-leather-weekender",
                        "Handcrafted from vegetable-tanned Italian full-grain leather with antique brass hardware and waterproof nylon lining.",
                        new BigDecimal("345.00"), 20, carry, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80");
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
