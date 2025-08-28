module.exports = {
  branches: ["main"],
  tagFormat: "notification-service-v${version}",
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    [
      "@semantic-release/release-notes-generator",
      { preset: "conventionalcommits" },
    ],
    "@semantic-release/changelog",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message:
          "chore(notification-service): release ${nextRelease.version} [skip ci]",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "docker build -t abdelkader97/notification-service:${nextRelease.version} ./services/notification-service && docker push abdelkader97/notification-service:${nextRelease.version}",
      },
    ],
  ],
  // 🔥 هذه السطر يفرض أول إصدار
  preset: "conventionalcommits",
  release: { initialVersion: "1.0.0" },
};
