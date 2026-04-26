"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faUser,
	faFolderOpen,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
	{ id: "home",     icon: faHome },
	{ id: "about",    icon: faUser },
	{ id: "projects", icon: faFolderOpen },
	{ id: "contact",  icon: faEnvelope },
];

const Sidebar = () => {
	const scrollTo = (id) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="hidden md:flex fixed z-40 bg-gray-700 h-[50vh] w-14 flex-col justify-between items-center p-4 left-0 top-1/4 rounded-e-3xl">
			<ul className="flex flex-col justify-evenly items-center h-full text-gray-50">
				{navItems.map(({ id, icon }) => (
					<li key={id}>
						<button
							onClick={() => scrollTo(id)}
							aria-label={id}
							className="hover:text-gray-300 transition-colors">
							<FontAwesomeIcon icon={icon} className="text-xl" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
