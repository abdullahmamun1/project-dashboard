const OWNER = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const REPO = /^[\w.-]{1,100}$/;

/**
 * Turns any reasonable spelling of a GitHub repository URL into one canonical form, so
 * `HTTPS://www.GitHub.com/Owner/Repo.git/` and `https://github.com/owner/repo` count as the same
 * repository. Returns null when the input isn't a GitHub repository URL.
 */
export const normalizeRepoUrl = (input: string): string | null => {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const owner = segments[0]!;
  const repo = segments[1]!.replace(/\.git$/i, "");
  if (!OWNER.test(owner) || !REPO.test(repo) || repo === "." || repo === "..") return null;

  // GitHub owner and repository names are case-insensitive.
  return `https://github.com/${owner.toLowerCase()}/${repo.toLowerCase()}`;
};

export default normalizeRepoUrl;
