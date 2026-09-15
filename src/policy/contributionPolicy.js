const branchPattern =
  /^(?:feat|fix|chore|docs|refactor|test|ci|perf|build|revert)\/[a-z0-9][a-z0-9._-]*$|^dependabot\/.+$/;

export function isValidBranchName(branch) {
  return branch === 'main' || branchPattern.test(branch);
}

export function hasCoauthorTrailer(message) {
  return /^Co-authored-by\s*:/im.test(message);
}

export function validateContribution({ branch, baseBranch, commits = [] }) {
  const errors = [];
  if (!isValidBranchName(branch)) {
    errors.push(
      `La rama "${branch}" no cumple los prefijos trunk-based permitidos.`,
    );
  }
  if (baseBranch && baseBranch !== 'main') {
    errors.push(`El PR debe apuntar a main, no a "${baseBranch}".`);
  }
  const coauthored = commits
    .filter((commit) => hasCoauthorTrailer(commit.message))
    .map((commit) => commit.hash.slice(0, 12));
  if (coauthored.length) {
    errors.push(
      `Trailers Co-authored-by prohibidos en: ${coauthored.join(', ')}.`,
    );
  }
  return errors;
}
