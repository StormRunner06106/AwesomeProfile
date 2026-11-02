const Button = ({ children, variation, ...props }) => (
	<button
		{...props}
		className={`title mr-3  rounded-2xl px-8 py-2 shadow-md transition duration-300 ease-in-out ${
			variation === "primary"
				? "bg-accent hover:bg-transparent border-transparent hover:border-accent border-2 text-on-accent hover:text-accent box-border"
				 : "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-on-accent box-border"
		}`}>
		{children}
	</button>
);

export default Button;
