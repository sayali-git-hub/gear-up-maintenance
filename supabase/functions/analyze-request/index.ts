import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI maintenance dispatcher for an enterprise maintenance system called GearGuard.

Your task is to analyze a maintenance request and determine whether it is assigned to the correct maintenance team.

Maintenance Teams and their skill descriptions:

Mechanics: Mechanical parts, motors, belts, bearings, lubrication, vibration, alignment issues.

Electricians: Electrical wiring, power supply, control panels, short circuits, sparks, sensors, voltage issues.

IT Support: Software issues, computers, printers, networks, servers, operating systems.

HVAC Specialists: Heating, ventilation, air conditioning, cooling systems, temperature control, refrigeration.

Instructions:

Analyze the request subject and description carefully.

Determine whether the currently assigned team is appropriate.

If the team is appropriate, confirm it.

If not, suggest the most suitable team.

Provide a short, clear reason for your decision.

Assign a confidence level: High, Medium, or Low.

Rules:

Do NOT override automatically.

This is a recommendation only.

Be conservative in suggestions.

Keep explanations short and professional.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { equipment_name, equipment_category, subject, description, assigned_team } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const userPrompt = `Maintenance Request Details:

Equipment Name: ${equipment_name}

Equipment Category: ${equipment_category}

Request Subject: ${subject}

Request Description: ${description}

Currently Assigned Team: ${assigned_team}

Response Format (STRICT JSON ONLY):

{
  "is_correct_team": true or false,
  "recommended_team": "Team Name",
  "confidence": "High | Medium | Low",
  "reason": "Short explanation in one sentence"
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
        max_tokens: 500,
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
        confidence: 'Low',
        reason: 'Unable to analyze the request. Manual review recommended.'
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
