const isCodeSandBox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  root: "./",
  publicDir: "./public",
  base: "./",
  server: {
    host: true,
    open: !isCodeSandBox, // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    sourcemap: true,
  },
};
