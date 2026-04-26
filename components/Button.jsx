import PropTypes from "prop-types";

const VARIANT_CLASSES = {
	primary:
		"rounded-xl bg-gray-900 text-white hover:bg-gray-700 border-2 border-transparent shadow-sm",
	secondary:
		"rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
	ghost:
		"text-gray-700 hover:underline underline-offset-4",
};

const Button = ({ children, variation = "primary", className = "", ...props }) => {
	const base =
		"title inline-flex items-center justify-center px-6 py-2.5 font-semibold text-sm transition-all duration-300 ease-in-out cursor-pointer";
	const variant = VARIANT_CLASSES[variation] || VARIANT_CLASSES.primary;

	return (
		<button {...props} className={`${base} ${variant} ${className}`}>
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variation: PropTypes.oneOf(["primary", "secondary", "ghost"]),
	className: PropTypes.string,
};

export default Button;