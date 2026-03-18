import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      section: "Orders & Shipping",
      items: [
        {
          question: "How long will it take to receive my order?",
          answer: "Inside Dhaka, we deliver within 24-48 hours. Outside Dhaka, it typically takes 3-5 business days depending on the courier service."
        },
        {
          question: "What are the shipping charges?",
          answer: "Shipping inside Dhaka is ৳80. Shipping outside Dhaka is ৳150. We offer FREE delivery on orders over ৳1500!"
        },
        {
          question: "Can I track my order?",
          answer: "Yes, once your order is dispatched, we will send you a tracking number via SMS/Email which you can use on our courier partner's website."
        }
      ]
    },
    {
      section: "Products & Authenticity",
      items: [
        {
          question: "Are your products 100% authentic?",
          answer: "Absolutely. We source all our products directly from brand-authorized distributors or official brand stores. Each product comes with its original packaging and batch codes that you can verify."
        },
        {
          question: "How do I know if a product is suitable for my skin type?",
          answer: "You can use our 'Skin Diagnostic' tool on the homepage or consult with our experts via WhatsApp/Facebook for personalized recommendations."
        },
        {
          question: "Do you sell expired or near-expiry products?",
          answer: "No. We have strict quality control and inventory management to ensure every product sold has at least 6-12 months of shelf life remaining, unless explicitly stated in a clearance sale."
        }
      ]
    },
    {
      section: "Returns & Exchanges",
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 7-day return policy for unused, unopened products in their original packaging. If you receive a damaged or wrong product, please contact us within 24 hours of delivery."
        },
        {
          question: "How do I initiate a return?",
          answer: "You can call our support line or message us on Facebook/WhatsApp with your Order ID and photos of the product. Once approved, we will arrange a pickup or ask you to send it back."
        }
      ]
    },
    {
      section: "Payments",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Cash on Delivery (COD), bKash, Nagad, and all major Credit/Debit cards via our secure payment gateway."
        },
        {
          question: "Is it safe to pay online on your website?",
          answer: "Yes, our website uses SSL encryption to ensure your payment details are always secure. We do not store your card information on our servers."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl py-16 md:py-24">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, and services.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((group, idx) => (
            <section key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <h2 className="font-display text-2xl font-semibold mb-6 pb-2 border-b border-border">{group.section}</h2>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((faq, faqIdx) => (
                  <AccordionItem key={faqIdx} value={`item-${idx}-${faqIdx}`}>
                    <AccordionTrigger className="font-body text-left hover:text-primary hover:no-underline transition-colors py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="mt-20 p-8 bg-secondary/50 rounded-2xl text-center animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <h3 className="font-display text-xl font-bold mb-2">Still have questions?</h3>
          <p className="font-body text-muted-foreground mb-6">
            Our customer support team is here to help you 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:+880123456789" 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Call Us
            </a>
            <a 
              href="/contact" 
              className="bg-background border border-border px-6 py-2.5 rounded-full font-body text-sm font-semibold hover:bg-muted transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
