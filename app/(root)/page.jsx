"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchJson } from "@/lib/api";
import Me from "@/public/image/me.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDownload, faPaperPlane, faCode, faFlask, faAward, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import {
  Button,
  Card,
  CardBody,
  Section,
  Container,
  Heading,
  Badge,
  Tag,
  Timeline,
  CTA,
  ProjectCard,
  PublicationCard,
  PageTransition,
} from "@/components/ui";

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [papers, setPapers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchJson("/api/settings").catch(() => ({ data: {} })),
      fetchJson("/api/projects").catch(() => ({ data: [] })),
      fetchJson("/api/research/papers").catch(() => ({ data: [] })),
      fetchJson("/api/experience").catch(() => ({ data: [] })),
      fetchJson("/api/skills").catch(() => ({ data: [] })),
      fetchJson("/api/certifications").catch(() => ({ data: [] })),
    ]).then(([setRes, projRes, paperRes, expRes, skillRes, certRes]) => {
      if (!isMounted) return;
      setSettings(setRes.data || {});
      setProjects(projRes.data || []);
      setPapers(paperRes.data || []);
      setExperiences(expRes.data || []);
      setSkills(skillRes.data || []);
      setCertifications(certRes.data || []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const fullName = settings?.full_name || "Vedaang Sharma";
  const tagline = "Backend Engineer · AI Engineer · Researcher";
  const heroSubtitle =
    settings?.hero_subtitle ||
    "Building intelligent applications, scalable distributed systems, and deep learning architectures. Published researcher and full-stack engineer dedicated to technical precision.";

  const featuredProjects = projects.filter((p) => p.show !== false && p.featured !== false).slice(0, 3);
  const featuredPapers = papers.slice(0, 2);
  const formattedTimeline = experiences.map((exp) => ({
    id: exp.id,
    period: exp.period || exp.duration || (exp.year ? `${exp.year}` : ""),
    title: exp.role || exp.title,
    subtitle: exp.company || exp.organization,
    description: exp.description || exp.summary,
    tags: exp.skills || exp.technologies || [],
  }));

  return (
    <PageTransition>
      {/* ── 1. HERO SECTION ── */}
      <Section spacing="none" className="min-h-[90vh] flex items-center pt-28 pb-16">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Badge variant="gold" size="lg" className="mb-4">
                  {tagline}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-[#181713] dark:text-[#F7F5DC] tracking-tight leading-[1.1] mb-6"
              >
                Engineering scalable systems with <span className="text-[#FF8A00] dark:text-[#FFC233]">AI intelligence</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-[#57534E] dark:text-[#9E9A8B] leading-relaxed max-w-2xl mb-8"
              >
                {heroSubtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button href="/projects" variant="gold" size="lg" icon={<FontAwesomeIcon icon={faArrowRight} />} iconPosition="right">
                  Explore Selected Work
                </Button>
                <Button href="/api/resume" variant="outline" size="lg" icon={<FontAwesomeIcon icon={faDownload} />}>
                  Resume PDF
                </Button>
              </motion.div>

              {/* Social Quick Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mt-10 pt-6 border-t border-[#E3DEC3]/60 dark:border-[#33312B]/60 text-xs font-mono text-[#787467] dark:text-[#9E9A8B]"
              >
                <span className="font-semibold text-[#181713] dark:text-[#F7F5DC]">Connect:</span>
                <a href="https://github.com/gtathelegend" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF8A00] dark:hover:text-[#FFC233] transition-colors flex items-center gap-1">
                  <FontAwesomeIcon icon={faGithub} /> GitHub
                </a>
                <span>&middot;</span>
                <a href="https://www.linkedin.com/in/vedaangsharma2006/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF8A00] dark:hover:text-[#FFC233] transition-colors flex items-center gap-1">
                  <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                </a>
              </motion.div>
            </div>

            {/* Hero Right Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-[#E3DEC3] dark:border-[#33312B] bg-[#F0EDD4] dark:bg-[#1C1B17] shadow-editorial"
              >
                <Image
                  src={Me}
                  alt={fullName}
                  fill
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181713]/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <p className="font-heading font-bold text-lg text-[#F7F5DC]">{fullName}</p>
                    <p className="text-xs font-mono text-[#FFC233]">CS &amp; AI Engineering &middot; India</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 2. FEATURED WORK ── */}
      <Section bg="alt" spacing="default">
        <Container size="lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <Heading
              level={2}
              badge="Selected Work"
              badgeVariant="orange"
              subtitle="Production systems, AI pipelines, and engineering case studies."
            >
              Featured Work
            </Heading>
            <Button href="/projects" variant="outline" size="md">
              All Projects &rarr;
            </Button>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id || project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#E3DEC3] dark:border-[#33312B] rounded-xl text-[#787467]">
              Projects loading...
            </div>
          )}
        </Container>
      </Section>

      {/* ── 3. PUBLICATIONS ── */}
      {featuredPapers.length > 0 && (
        <Section spacing="default">
          <Container size="lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <Heading
                level={2}
                badge="Research &amp; Inquiry"
                badgeVariant="gold"
                subtitle="Peer-reviewed research and academic publications in computer science and AI."
              >
                Publications
              </Heading>
              <Button href="/research" variant="outline" size="md">
                All Publications &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPapers.map((paper) => (
                <PublicationCard key={paper.id || paper.title} publication={paper} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 4. JOURNEY & EXPERIENCE ── */}
      <Section bg="surface" spacing="default">
        <Container size="lg">
          <div className="max-w-3xl mb-12">
            <Heading
              level={2}
              badge="Experience &amp; Journey"
              badgeVariant="neutral"
              subtitle="Engineering roles, research positions, and software milestones."
            >
              Work &amp; Experience
            </Heading>
          </div>

          {formattedTimeline.length > 0 ? (
            <Timeline items={formattedTimeline} />
          ) : (
            <div className="text-sm font-mono text-[#787467]">Loading experience timeline...</div>
          )}
        </Container>
      </Section>

      {/* ── 5. SKILLS PREVIEW ── */}
      <Section spacing="default">
        <Container size="lg">
          <Heading
            level={2}
            badge="Technical Competence"
            badgeVariant="gold"
            subtitle="Core technical stack across backend, artificial intelligence, cloud, and frontend systems."
            align="center"
            className="mb-12"
          >
            Capabilities &amp; Tech Stack
          </Heading>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="warm" className="p-6">
              <div className="flex items-center gap-2 mb-3 text-[#FF8A00]">
                <FontAwesomeIcon icon={faCode} />
                <h3 className="font-heading font-bold text-base text-[#181713] dark:text-[#F7F5DC]">Backend &amp; APIs</h3>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#9E9A8B] mb-4">High-throughput microservices &amp; REST/gRPC endpoints.</p>
              <div className="flex flex-wrap gap-1.5">
                {["Node.js", "Python", "Go", "Next.js", "PostgreSQL", "Redis"].map((t) => (
                  <Tag key={t} size="sm" variant="mono">{t}</Tag>
                ))}
              </div>
            </Card>

            <Card variant="warm" className="p-6">
              <div className="flex items-center gap-2 mb-3 text-[#FFC233]">
                <FontAwesomeIcon icon={faFlask} />
                <h3 className="font-heading font-bold text-base text-[#181713] dark:text-[#F7F5DC]">AI &amp; ML Systems</h3>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#9E9A8B] mb-4">Computer vision pipelines, LLM agents &amp; PyTorch models.</p>
              <div className="flex flex-wrap gap-1.5">
                {["PyTorch", "OpenCV", "Transformers", "LangChain", "TensorFlow"].map((t) => (
                  <Tag key={t} size="sm" variant="gold">{t}</Tag>
                ))}
              </div>
            </Card>

            <Card variant="warm" className="p-6">
              <div className="flex items-center gap-2 mb-3 text-[#FF8A00]">
                <FontAwesomeIcon icon={faLayerGroup} />
                <h3 className="font-heading font-bold text-base text-[#181713] dark:text-[#F7F5DC]">Cloud &amp; DevOps</h3>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#9E9A8B] mb-4">Containerization, CI/CD pipelines &amp; cloud serverless.</p>
              <div className="flex flex-wrap gap-1.5">
                {["Docker", "AWS", "Vercel", "Supabase", "Git", "Linux"].map((t) => (
                  <Tag key={t} size="sm" variant="orange">{t}</Tag>
                ))}
              </div>
            </Card>

            <Card variant="warm" className="p-6">
              <div className="flex items-center gap-2 mb-3 text-[#CE2929]">
                <FontAwesomeIcon icon={faAward} />
                <h3 className="font-heading font-bold text-base text-[#181713] dark:text-[#F7F5DC]">Frontend Engineering</h3>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#9E9A8B] mb-4">Responsive, accessible &amp; high-performance web apps.</p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5/CSS3"].map((t) => (
                  <Tag key={t} size="sm" variant="neutral">{t}</Tag>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ── 6. CERTIFICATIONS PREVIEW ── */}
      {certifications.length > 0 && (
        <Section bg="alt" spacing="default">
          <Container size="lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <Heading
                level={2}
                badge="Verified Credentials"
                badgeVariant="neutral"
                subtitle="Industry certifications &amp; verified technical credentials."
              >
                Certifications
              </Heading>
              <Button href="/certifications" variant="outline" size="md">
                View All &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.slice(0, 3).map((cert) => (
                <Card key={cert.id || cert.title} variant="default" className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="gold" size="sm">{cert.issuer || "Verified"}</Badge>
                    {cert.year && <span className="text-xs font-mono text-[#787467]">{cert.year}</span>}
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#181713] dark:text-[#F7F5DC] mb-1">
                    {cert.title || cert.name}
                  </h4>
                  {cert.credential_id && (
                    <p className="text-xs font-mono text-[#57534E] dark:text-[#9E9A8B]">ID: {cert.credential_id}</p>
                  )}
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 7. CONTACT CTA SECTION ── */}
      <Section spacing="large">
        <Container size="lg">
          <CTA />
        </Container>
      </Section>
    </PageTransition>
  );
}
