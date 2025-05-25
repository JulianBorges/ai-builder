import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { projectName, slug, model, html_code, files } = req.body;

  const projectId = randomUUID();
  const versionId = randomUUID();
  const createdAt = new Date().toISOString();

  const { error: projectError } = await supabase.from('lovable_projects').insert([
    { id: projectId, name: projectName, slug, model, created_at: createdAt },
  ]);
  if (projectError) return res.status(500).json({ error: projectError.message });

  const { error: versionError } = await supabase.from('lovable_versions').insert([
    { id: versionId, project_id: projectId, html: html_code, created_at: createdAt },
  ]);
  if (versionError) return res.status(500).json({ error: versionError.message });

  const fileInserts = files.map((file: any) => ({
    id: randomUUID(),
    version_id: versionId,
    name: file.name,
    content: file.content,
    type: file.type,
    created_at: createdAt,
  }));

  const { error: fileError } = await supabase.from('lovable_files').insert(fileInserts);
  if (fileError) return res.status(500).json({ error: fileError.message });

  res.status(200).json({ success: true, projectId, versionId });
}
