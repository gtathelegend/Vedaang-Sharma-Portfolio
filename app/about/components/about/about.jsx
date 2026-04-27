import Image from "next/image";
import { motion } from "framer-motion";
import Me1 from "@/public/image/me1.jpg";

export default function About() {
	return (
		<div className="mx-auto container gap-8 px-6 sm:px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 py-12 md:py-24">
			<motion.div
				className="flex justify-center items-center"
				initial={{ opacity: 0, x: -60 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ type: "spring", delay: 0.1 }}
				viewport={{ once: true, amount: 0.2 }}>
				<div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-lg">
					<Image src={Me1} alt="Vedaang Sharma" fill className="object-cover" placeholder="blur" sizes="(max-width: 768px) 90vw, 400px" />
				</div>
			</motion.div>
			<motion.div
				className="flex flex-col justify-center"
				initial={{ opacity: 0, x: 60 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ type: "spring", delay: 0.2 }}
				viewport={{ once: true, amount: 0.2 }}>
				<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">Who I Am</p>
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">Vedaang Sharma</h2>
				<p className="text-gray-600 text-justify text-sm sm:text-base leading-relaxed mb-4">
					Hey there, I&rsquo;m Vedaang Sharma, a <strong className="text-gray-900">passionate Web Developer</strong> with a growing expertise in <strong className="text-gray-900">Artificial Intelligence.</strong> Based in Jaipur, India, I&rsquo;m currently pursuing my degree in <strong className="text-gray-900">Computer Science</strong> at <strong className="text-gray-900">Vivekananda Global University.</strong>
				</p>
				<p className="text-gray-600 text-justify text-sm sm:text-base leading-relaxed">
					My work bridges modern web technologies and intelligent systems — from building responsive, scalable websites to exploring generative AI and LLM-based solutions. Beyond development, I stay curious about design and emerging technologies. In today&rsquo;s ever-changing digital landscape, I believe being a <strong className="text-gray-900">lifelong learner</strong> is essential. Let&rsquo;s connect and explore the evolving intersection of web and AI together!
				</p>
			</motion.div>
		</div>
	);
}
