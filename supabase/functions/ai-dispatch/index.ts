import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TechnicianWorkload {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  activeTasks: number;
}

interface DispatchRequest {
  equipmentName: string;
  equipmentCategory: string;
  subject: string;
  description: string;
  assignedTeam: string;
  assignedTechnician: string;
  techniciansWorkload: TechnicianWorkload[];
  teams: { id: string; name: string; description: string }[];
}

const systemPrompt = `You are an AI Maintenance Dispatcher for an enterprise maintenance platform called GearGuard.

Your role is to ASSIST humans by recommending the most suitable maintenance team and technician based on maintenance request details, team expertise, technician workload, and current assignment state.

⚠️ You must NOT auto-assign tasks. All recommendations are advisory only and require explicit user confirmation.

SYSTEM BEHAVIOR (IMPORTANT):
- You are state-aware
- You must consider current assignment + reassignment history
- Once the user confirms a reassignment, treat the new team & technician as the current state
- Reflect the change in all future recommendations
- Never suggest reverting unless clearly justified

MAINTENANCE TEAMS & SKILLS:
- Mechanics: Mechanical parts, motors, belts, bearings, lubrication, vibration, alignment issues
- Electricians: Electrical wiring, power supply, control panels, short circuits, sparks, sensors, voltage issues
- IT Support: Software issues, computers, printers, networks, servers, operating systems
- HVAC Specialists: Heating, ventilation, air conditioning, temperature control, refrigerant, compressors
- Housekeeping & Sanitation: Cleaning equipment, waste management, sanitation systems
- Security Systems: CCTV, access control, alarm systems, surveillance, security hardware

INSTRUCTIONS:
1. Analyze the request subject and description carefully
2. Check if the currently assigned team matches the issue
3. If appropriate, confirm the current assignment
4. If not appropriate, recommend a more suitable team
5. From the selected team, recommend the technician with the LOWEST active task count
6. Always explain reasoning using skill relevance and workload balance
7. Assign a confidence level: High, Medium, or Low

RESPONSE FORMAT (STRICT JSON ONLY):
{
  "is_correct_team": boolean,
  "recommended_team": "Team Name",
  "recommended_team_id": "team-id",
  "recommended_technician": "Technician Name",
  "recommended_technician_id": "tech-id",
  "confidence": "High" | "Medium" | "Low",
  "popup_output": {
    "title": "AI Assignment Recommendation",
    "summary": {
      "current_team": "Team Name",
      "current_technician": "Technician Name",
      "recommended_team": "Team Name",
      "recommended_technician": "Technician Name",
      "confidence": "High" | "Medium" | "Low"
    },
    "explanation": [
      "Short reason explaining skill alignment with the issue.",
      "Short reason explaining technician selection based on workload."
    ],
    "workload_snapshot": [
      "Technician A – X active tasks",
      "Technician B – Y active tasks"
    ],
    "actions": {
      "primary": "Reassign & Apply",
      "secondary": "Choose Manually",
      "note": "AI suggestions are advisory. Reassignment occurs only after user confirmation."
    }
  }
}

RULES:
- Recommendations only — no auto-assignment
- Prefer workload balance when skills are equal
- Keep explanations concise and professional
- Be conservative and realistic
- Never contradict confirmed user actions`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: DispatchRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const techniciansJson = JSON.stringify(requestData.techniciansWorkload, null, 2);
    const teamsJson = JSON.stringify(requestData.teams, null, 2);

    const userMessage = `MAINTENANCE REQUEST DETAILS:
Equipment Name: ${requestData.equipmentName}
Equipment Category: ${requestData.equipmentCategory}
Request Subject: ${requestData.subject}
Request Description: ${requestData.description}
Currently Assigned Team: ${requestData.assignedTeam || "Not assigned"}
Currently Assigned Technician: ${requestData.assignedTechnician || "Not assigned"}

AVAILABLE TEAMS:
${teamsJson}

TECHNICIAN WORKLOAD DATA (with active task counts):
${techniciansJson}

Please analyze this request and provide your recommendation in the specified JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response, handling markdown code blocks
    let recommendation;
    try {
      // Try to extract JSON from markdown code block if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
      recommendation = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      throw new Error("Invalid JSON in AI response");
    }

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI dispatch error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
