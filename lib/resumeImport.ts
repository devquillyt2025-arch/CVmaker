import { v4 as uuidv4 } from 'uuid';
import { ParsedResume, ResumeData, LanguageProficiency } from '@/lib/types';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * The parser returns dates like "Jun 2021" or "06/2021", but the builder's
 * month picker stores "2021-06". Anything else (a bare year, "Present") is
 * kept as written.
 */
function toMonthValue(d?: string): string {
  const s = (d || '').trim();
  const named = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(s);
  if (named) {
    const i = MONTHS.indexOf(named[1].toLowerCase());
    if (i >= 0) return `${named[2]}-${String(i + 1).padStart(2, '0')}`;
  }
  const numeric = /^(\d{1,2})[/.-](\d{4})$/.exec(s);
  if (numeric && +numeric[1] >= 1 && +numeric[1] <= 12) return `${numeric[2]}-${numeric[1].padStart(2, '0')}`;
  return s;
}

export function parsedToBuilderData(parsed: ParsedResume): ResumeData {
  // The model occasionally omits keys entirely; never let that crash the import.
  parsed = { ...parsed, contact: parsed.contact ?? ({} as ParsedResume['contact']), experience: parsed.experience ?? [] };
  const parts = (parsed.contact.name || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  const locationParts = (parsed.contact.location || '').split(',');
  const city = locationParts[0]?.trim() || '';
  const country = locationParts[1]?.trim() || '';

  return {
    contact: {
      firstName,
      lastName,
      jobTitle: parsed.experience[0]?.title || '',
      email: parsed.contact.email || '',
      phone: parsed.contact.phone || '',
      city,
      country,
      linkedin: parsed.contact.linkedin || '',
      github: '',
      website: '',
    },
    summary: parsed.summary || '',
    experience: (parsed.experience || []).map(exp => ({
      id: uuidv4(),
      company: exp.company || '',
      position: exp.title || '',
      location: '',
      startDate: toMonthValue(exp.startDate),
      endDate: (exp.endDate || '').toLowerCase().includes('present') ? '' : toMonthValue(exp.endDate),
      currentlyWorking: (exp.endDate || '').toLowerCase().includes('present'),
      description: (exp.bullets || []).join('\n'),
    })),
    education: (parsed.education || []).map(edu => ({
      id: uuidv4(),
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      location: '',
      startDate: '',
      endDate: edu.year || '',
      currentlyStudying: false,
      score: edu.cgpa || '',
    })),
    skills: (parsed.skills || []).map(skill => ({
      id: uuidv4(),
      name: skill,
      level: 'Intermediate' as const,
    })),
    projects: (parsed.projects || []).map(proj => ({
      id: uuidv4(),
      name: proj.name || '',
      description: proj.description || '',
      url: proj.url || '',
      startDate: toMonthValue(proj.startDate),
      endDate: toMonthValue(proj.endDate),
    })),
    certifications: (parsed.certifications || []).map(cert => ({
      id: uuidv4(),
      name: cert || '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      doesNotExpire: true,
      credentialId: '',
      credentialUrl: '',
    })),
    languages: (parsed.languages || []).map(lang => {
      const validProficiencies = [
        'Native Speaker',
        'Fluent',
        'Professional Working Proficiency',
        'Limited Working Proficiency',
        'Elementary Proficiency'
      ];
      let prof = lang.proficiency || 'Professional Working Proficiency';
      if (!validProficiencies.includes(prof)) {
        prof = 'Professional Working Proficiency';
      }
      return {
        id: uuidv4(),
        name: lang.name || '',
        proficiency: prof as LanguageProficiency,
      };
    }),
  };
}
