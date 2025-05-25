import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

type FileData = { name: string, content: string, type: string };

export async function salvarNoSupabase({
  projectName,
  slug,
  model,
  htmlCode,
  files
}: {
  projectName: string,
  slug: string,
  model: string,
  htmlCode: string,
  files: FileData[]
}) {
  const projectId = uuidv4();
  const versionId = uuidv4();
  const createdAt = new Date().toISOString();

  const { error: projectError } = await supabase.from('lovable_projects').insert([
    { id: projectId, name: projectName, slug, model, created_at: createdAt }
  ]);
  if (projectError) throw new Error(`Erro projeto: ${projectError.message}`);

  const { error: versionError } = await supabase.from('lovable_versions').insert([
    { id: versionId, project_id: projectId, html_code: htmlCode, created_at: createdAt }
  ]);
  if (versionError) throw new Error(`Erro versão: ${versionError.message}`);

  const fileInserts = files.map(file => ({
    id: uuidv4(),
    version_id: versionId, // 🔄 atenção: agora associando ao version_id
    path: file.name,
    content: file.content,
    created_at: createdAt
  }));

  const { error: fileError } = await supabase.from('lovable_files').insert(fileInserts);
  if (fileError) throw new Error(`Erro arquivos: ${fileError.message}`);

  return { projectId, versionId };
}
