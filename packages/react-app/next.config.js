module.exports = {
	distDir: 'dist',
	webpack5: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	async headers() {
		return [
		  {
			// matching all API routes
			source: "/api/:path*",
			headers: [
			  { key: "Access-Control-Allow-Credentials", value: "true" },
			  { key: "Access-Control-Allow-Origin", value: "*" },
			  { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
			  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
			]
		  }
		]
	  }
};