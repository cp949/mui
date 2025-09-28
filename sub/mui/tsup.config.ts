import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    dts: true,
    format: ['esm', 'cjs'],
    minify: false, // 주석 보존을 위해 압축 비활성화
    keepNames: true, // 함수/클래스 이름 보존
    entry: {
      index: 'src/index.ts',
      'hooks/index': 'src/hooks/index.ts',
      'helper/index': 'src/helper/index.ts',
    },
    target: 'es2022',
    splitting: true,
    sourcemap: true,
    clean: false,
    external: [
      "react",
      "react/jsx-runtime",
      "@mui/material",
      "@mui/system",
      "react-dom"
    ],
  };
});
