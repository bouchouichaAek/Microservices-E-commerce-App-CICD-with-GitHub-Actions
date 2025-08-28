module.exports = {
  branches: ["main"],
  tagFormat: "payment-service-v${version}",
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
          "chore(payment-service): release ${nextRelease.version} [skip ci]",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "docker build -t abdelkader97/payment-service:${nextRelease.version} ./services/payment-service && docker push abdelkader97/payment-service:${nextRelease.version}",
      },
    ],
  ],
  // 🔥 هذه السطر يفرض أول إصدار
  preset: "conventionalcommits",
  release: { initialVersion: "1.0.0" },
};
