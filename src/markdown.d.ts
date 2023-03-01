declare module '*.md' {
	const value: string; // markdown is just a string
	export default value;
}

declare module "*.png" {
	const value: any;
	export = value;
 }