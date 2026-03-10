import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, location } = await req.json();

    if (!role) {
      return NextResponse.json({ error: 'No role provided' }, { status: 400 });
    }

    // Adzuna API (Free tier usually allows some requests)
    // For this implementation, we'll provide a high-quality "Live" mock if keys are missing
    // or attempt a public fetch if possible.

    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) {
      // High-quality mock data that looks "Live"
      const mockJobs = [
        {
          id: '1',
          title: `${role}`,
          company: 'TechFlow Solutions',
          location: location || 'Remote',
          salary: '120k - 160k',
          description: 'Looking for a talented professional to join our fast-growing team. Experience with modern tech stacks is a plus.',
          redirect_url: 'https://www.linkedin.com/jobs',
          created: new Date().toISOString()
        },
        {
          id: '2',
          title: `Senior ${role}`,
          company: 'Vertex AI',
          location: 'San Francisco, CA',
          salary: '180k - 220k',
          description: 'Lead our next-generation platform development. Focus on scalability and high performance.',
          redirect_url: 'https://www.indeed.com',
          created: new Date().toISOString()
        },
        {
          id: '3',
          title: `Associate ${role}`,
          company: 'Global Systems Inc.',
          location: location || 'New York, NY',
          salary: 'Competitive',
          description: 'Excellent opportunity for growth and learning in an enterprise environment.',
          redirect_url: 'https://www.glassdoor.com',
          created: new Date().toISOString()
        }
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return NextResponse.json({ jobs: mockJobs, isMock: true });
    }

    // Real API implementation if keys are present
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=${encodeURIComponent(role)}&where=${encodeURIComponent(location || '')}`
    );
    const data = await response.json();

    const jobs = data.results.map((j: any) => ({
      id: j.id,
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      salary: j.salary_min ? `$${(j.salary_min / 1000).toFixed(0)}k+` : 'Contact for salary',
      description: j.description,
      redirect_url: j.redirect_url,
      created: j.created
    }));

    return NextResponse.json({ jobs });

  } catch (error: any) {
    console.error('Job fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
