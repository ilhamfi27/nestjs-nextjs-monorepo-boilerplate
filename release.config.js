/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: ['main'],
  plugins: [
    // Analyze commits to determine version bump (major/minor/patch)
    '@semantic-release/commit-analyzer',
    // Generate release notes from commits
    '@semantic-release/release-notes-generator',
    // Update CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // Create GitHub release
    '@semantic-release/github',
    // Commit CHANGELOG.md and version bump back to the repo
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
