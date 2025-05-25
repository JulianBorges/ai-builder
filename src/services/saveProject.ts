export async function saveProject({
  projectName,
  slug,
  model,
  html_code,
  files,
}: {
  projectName: string;
  slug: string;
  model: string;
  html_code: string;
  files: { name: string; content: string; type: string }[];
}) {
  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, slug, model, html_code, files }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao salvar projeto:", data.error);
    throw new Error(data.error);
  }

  return data;
}
