import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI maintenance dispatcher for an enterprise maintenance system called GearGuard.

Your role is to ASSIST users by recommending the most suitable maintenance team and technician
based on the maintenance request details, team expertise, and technician workload.

You must clearly explain your reasoning and never auto-assign tasks.

━━━━━━━━━━━━━━━━━━━━━━
MAINTENANCE TEAMS & SKILLS
━━━━━━━━━━━━━━━━━━━━━━

- Mechanics:
  Mechanical parts, motors, belts, bearings, lubrication, vibration, alignment issues.

- Electricians:
  Electrical wiring, power supply, control panels, short circuits, sparks, sensors, voltage issues.

- IT Support:
  Software issues, computers, printers, networks, servers, operating systems.

- HVAC Specialists:
  Heating, ventilation, air conditioning, cooling systems, temperature control, refrigeration.

- Housekeeping & Sanitation:
  Cleaning equipment, waste management systems, hygiene maintenance, sanitation devices.

- Security Systems:
  CCTV, access control, alarm systems, surveillance equipment, security sensors.

━━━━━━━━━━━━━━━━━━━━━━
RULES
━━━━━━━━━━━━━━━━━━━━━━

- This is a recommendation only.
- Do NOT automatically apply assignments.
- Always prefer workload balance when skills are equal.
- Keep explanations short, clear, and professional.
- Be conservative and realistic in suggestions.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      equipment_name, 
      equipment_category, 
      subject, 
      description, 
      assigned_team,
      technicians_with_workload 
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const technicianData = technicians_with_workload 
      ? JSON.stringify(technicians_with_workload, null, 2)
      : 'No technician data available';

    const userPrompt = `━━━━━━━━━━━━━━━━━━━━━━
MAINTENANCE REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━━━

- Equipment Name: ${equipment_name}
- Equipment Category: ${equipment_category}
- Request Subject: ${subject}
- Request Description: ${description}
- Currently Assigned Team (auto-filled): ${assigned_team}

━━━━━━━━━━━━━━━━━━━━━━
TECHNICIAN WORKLOAD DATA
━━━━━━━━━━━━━━━━━━━━━━

Each technician has a number of currently active (open) maintenance tasks.
Lower workload is preferred to ensure balanced work distribution.

Available Technicians (JSON):
${technicianData}

━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━

1. Analyze the request subject and description carefully.
2. Validate whether the currently assigned team is appropriate based on skill matching.
3. If the team is not appropriate, suggest the most suitable team.
4. From the selected team, recommend the technician with the LOWEST active task count.
5. Explain your reasoning using:
   - Skill match from the issue description
   - Technician workload balance
6. Assign a confidence level: High, Medium, or Low.

━━━━━━━━━━━━━━━━━━━━━━
RESPONSE FORMAT (STRICT JSON ONLY)
━━━━━━━━━━━━━━━━━━━━━━

{
  "is_correct_team": true or false,
  "recommended_team": "Team Name",
  "recommended_technician": "Technician Name or null if no data",
  "confidence": "High | Medium | Low",
  "reason": "Short explanation in one sentence",
  "workload_snapshot": ["Technician Name – X active tasks", "..."]
}`;

    console.log('Analyzing maintenance request:', { equipment_name, subject, assigned_team });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI response:', content);

    // Parse the JSON from the response
    let result;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      result = {
        is_correct_team: true,
        recommended_team: assigned_team,
        recommended_technician: null,
        confidence: 'Low',
        reason: 'Unable to analyze the request. Manual review recommended.',
        workload_snapshot: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-request function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
