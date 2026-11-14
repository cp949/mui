import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: {
    index: 'src/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'helper/index': 'src/helper/index.ts',
  },
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false, // 주석 보존을 위해 압축 비활성화
  // package.json exports가 .js(esm)/.cjs(cjs) 확장자를 가정하므로 .mjs로 바뀌지 않게 고정
  fixedExtension: false,
  outputOptions: {
    keepNames: true, // 함수/클래스 이름 보존
  },
  checks: {
    moduleLevelDirective: false, // 'use client'가 번들에서 제거되는 경고를 끔(tsup 때와 동일 동작)
  },
  deps: {
    neverBundle: ['react', 'react/jsx-runtime', '@mui/material', '@mui/system', 'react-dom'],
  },
});
