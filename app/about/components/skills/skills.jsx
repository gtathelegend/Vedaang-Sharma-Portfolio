"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ActivityIcon, CodepenIcon, MobileIcon, WebhookIcon } from "./icons";
import { fetchJson } from "@/lib/api";

const CATEGORY_META = {
  web: {
    title: "Web Development",
    icon: CodepenIcon,
    description: "Building modern, responsive web applications",
  },
  api: {
    title: "REST API / Backend",
    icon: WebhookIcon,
    description: "Creating robust and scalable backend services",
  },
  ai: {
    title: "AI & Machine Learning",
    icon: ActivityIcon,
    description: "Developing intelligent solutions with ML/AI",
  },
  mobile: {
    title: "Mobile Development",
    icon: MobileIcon,
    description: "Cross-platform mobile app development",
  },
};

function buildCategories(skills) {
  const result = {};
  for (const skill of skills) {
    const cat = skill.category ?? "web";
    const type = skill.skill_type ?? skill.skillType ?? "technology";
    if (!result[cat]) {
      result[cat] = {
        ...(CATEGORY_META[cat] ?? { title: cat, icon: CodepenIcon, description: "" }),
        languages: [],
        tools: [],
      };
    }
    if (type === "tool") {
      result[cat].tools.push(skill.name);
    } else {
      result[cat].languages.push(skill.name);
    }
  }
  return result;
}

function SkillCard({ skill, isSelected, onClick }) {
  const Icon = skill.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left cursor-pointer group p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
        isSelected
          ? "bg-white/20 border-black border-2 shadow-lg"
          : "bg-white/10 border-gray-300/20 hover:bg-white/20 hover:border-gray-300/30"
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}>
      <div className="flex items-center gap-4 mb-3">
        <div className="rounded-full p-2 bg-white/30">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{skill.title}</h3>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{skill.description}</p>
    </motion.button>
  );
}

function SkillDetails({ selectedSkill }) {
  return (
    <motion.div
      key={selectedSkill.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-300/30 bg-white/20 backdrop-blur-lg p-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">{selectedSkill.title}</h3>
      {selectedSkill.languages.length > 0 && (
        <div className="mb-5">
          <h4 className="font-medium text-gray-800 mb-3">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkill.languages.map((language) => (
              <span key={language} className="px-3 py-1.5 rounded-full text-sm bg-gray-200/70 text-gray-800">
                {language}
              </span>
            ))}
          </div>
        </div>
      )}
      {selectedSkill.tools.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Tools</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkill.tools.map((tool) => (
              <span key={tool} className="px-3 py-1.5 rounded-full text-sm bg-gray-200/70 text-gray-800">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchJson("/api/skills")
      .then((res) => {
        if (!isMounted) return;
        const cats = buildCategories(res.data || []);
        setSkillCategories(cats);
        setSelectedCategory(Object.keys(cats)[0] ?? null);
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const selectedSkill = selectedCategory ? skillCategories[selectedCategory] : null;
  const categoryKeys = Object.keys(skillCategories);

  if (loading) {
    return (
      <div className="mx-auto container px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Skills</h2>
        <div className="text-gray-500">Loading skills...</div>
      </div>
    );
  }

  if (categoryKeys.length === 0) return null;

  return (
    <div className="relative">
      <div className="mx-auto container px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Skills</h2>
          <p className="text-gray-700 max-w-2xl">
            Select a category to see the specific technologies and tools I work with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categoryKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}>
              <SkillCard
                skill={skillCategories[key]}
                isSelected={selectedCategory === key}
                onClick={() => setSelectedCategory(key)}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedSkill && <SkillDetails selectedSkill={selectedSkill} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
