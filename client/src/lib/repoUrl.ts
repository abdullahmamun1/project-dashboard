// Mirrors server/src/utils/normalizeRepoUrl.ts, so the form rejects the same URLs the API would.
const OWNER = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const REPO = /^[\w.-]{1,100}$/;
const GITHUB_HOSTS = ["github.com", "www.github.com"];

export const isGithubHost = (url: string) => {
  try {
    return GITHUB_HOSTS.includes(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
};

export const normalizeRepoUrl = (input: string): string | null => {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!GITHUB_HOSTS.includes(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const owner = segments[0]!;
  const repo = segments[1]!.replace(/\.git$/i, "");
  if (!OWNER.test(owner) || !REPO.test(repo) || repo === "." || repo === "..") return null;

  return `https://github.com/${owner.toLowerCase()}/${repo.toLowerCase()}`;
};
