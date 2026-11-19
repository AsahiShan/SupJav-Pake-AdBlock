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

await patchOnce(
  'bin/utils/build-workspace.ts',
  "    const sourceTauri = path.join(sourceDirectory, 'src-tauri');",
  [
    "    const sourceFilters = path.join(sourceDirectory, 'filters');",
    '    if (await fs.pathExists(sourceFilters)) {',
    "      await fs.copy(sourceFilters, path.join(directory, 'filters'));",
    '    }',
    '',
    "    const sourceTauri = path.join(sourceDirectory, 'src-tauri');",
  ].join('\n'),
  'include bundled filter lists in the isolated build workspace',
);

const supJavRules = [
  '! SupJav-specific cosmetic filters sourced from public community rules.',
  'supjav.com##.movv-ad',
  'supjav.com##div.movv-ad.ad_3_3',
  'supjav.com##div.movv-ad.ad_3_2',
  'supjav.com##div.right',
  'supjav.com###adsbox',
  'supjav.com##.adsbyexoclick',
  'supjav.com##.exo-ipp',
  'supjav.com##div[class^="ad_"]',
  'supjav.com##div[class^="ts-inpage-push"]',
  'supjav.com##.simpleToast',
  'supjav.com##.ipprtcnt',
  'supjav.com##div[class$="_scrollable-doc"]',
  'supjav.com##.ts-inpage-push-dating',
  'supjav.com##.ts-inpage-push-dating__bottom',
  'supjav.com##.adsBox',
  'supjav.com##.text-ad',
  'supjav.com##.textAd',
  'supjav.com##.text_ad',
  'supjav.com##.text_ads',
  'supjav.com##.text-ads',
  'supjav.com##.text-ad-links',
  '',
  '! SupJav-specific third-party ad endpoints. Scope to SupJav only.',
  '||adxadserv.com^$domain=supjav.com',
  '||xlivrdr.com^$domain=supjav.com',
  '||fanza.cc^$domain=supjav.com',
  '||go.rmhfrtnd.com^$domain=supjav.com',
  '||tapioni.com^$domain=supjav.com',
  '||go.mnaspm.com^$domain=supjav.com',
  '||towableunto.cfd^$domain=supjav.com',
  '||prd.jwpltx.com^$domain=supjav.com',
].join('\n');

const rustConst = [
  'const SUPJAV_CUSTOM_FILTERS: &str = r#"',
  supJavRules,
  '"#;',
  '',
  'fn filter_set(groups: &[&str], rule_types: RuleTypes, debug: bool) -> FilterSet {',
].join('\n');

await patchOnce(
  'src-tauri/src/app/content_blocking.rs',
  'fn filter_set(groups: &[&str], rule_types: RuleTypes, debug: bool) -> FilterSet {',
  rustConst,
  'add SupJav-specific banner and ad endpoint rules',
);

await patchOnce(
  'src-tauri/src/app/content_blocking.rs',
  '    }\n    set\n}',
  [
    '    }',
    '',
    '    // Apply site-specific SupJav filters in addition to the bundled lists.',
    '    set.add_filter_list(',
    '        SUPJAV_CUSTOM_FILTERS.to_owned(),',
    '        ParseOptions {',
    '            rule_types,',
    '            ..ParseOptions::default()',
    '        },',
    '    );',
    '    set',
    '}',
  ].join('\n'),
  'load SupJav-specific rules into the native filter engine',
);
