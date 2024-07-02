#!/usr/bin/env zx

import { versionBump } from 'bumpp'
import glob from 'fast-glob'
import { $ } from 'zx'

try {
  const packages = await glob(['package.json', './packages/*/package.json'])

  console.log('Bumping versions in packages:', packages.join(', '), '\n')

  const result = await versionBump({
    files: packages,
    commit: true,
    push: true,
    tag: true,
  })

  if (!result.newVersion.includes('beta')) {
    console.log('Pushing to release branch')
    await $`git update-ref refs/heads/release refs/heads/main`
    await $`git push origin release`
  }

  await $`pnpm publish -r`

  console.log('New release is ready')
}
catch (err) {
  console.error(err)
}
