import { defineConfig } from 'tsup';

export default defineConfig((_options) => {
  return {
    dts: {
      compilerOptions: {
        // tsup 8.5.1이 TS 6 환경에서 DTS 번들링 시 `baseUrl: "."`을 내부적으로 주입함
        ignoreDeprecations: '6.0',
      },
    },
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
    external: ['react', 'react/jsx-runtime', '@mui/material', '@mui/system', 'react-dom'],
  };
});
