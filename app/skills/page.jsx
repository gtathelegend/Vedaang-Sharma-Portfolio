"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faBrain, faLayerGroup, faDatabase, faMobile, faTools, faServer } from "@fortawesome/free-solid-svg-icons";

import {
  Section,
  Container,
  Heading,
  Card,
  Tag,
  Badge,
  PageTransition,
} from "@/components/ui";

const CATEGORY_ICONS = {
  backend: faServer,
  ai: faBrain,
  devops: faLayerGroup,
  database: faDatabase,
  frontend: faCode,
  mobile: faMobile,
  other: faTools,
};

const CATEGORY_TITLES = {
  backend: "Backend & Distributed Systems",
  ai: "Artificial Intelligence & ML",
  devops: "Cloud & Infrastructure",
  database: "Data Stores & Databases",
  frontend: "Frontend Engineering",
  mobile: "Mobile Development",
  other: "Tools & Utilities",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJson("/api/skills")
      .then((res) => setSkills(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category ? skill.category.toLowerCase() : "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <PageTransition>
      <Section spacing="none" className="pt-28 pb-16">
        <Container size="lg">
          <div className="max-w-3xl mb-12">
            <Heading
              level={1}
              badge="Capabilities"
              badgeVariant="gold"
              subtitle="Technical stack, languages, frameworks, databases, and engineering tooling."
            >
              Skills &amp; Technologies
            </Heading>
          </div>

          {loading ? (
            <div className="text-center py-20 font-mono text-sm text-[#787467]">
              Loading technical skills matrix...
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((catKey) => {
                const title = CATEGORY_TITLES[catKey] || catKey.toUpperCase();
                const icon = CATEGORY_ICONS[catKey] || faTools;
                const catSkills = grouped[catKey] || [];

                return (
                  <Card key={catKey} variant="warm" className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E3DEC3]/60 dark:border-[#33312B]/60">
                      <div className="flex items-center gap-2 text-[#FF8A00]">
                        <FontAwesomeIcon icon={icon} />
                        <h3 className="font-heading font-bold text-lg text-[#181713] dark:text-[#F7F5DC]">
                          {title}
                        </h3>
                      </div>
                      <Badge variant="gold" size="sm">{catSkills.length}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <Tag key={skill.id || skill.name} size="md" variant="mono">
                          {skill.name}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[#E3DEC3] dark:border-[#33312B] rounded-xl text-[#787467]">
              No skills loaded yet.
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
