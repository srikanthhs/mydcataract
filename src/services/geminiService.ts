export async function getDiagnosticAssessment(structuredData: any, imageBase64?: string) {
  try {
    const response = await fetch('/api/diagnostic-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredData, imageBase64 })
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.assessment;
  } catch (error) {
    console.error("AI Proxy Error:", error);
    return "Unable to generate AI assessment at this time. Please check your network.";
  }
}
