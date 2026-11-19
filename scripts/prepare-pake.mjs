import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

async function patchOnce(relativePath, marker, replacement, label) {
  const file = path.join(root, relativePath);
  let source = await fs.readFile(file, 'utf8');

  if (source.includes(replacement.trim())) {
    console.log(`Already patched: ${label}`);
    return;
  }

  if (!source.includes(marker)) {
    throw new Error(
      `Could not patch ${label}: expected upstream code was not found in ${relativePath}. ` +
      `The pinned Pake source may have changed; review the patch before building.`,
    );
  }

  source = source.replace(marker, replacement);
  await fs.writeFile(file, source, 'utf8');
  console.log(`Patched: ${label}`);
}

await patchOnce(
  'bin/builders/BaseBuilder.ts',
  "    const features = ['cli-build'];",
  [
    "    const features = ['cli-build'];",
    "    features.push('runtime-template');",
  ].join('\n'),
  'enable Pake runtime-template / native content blocking',
);

await patchOnce(
  'bin/helpers/merge.ts',
  '  tauriConf.pake.system_tray_path = trayIconPath;',
  [
    '  tauriConf.pake.system_tray_path = trayIconPath;',
    '',
    '  // SupJav: enable Pake built-in ad, tracker and cookie-notice filters.',
    '  Object.assign(tauriConf.pake, {',
    "    content_blocking: ['ads', 'trackers', 'cookies', 'china'],",
    '  });',
  ].join('\n'),
  'enable SupJav filter groups',
);
