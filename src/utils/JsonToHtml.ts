export function convertContentJsonToHtml(content: any): Record<string, string> {
  const sections: Record<string, string> = {};
  if (!content || typeof content !== 'object') return sections;

  for (const section in content) {
    let html = '';
    const fields = content[section];
    if (typeof fields === 'object') {
      for (const key in fields) {
        const value = fields[key];
        if (Array.isArray(value)) {
          html += `<p><strong>${key}:</strong></p><ul>`;
          for (const item of value) {
            html += "<li>";
            if (typeof item === 'object') {
              for (const subKey in item) {
                html += `<p><em>${subKey}:</em> ${item[subKey]}</p>`;
              }
            } else {
              html += item;
            }
            html += "</li>";
          }
          html += "</ul>";
        } else if (typeof value === 'object') {
          html += `<p><strong>${key}:</strong></p>`;
          for (const subKey in value) {
            html += `<p><em>${subKey}:</em> ${value[subKey]}</p>`;
          }
        } else {
          html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
      }
    }
    sections[section] = html;
  }

  return sections;
}
