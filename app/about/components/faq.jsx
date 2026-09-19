"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { SITE_CONFIG } from "@/lib/seo/config";

function FAQItem({ item, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 90, damping: 18 }}
      viewport={{ once: true, amount: 0.2 }}
      className="border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/[0.03] overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
          <span
            className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-snug"
            itemProp="name"
          >
            {item.question}
          </span>
        </span>
        <span className="shrink-0 text-gray-400 dark:text-gray-500 text-xs">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-gray-100 dark:border-white/5 mt-1">
              <p
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pt-3"
                itemProp="text"
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqs = SITE_CONFIG.faqsAbout || [];

  return (
    <section className="py-12 md:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto container px-6 sm:px-8 md:px-16">
        <SectionHeader label="Questions & Answers" heading="Frequently Asked Questions" id="faq-heading" />
      </div>

      <div className="mx-auto container px-6 sm:px-8 md:px-16 mt-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
