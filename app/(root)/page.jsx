"use client";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

import Button from "@/components/Button";
import Me from "@/public/image/me.jpg";
import MeAbout from "@/public/image/me2.jpg";
import Setup from "@/public/image/setup.jpg";
import ProjectAll from "@/public/image/projects.jpg";
import Hr from "@/components/Hr";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub }    from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin }  from "@fortawesome/free-brands-svg-icons";
import { faDiscord }   from "@fortawesome/free-brands-svg-icons";
import { faEnvelope }  from "@fortawesome/free-solid-svg-icons";

const iconMap = { faGithub, faInstagram, faLinkedin, faDiscord, faEnvelope };

const sectionVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideLeft = {
	hidden:  { x: -80, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay },
	}),
};

const slideRight = {
	hidden:  { x: 80, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay, stiffness: 100, damping: 20 },
	}),
};

const fadeUp = {
	hidden:  { y: 40, opacity: 0 },
	visible: (delay = 0) => ({
		y: 0,
		opacity: 1,
		transition: { type: "spring", delay },
	}),
};

export default function MyPage() {
	const [socials, setSocials]           = useState([]);
	const [socialError, setSocialError]   = useState("");

	/* apply scroll-snap to <html> only while this page is mounted */
	useEffect(() => {
		const html = document.documentElement;
		html.style.scrollSnapType    = "y mandatory";
		html.style.overflowY         = "scroll";
		html.style.scrollBehavior    = "smooth";
		return () => {
			html.style.scrollSnapType = "";
			html.style.overflowY      = "";
			html.style.scrollBehavior = "";
		};
	}, []);

	useEffect(() => {
		let isMounted = true;
		fetchJson("/api/socials")
			.then((res) => { if (isMounted) setSocials(res.data || []); })
			.catch(() => { if (isMounted) setSocialError("Unable to load social links."); });
		return () => { isMounted = false; };
	}, []);

	const sortedSocials = socials.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
	const emailSocial   = sortedSocials.find((s) => s.iconName === "faEnvelope" || s.platform === "email");
	const emailHref     = emailSocial?.url || "mailto:vedaangsharma2006@gmail.com?subject=Hello&body=Hello Vedaang,";
	const emailText     = emailHref.startsWith("mailto:") ? emailHref.replace("mailto:", "").split("?")[0] : emailHref;

	return (
		<div>
			{/* ── SECTION 1 · Home ─────────────────────────────────────────── */}
			<section
				id="home"
				className="h-screen flex items-center"
				style={{ scrollSnapAlign: "start" }}>
				<div className="mx-auto container grid grid-cols-1 md:grid-cols-3 gap-4 p-10 overflow-hidden md:px-20">

					{/* text block */}
					<div className="col-span-2 flex flex-col justify-center items-center md:items-start text-center md:text-start">

						{/* mobile avatar */}
						<div className="block md:hidden col-span-1 mx-auto my-10">
							<div className="bg-slate-500 rounded-full h-60 w-60 grayscale hover:grayscale-0 transition-all ease duration-300 overflow-hidden">
								<Image src={Me} width={240} height={240} className="rounded-full object-cover" alt="Vedaang" placeholder="blur" />
							</div>
						</div>

						<motion.h3
							className="uppercase text-xl mb-3 font-normal tracking-[.5rem] text-gray-500"
							variants={slideLeft} custom={0.1}
							initial="hidden" animate="visible">
							Vedaang Sharma
						</motion.h3>

						<motion.h1
							className="text-black text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold my-2 md:my-5"
							variants={slideLeft} custom={0.25}
							initial="hidden" animate="visible">
							Full Stack Developer
						</motion.h1>

						<motion.p
							className="title text-md 2xl:text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem]"
							variants={slideLeft} custom={0.4}
							initial="hidden" animate="visible">
							Hi! I&rsquo;m Vedaang Sharma, a full-stack developer specialising in modern
							web development using React, Node.js, and Next.js, with a growing focus on
							Artificial Intelligence. Passionate about building scalable, user-friendly
							applications and deploying them on cloud platforms like AWS and Azure, while
							also exploring mobile development and Python-based backend technologies.
						</motion.p>

						<motion.div
							className="buttons flex flex-row justify-center items-center space-x-4 mt-10"
							variants={fadeUp} custom={0.55}
							initial="hidden" animate="visible">
							<Button variation="primary">
								<Link href="/docs/cv.pdf" target="_blank" rel="noopener noreferrer" download>
									Download CV
								</Link>
							</Button>
							<Button variation="secondary">
								<a href="#contact">Contact Me</a>
							</Button>
						</motion.div>
					</div>

					{/* desktop avatar */}
					<motion.div
						className="hidden md:flex col-span-1 mx-auto justify-center items-center"
						variants={slideRight} custom={0.35}
						initial="hidden" animate="visible">
						<div className="rounded-full lg:px-12 grayscale hover:grayscale-0 transition-all ease duration-300 overflow-hidden">
							<Image src={Me} width={400} height={550} placeholder="blur" alt="Vedaang"
								className="rounded-full object-cover" />
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── SECTION 2 · About ────────────────────────────────────────── */}
			<section
				id="about"
				className="h-screen relative flex justify-center items-center overflow-hidden"
				style={{ scrollSnapAlign: "start" }}>

				<motion.div
					className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16"
					variants={slideRight} custom={0.3}
					initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
					<div className="bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 relative overflow-hidden">
						<Image src={MeAbout} layout="fill" className="object-cover" alt="Vedaang" placeholder="blur" />
					</div>
				</motion.div>

				<div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start text-start px-10 py-5">
					<motion.h1
						className="bg-white lg:bg-transparent bg-opacity-50 px-3 text-black text-5xl md:text-8xl font-bold"
						variants={slideLeft} custom={0.1}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						About Me
					</motion.h1>
					<Hr />
					<motion.p
						className="title text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem] mb-5"
						variants={slideLeft} custom={0.2}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						A brief introduction about me and my interest.
					</motion.p>
					<motion.div
						variants={fadeUp} custom={0.3}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						<Button variation="primary">
							<Link href="/about">Learn More</Link>
						</Button>
					</motion.div>
				</div>
			</section>

			{/* ── SECTION 3 · Projects ─────────────────────────────────────── */}
			<section
				id="projects"
				className="h-screen relative flex justify-center items-center overflow-hidden"
				style={{ scrollSnapAlign: "start" }}>

				<motion.div
					className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16"
					variants={slideRight} custom={0.3}
					initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
					<div className="bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 relative overflow-hidden">
						<Image src={ProjectAll} layout="fill" className="object-cover" alt="Projects" placeholder="blur" />
					</div>
				</motion.div>

				<div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 flex flex-col justify-center items-start text-start px-10 py-5">
					<motion.h1
						className="bg-white lg:bg-transparent bg-opacity-50 px-3 text-black text-5xl md:text-8xl font-bold"
						variants={slideLeft} custom={0.1}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						My Projects
					</motion.h1>
					<Hr />
					<motion.p
						className="title text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem] mb-5"
						variants={slideLeft} custom={0.2}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						Some of my projects that I have done{" "}
						<span className="bg-transparent md:bg-gray-100 bg-opacity-50 xl:bg-transparent">
							and currently working on.
						</span>
					</motion.p>
					<motion.div
						variants={fadeUp} custom={0.3}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						<Button variation="primary">
							<Link href="/projects">View Projects</Link>
						</Button>
					</motion.div>
				</div>
			</section>

			{/* ── SECTION 4 · Contact ──────────────────────────────────────── */}
			<section
				id="contact"
				className="h-screen relative flex justify-center items-center overflow-hidden"
				style={{ scrollSnapAlign: "start" }}>

				<motion.div
					className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16"
					variants={slideRight} custom={0.3}
					initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
					<div className="bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 relative overflow-hidden">
						<Image src={Setup} layout="fill" className="object-cover" alt="Setup" placeholder="blur" />
					</div>
				</motion.div>

				<div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 flex flex-col justify-center items-start text-start px-10 overflow-hidden">
					<motion.h1
						className="bg-white lg:bg-transparent bg-opacity-50 px-3 text-black text-5xl md:text-8xl font-bold mb-3"
						variants={slideLeft} custom={0.1}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						Get In Touch
					</motion.h1>
					<Hr />
					<motion.p
						className="title text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem] md:mb-5"
						variants={slideLeft} custom={0.2}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						Feel free to contact me if you have any{" "}
						<span className="bg-transparent md:bg-gray-100 bg-opacity-50 xl:bg-transparent">
							questions or just want to say hi.
						</span>
					</motion.p>
					<motion.p
						className="title text-xl mt-4 tracking-wider text-gray-500 leading-[1.7rem] mb-5"
						variants={slideLeft} custom={0.3}
						initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
						<a href={emailHref} className="hover:text-gray-700 transition-colors">{emailText}</a>
					</motion.p>

					{/* social icons */}
					<div className="flex justify-start items-center space-x-4">
						{socialError && <span className="text-red-600 text-sm">{socialError}</span>}
						{!socialError && sortedSocials.map((social, i) => {
							const Icon = iconMap[social.iconName];
							if (!Icon) return null;
							return (
								<motion.a
									key={social._id || social.id || social.url}
									href={social.url}
									target={social.url.startsWith("mailto:") ? undefined : "_blank"}
									rel={social.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
									className="flex justify-center items-center bg-gray-700 w-14 h-14 rounded-full text-gray-100 hover:bg-gray-400 transition-all ease-in-out duration-300"
									variants={fadeUp} custom={0.35 + i * 0.1}
									initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }}>
									<FontAwesomeIcon icon={Icon} className="text-3xl" />
								</motion.a>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
}
