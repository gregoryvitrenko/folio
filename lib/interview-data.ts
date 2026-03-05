/**
 * Static interview question bank for TC / vac scheme preparation.
 * 4 categories — ~40 questions total — each with rich guidance.
 * No AI generation at runtime. Content is curated for accuracy and quality.
 */

export type InterviewCategorySlug =
  | 'strengths'
  | 'behavioural'
  | 'motivation'
  | 'commercial';

export type Frequency = 'Very Common' | 'Common' | 'Occasional';
export type FirmTier = 'All' | 'Magic Circle' | 'Silver Circle' | 'US Firms';

export interface InterviewCategory {
  slug: InterviewCategorySlug;
  name: string;
  shortName: string;
  description: string;
  strapline: string;
  /** Tailwind colour token for accent — matches project palette conventions */
  color: string;
  usedBy: string;
  tips: string[];
}

export interface InterviewQuestion {
  id: string;
  category: InterviewCategorySlug;
  question: string;
  /** Optional extra context shown beneath the question */
  context?: string;
  frequency: Frequency;
  firmTiers: FirmTier[];
  /** STAR, Point-Evidence-Why, Free-form, etc. */
  framework: string;
  frameworkExplained: string;
  /** What the interviewer is actually assessing */
  keyPoints: string[];
  tips: string[];
  /** How to structure the answer — 3-5 sentences */
  exampleStructure: string;
  commonMistakes: string[];
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const INTERVIEW_CATEGORIES: InterviewCategory[] = [
  {
    slug: 'strengths',
    name: 'Strengths-Based Questions',
    shortName: 'Strengths',
    description:
      'Strengths-based interviews ask what you do well and what energises you — not just what you have done. Firms like Clifford Chance, Travers Smith and Macfarlanes use this format to find candidates with genuine aptitude and intrinsic motivation for the work.',
    strapline: 'What comes naturally to you — and why it matters for law.',
    color: 'emerald',
    usedBy: 'Clifford Chance, Travers Smith, Macfarlanes, Slaughter and May',
    tips: [
      'Be specific — name a strength, then ground it in a concrete example immediately.',
      'Connect every strength to something relevant to commercial law or the trainee role.',
      'Authenticity beats polish. Interviewers can tell when you have rehearsed a "correct" answer.',
      'Strengths ≠ achievements. "I am analytically rigorous" is a strength; "I got a First" is an achievement.',
      'Prepare 4–5 strengths with specific evidence. You will not use all of them but having options lets you adapt.',
    ],
  },
  {
    slug: 'behavioural',
    name: 'Behavioural & Competency',
    shortName: 'Behavioural',
    description:
      'Behavioural questions ask you to describe specific past situations that demonstrate a competency — leadership, resilience, teamwork, persuasion. Most Magic Circle and Silver Circle firms use these, often structured around the STAR method.',
    strapline: 'Prove it with a story. Every answer needs a Situation, Task, Action, Result.',
    color: 'blue',
    usedBy: 'Freshfields, Linklaters, A&O Shearman, Ashurst, Herbert Smith Freehills, most firms',
    tips: [
      'Have 6–8 strong examples ready. The best examples answer multiple question types (leadership example can also show persuasion or resilience).',
      'Action is the most important part of STAR — interviewers want to hear what YOU did, not what the team did.',
      'Results should be specific where possible: "the project was delivered on time" is weaker than "we reduced delays by 30%".',
      'Do not pick examples that make you look passive. Even a teamwork example should show your individual contribution.',
      'For "tell me about a mistake" — pick a real mistake. Fake mistakes ("I work too hard") are transparent and waste the question.',
    ],
  },
  {
    slug: 'motivation',
    name: 'Motivation & "Why Law?"',
    shortName: 'Motivation',
    description:
      'Motivation questions probe whether you have genuinely thought through your decision to pursue commercial law and this specific firm. They are designed to filter out candidates applying out of default prestige-seeking rather than informed choice.',
    strapline: 'Know why you want this — and show you have actually thought it through.',
    color: 'violet',
    usedBy: 'All firms — these appear in every TC and vac scheme application',
    tips: [
      'Research the firm beyond its website homepage. Read recent deal announcements, partner commentary, and graduate recruitment blogs.',
      '"Why this firm" should contain at least one thing that is specific to THIS firm and cannot be said about every other Magic Circle firm.',
      'For "Why law?" — trace it to a moment of genuine realisation, not a list of traits ("I like problem-solving and communication").',
      'Know what trainees actually do day-to-day. Firms penalise candidates with unrealistic expectations of the role.',
      'First-year applicants: lean into your early commitment. It shows genuine passion rather than last-minute TC hunting.',
    ],
  },
  {
    slug: 'commercial',
    name: 'Commercial Awareness',
    shortName: 'Commercial',
    description:
      'Commercial awareness questions test whether you understand the business world your future clients operate in. You need to be able to discuss current deals, economic trends, and the implications for law firms and their clients — not just name-drop headlines.',
    strapline: 'Have a view. Know the legal angle. Show you read beyond the headline.',
    color: 'amber',
    usedBy: 'All firms — especially at vacation scheme stage and final-round TC interviews',
    tips: [
      'Prepare 2–3 live stories in depth. One M&A or Finance deal, one regulatory or tech story, one broader economic trend.',
      'For each story: know the parties, the legal issues, why it matters to the firm you are speaking to, and your own view.',
      'Firms do not want a BBC news summary. They want to see that you can think about second-order effects: what does this mean for clients? For the firm? For the sector?',
      'Connect stories to practice areas when possible — this shows you understand what lawyers actually do.',
      '"How do you stay commercially aware?" requires a genuine, habitual answer — not "I read the FT the week before applications open".',
    ],
  },
];

const CATEGORY_MAP = new Map(INTERVIEW_CATEGORIES.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): InterviewCategory | undefined {
  return CATEGORY_MAP.get(slug as InterviewCategorySlug);
}

// ─── Questions ────────────────────────────────────────────────────────────────

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [

  // ── STRENGTHS ──────────────────────────────────────────────────────────────

  {
    id: 'str-1',
    category: 'strengths',
    question: 'What are your top three strengths?',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'Name → Evidence → Relevance to law',
    frameworkExplained:
      'State the strength clearly, give a brief specific example that demonstrates it, then connect it to why it matters in a commercial law context. Do this for each of the three.',
    keyPoints: [
      'Self-awareness — can you accurately identify what you are genuinely good at?',
      'Relevance — are your strengths appropriate for the solicitor role?',
      'Evidence — can you back up each claim with a real example?',
    ],
    tips: [
      'Choose strengths that map to lawyering: analytical rigour, attention to detail, written communication, resilience under pressure, listening carefully.',
      'Avoid soft generic answers ("I am a hard worker", "I am a team player") without specific evidence.',
      'Three strengths is the right number — do not give two or four unless asked.',
      'The order matters: lead with your strongest, most differentiated strength first.',
    ],
    exampleStructure:
      'My three strengths are [X], [Y], and [Z]. For [X] — [specific 2-sentence example]. I think this matters for commercial law because [1 sentence connecting to the role]. [Repeat for Y and Z, more briefly].',
    commonMistakes: [
      'Picking vague strengths that could apply to anyone ("passionate", "dedicated").',
      'Failing to give evidence — just asserting you have a strength.',
      'Choosing strengths entirely unrelated to commercial law.',
      'Underconfidence: hedging ("I think I might be quite...") undermines the answer.',
    ],
  },

  {
    id: 'str-2',
    category: 'strengths',
    question: 'What energises you most at university or work?',
    frequency: 'Common',
    firmTiers: ['Magic Circle', 'Silver Circle'],
    framework: 'Specific activity → Why it energises → Connection to law',
    frameworkExplained:
      'Name a concrete activity or type of task rather than a vague feeling. Explain the mechanism of why it is energising — is it the intellectual challenge, the collaboration, the sense of craft? Then link it to what you expect to find energising as a trainee.',
    keyPoints: [
      'Intrinsic vs extrinsic motivation — firms want to know you are driven by genuine interest in the work, not just the salary or status.',
      'Self-awareness — do you actually know yourself?',
      'Fit — does what energises you match what trainees spend their time doing?',
    ],
    tips: [
      'Be specific: "unpicking a complex argument" is better than "problem-solving".',
      'Do not say "I am energised by high-pressure deadlines" as your only answer — it sounds like a cliché.',
      'Honest answers (even slightly unexpected ones) land better than rehearsed ones.',
      'You are allowed to mention more than one thing — but keep it focused.',
    ],
    exampleStructure:
      'I find I am most energised when I am working through something with genuine complexity — [specific example: a piece of research, a moot problem, a project]. What I enjoy is [the specific element: the moment when the pieces connect / explaining something complicated simply / finding the angle others missed]. I expect that quality to carry into [relevant trainee work: due diligence with real stakes / drafting where every word matters].',
    commonMistakes: [
      'Giving a generic answer that could describe anyone: "I love working with people".',
      'Not connecting the answer to legal or commercial work.',
      'Being dishonest — interviewers probe and you will get found out.',
    ],
  },

  {
    id: 'str-3',
    category: 'strengths',
    question: 'What would your close friends or colleagues say about you?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Choose 2–3 traits → Specific evidence they would cite → Your own view on whether they are right',
    frameworkExplained:
      'This question tests self-awareness and consistency between your self-image and how others perceive you. Choose traits that are genuinely consistent and that you can back up with real examples friends or colleagues would actually know.',
    keyPoints: [
      'Self-awareness — do you have an accurate picture of how you come across?',
      'Consistency — does your answer match how you present throughout the interview?',
      'Character fit — are the traits appropriate for a collaborative, client-facing environment?',
    ],
    tips: [
      'Pick traits your friends would actually say — not traits you wish they would say.',
      'This is a chance to reveal character beyond your CV: loyalty, dry humour, being the person who spots what others missed.',
      'Including one trait that is slightly unexpected (but positive) makes the answer memorable.',
      'Acknowledge the trait yourself at the end — "and I think that is fair, because...".',
    ],
    exampleStructure:
      'I think they would say I am [trait 1] — [specific thing they would cite as evidence]. They would probably also say I am [trait 2], which comes up [context]. One thing they often say that surprised me at first is [trait 3] — I have come to think it is accurate because [your own reflection].',
    commonMistakes: [
      'Turning this into a list of pure positives — a small acknowledgement of a real trait (not a fake flaw) adds authenticity.',
      'Saying things your friends would clearly never say ("my friends say I have exceptional legal instincts").',
      'Being too vague: "they would say I am a good friend" tells the interviewer nothing.',
    ],
  },

  {
    id: 'str-4',
    category: 'strengths',
    question: 'Tell me about an achievement you are genuinely proud of.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'What → Why it was hard → What you did → Why it matters to you',
    frameworkExplained:
      'This is not a STAR question — it is asking about meaning, not just events. The best answers pick something that reveals character and values, not just the most impressive credential on your CV.',
    keyPoints: [
      'What you value — your choice of achievement is revealing.',
      'Resilience and effort — did you overcome something?',
      'Genuine reflection — can you articulate why this matters to you personally?',
    ],
    tips: [
      'Do not default to "getting a First" or "captaining the sports team" unless you can make it genuinely personal.',
      'Non-academic achievements (helping someone, learning something difficult outside of school) can be more memorable.',
      'The word "genuinely" in the question is a signal — pick something you actually care about.',
      'You should feel something when you talk about it. If you do not, change your example.',
    ],
    exampleStructure:
      'I am most proud of [achievement], which happened during [context]. What made it genuinely challenging was [specific difficulty]. I [what you actually did]. What I am proud of is not just the outcome but [the specific thing: how I handled the pressure / what it taught me / the impact it had on someone else]. It matters to me because [genuine personal reason].',
    commonMistakes: [
      'Picking the most impressive-sounding achievement rather than one with a genuine story.',
      'Being too modest — if you are proud of it, own it.',
      'Skipping the "why it matters" — that is the actual answer to the question.',
    ],
  },

  {
    id: 'str-5',
    category: 'strengths',
    question: 'What do you find comes naturally to you that others seem to find difficult?',
    frequency: 'Common',
    firmTiers: ['Magic Circle', 'Silver Circle'],
    framework: 'Name the skill → Observation that led you to notice → Evidence → Relevance',
    frameworkExplained:
      'The question is really asking about relative strengths — what are you naturally better at than the people around you? This requires genuine self-awareness and the confidence to name something without false modesty.',
    keyPoints: [
      'Differentiated self-awareness — not just "I am good at X" but "I am notably better at X than most".',
      'Confidence and candour — can you own a strength without arrogance?',
      'Relevance to commercial law — is the skill transferable to the role?',
    ],
    tips: [
      'Good answers here are often about process or approach: "staying calm when everyone else is panicking", "seeing the structure in a messy situation", "explaining things simply".',
      'You do not need to claim you are the best in the world — "most people around me" is the frame.',
      'How you noticed it matters: a friend pointing it out, a moment it became visible in a group setting.',
    ],
    exampleStructure:
      'I think [skill] comes relatively naturally to me. I noticed this [specific situation where it became apparent — group project, society work, job]. While others [what they found difficult], I [what you found instinctive]. I have had it confirmed by [feedback from others or repeated experience]. I think it is relevant to the role because [connection to trainee or lawyer work].',
    commonMistakes: [
      'Answering too vaguely: "I am good at communication" without specifics.',
      'False modesty — trailing off or hedging too much loses the point of the question.',
      'Picking something irrelevant to law (e.g., "I am naturally good at sport").',
    ],
  },

  {
    id: 'str-6',
    category: 'strengths',
    question: 'What motivates you to do your best work?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Identify the driver → Ground it in a specific example → Connect to the role',
    frameworkExplained:
      'Firms want to understand whether your motivation is intrinsic (quality of work, intellectual challenge, impact) or primarily extrinsic (money, prestige, external approval). Intrinsic motivation is more valued because it predicts sustained high performance.',
    keyPoints: [
      'Intrinsic vs extrinsic motivation.',
      'Whether your motivators are compatible with the realities of trainee life.',
      'Authenticity and self-insight.',
    ],
    tips: [
      'It is fine to acknowledge extrinsic factors (compensation, career progression) but they should not be your lead — pair them with intrinsic ones.',
      '"Getting it right" and "producing work I am genuinely proud of" are strong intrinsic motivators that translate well to law.',
      'The client impact angle is powerful: "knowing that the quality of my work directly affects the outcome for someone" resonates with good interviewers.',
    ],
    exampleStructure:
      'What primarily motivates me is [core driver — e.g., the standard of the work itself / making a real difference to an outcome]. I noticed this in [specific situation] where [what happened and how your motivation showed up]. I find I consistently do my best work when [condition]. I think that maps well onto the role because [connection to what trainees do].',
    commonMistakes: [
      '"I am motivated by success" — too vague and sounds mercenary.',
      'Only naming extrinsic motivators (salary, title, prestige).',
      'Giving an answer so idealistic it does not match the actual work (e.g., "I want to change the world").',
    ],
  },

  {
    id: 'str-7',
    category: 'strengths',
    question: 'Describe a skill you have worked hard to develop.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Skill → Why you needed it → What you did to develop it → Where you are now',
    frameworkExplained:
      'This question tests growth mindset and effort. The best answers pick a skill that was genuinely weak, show deliberate practice, and end with a measurable or observable improvement.',
    keyPoints: [
      'Growth mindset — do you invest in developing yourself?',
      'Self-awareness — can you honestly identify a weakness?',
      'Persistence and method — what did you actually do to improve?',
    ],
    tips: [
      'Pick a skill that is relevant to legal or professional work — public speaking, written communication, analytical reading, managing nerves, listening actively.',
      'The effort part matters most: what specifically did you do? Joining a mooting society, practising with a friend, taking an online course.',
      'Avoid skills that sound like backdoor brags ("I worked hard to be even more organised than I already was").',
    ],
    exampleStructure:
      'I have put real effort into developing [skill], which did not come naturally to me. [Why you needed it — a situation where the gap was clear]. What I did was [specific, concrete actions]. It took [time frame] and [specific effort]. I can see the improvement now because [measurable or observable change]. I still work on it because [ongoing commitment].',
    commonMistakes: [
      'Picking a skill that was never actually weak — interviewers see through this.',
      'Vague effort: "I worked on it" without saying how.',
      'Choosing something irrelevant to the solicitor role.',
    ],
  },

  {
    id: 'str-8',
    category: 'strengths',
    question: 'What has been your biggest learning experience?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Experience → What happened → What you extracted → How it changed you',
    frameworkExplained:
      'This question is about reflection, not just recounting an event. The best answers show that you actively process your experiences and extract specific, lasting lessons — not that you have had impressive experiences.',
    keyPoints: [
      'Reflective capacity — do you learn from what happens to you?',
      'Honesty — are you willing to discuss something that went wrong or was hard?',
      'Growth — how did it actually change your behaviour or approach?',
    ],
    tips: [
      'This does not have to be a failure — a positive experience that taught you something unexpected is equally valid.',
      'The learning must be specific: "I learned to ask for help sooner" is more credible than "I learned that teamwork matters".',
      'Connect the lesson to how you operate now — show it actually changed you.',
    ],
    exampleStructure:
      'My biggest learning experience was [situation or event, briefly described]. What happened was [what went wrong or what challenged you]. At the time I [your response]. Looking back, what I realised was [specific insight]. That changed my approach — since then I have [concrete evidence of the change]. It is still something I think about because [why it stayed with you].',
    commonMistakes: [
      'Picking an experience that sounds impressive but where the learning is generic.',
      'Spending all the time on the experience and barely touching the learning.',
      'Learning that sounds too neat — real learning is usually messier.',
    ],
  },

  // ── BEHAVIOURAL ────────────────────────────────────────────────────────────

  {
    id: 'beh-1',
    category: 'behavioural',
    question: 'Tell me about a time you demonstrated leadership.',
    context: 'This does not need to be a formal leadership title. Taking initiative, influencing a group direction, or stepping up when no one else did all count.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'STAR — Situation · Task · Action · Result',
    frameworkExplained:
      'Set the scene concisely (S), clarify what needed to happen and why it fell to you (T), describe in detail what YOU specifically did to lead — not the group (A), then give the outcome including what you learned (R).',
    keyPoints: [
      'Your individual contribution — not what the group achieved collectively.',
      'How you influenced or directed others — persuasion, rallying, structuring.',
      'Impact — what was different because of your leadership?',
    ],
    tips: [
      'Leadership in academic, sporting, volunteering or work contexts all count equally — choose the one with the best story.',
      'Avoid being vague about what you actually did: "I took charge" is not enough — what specifically did you do?',
      'If the outcome was imperfect, include what you learned — it adds credibility.',
      'A leadership example that also shows commercial context (running a society that generated sponsorship, managing a student business) is especially strong.',
    ],
    exampleStructure:
      'During [context], [brief situation]. As [role or reason it fell to you], I needed to [task]. What I did was [specific actions — motivate, reorganise, decide, communicate]. I [what you personally did]. The result was [concrete outcome]. From this I learned [genuine takeaway].',
    commonMistakes: [
      'Using "we" throughout the Action section — this is your answer, not the team\'s.',
      'Picking a leadership example where you were just a member who did their job.',
      'No measurable result or clear impact.',
      'Ignoring any challenges you faced in leading — a smooth story is less convincing.',
    ],
  },

  {
    id: 'beh-2',
    category: 'behavioural',
    question: 'Give an example of when you had to work under significant pressure and how you managed it.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'STAR — focus especially on the Action: what was your specific strategy for managing the pressure?',
    frameworkExplained:
      'Firms test resilience because trainee life involves high-stakes deadlines, multiple competing demands, and working with little sleep. They want to know you have a real strategy — not just that you "worked harder".',
    keyPoints: [
      'Resilience — do you stay functional under pressure?',
      'Strategy — do you have a real approach or just brute-force effort?',
      'Self-regulation — do you stay professional and not transmit stress to others?',
    ],
    tips: [
      'The specific strategy is what makes this answer: prioritising ruthlessly, breaking work into stages, communicating proactively with those depending on you, asking for help at the right moment.',
      '"I just worked through the night" is not a strategy — it shows effort but not judgment.',
      'A situation with genuine external stakes (exam failure, real client impact, public consequence) is more compelling than a self-imposed deadline.',
      'The outcome does not have to be perfect — showing you delivered something good under difficult conditions is enough.',
    ],
    exampleStructure:
      'During [situation — briefly: what was the context and what made the pressure significant]. I had to [specific task with real deadline or stakes]. What I did was [concrete strategy — how you broke down the problem, prioritised, communicated, managed your own state]. Despite [the pressure], I [what you delivered]. Afterwards, I [reflection on what worked and what you would do differently].',
    commonMistakes: [
      'Choosing a situation where the pressure was entirely self-created and low-stakes.',
      '"I am good under pressure" as the action — that is a claim, not an explanation.',
      'Not mentioning the result clearly.',
    ],
  },

  {
    id: 'beh-3',
    category: 'behavioural',
    question: 'Describe a situation where you had to persuade someone who initially disagreed with you.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'STAR — emphasise how you understood their position before attempting to persuade',
    frameworkExplained:
      'Commercial lawyers persuade for a living — clients, counterparties, courts, colleagues. This question tests whether you approach disagreement by understanding the other side first or by doubling down on your own position.',
    keyPoints: [
      'Did you genuinely try to understand their objection before responding?',
      'Was your persuasion reasoned and evidence-based, or just repetition with more force?',
      'Did you adapt your approach based on what you learned about their position?',
    ],
    tips: [
      'The best persuasion answers involve an initial position → seeking to understand their view → adapting your argument → outcome.',
      'It is fine if you ended up partially agreeing with them — that shows intellectual honesty.',
      'Avoid examples where you "just kept explaining until they agreed" — that is not persuasion, it is attrition.',
      'Group contexts (team decision, student project) or professional contexts (internship, part-time work) both work well.',
    ],
    exampleStructure:
      'In [context], I needed to persuade [who] to [what]. They initially disagreed because [their genuine reason]. Rather than simply restating my position, I [what you did to understand their view]. I then [adapted approach: reframed, brought in new evidence, acknowledged their concern and addressed it]. The outcome was [result — ideally consensus or a reasoned compromise]. What this taught me was [specific insight about persuasion].',
    commonMistakes: [
      'Skipping the "understanding their view" step entirely.',
      'An example where you simply repeated yourself louder.',
      'Not including a real result — did they change their mind? Did you reach compromise?',
    ],
  },

  {
    id: 'beh-4',
    category: 'behavioural',
    question: 'Tell me about a time you made a significant mistake and how you handled it.',
    context: 'One of the most revealing questions firms ask. They want to see honesty, accountability and genuine learning — not a fake mistake or deflection.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'STAR — do not linger on the situation; Action and learning are what matter most',
    frameworkExplained:
      'The mistake must be real and must actually have been your fault. Explain what went wrong, own it entirely, describe what you did to rectify it, and extract a genuine lesson that you can show you have applied since.',
    keyPoints: [
      'Accountability — do you own your mistakes or minimise/deflect?',
      'Judgment — does the recovery show good professional instincts?',
      'Growth — is the learning genuine and lasting?',
    ],
    tips: [
      'Do not pick a mistake that was actually not your fault. The whole point is accountability.',
      'Fake mistakes ("I care too much", "I am a perfectionist") are transparent and waste the question.',
      'The recovery and learning should take as long as the mistake itself in your answer.',
      'Showing how you have behaved differently since is the most powerful close.',
      'You do not need to have been fired or to have failed dramatically — a meaningful mistake in a university or work context is enough.',
    ],
    exampleStructure:
      'During [context], I made a mistake in [specific what and how it was your fault]. The impact was [what went wrong as a result]. I handled it by [what you did immediately — proactively flagging it, fixing it, communicating with those affected]. Longer term, I [what you changed about your approach]. I have not made that particular error since, and I think the reason is [specific behaviour change].',
    commonMistakes: [
      'A "humble brag" mistake that is not actually a mistake.',
      'Spending 80% of the answer on the situation and 20% on the learning.',
      'Blaming external factors ("my teammate let me down") instead of owning your part.',
    ],
  },

  {
    id: 'beh-5',
    category: 'behavioural',
    question: 'Give an example of when you managed competing priorities and a tight deadline.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'STAR — emphasise your prioritisation method and communication',
    frameworkExplained:
      'Trainee life involves multiple matters, multiple supervisors, and multiple deadlines simultaneously. This question tests whether you have a real system for prioritising rather than just doing things in the order they arrive.',
    keyPoints: [
      'How you decide what to prioritise — impact, urgency, consequence of delay.',
      'Whether you communicate proactively when you cannot hit a deadline.',
      'Outcome — did things actually get done to the right standard?',
    ],
    tips: [
      'The prioritisation method is the core of the answer: did you assess urgency vs importance? Did you check with supervisors on relative priority?',
      'Proactive communication ("I flagged to my supervisor that X was the bigger priority so Y would slip by one hour") shows professional judgment.',
      'A situation with genuinely competing external demands (not self-imposed) is more compelling.',
    ],
    exampleStructure:
      'In [context], I had [describe the competing demands concisely]. I needed to decide [specific decision about prioritisation]. My approach was [how you decided what to prioritise and why]. I [what you did, including any communication with stakeholders]. I managed to [outcome for each priority]. One thing I do differently now is [any refinement to your approach since].',
    commonMistakes: [
      'No real method — just "I worked harder to fit it all in".',
      'Not mentioning communication with others — in law, always flagging risk proactively is crucial.',
      'A situation with no genuine stakes if priorities were wrong.',
    ],
  },

  {
    id: 'beh-6',
    category: 'behavioural',
    question: 'Describe a time you had to adapt to a significant and unexpected change.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'STAR — focus on mindset shift and practical adaptation',
    frameworkExplained:
      'This question tests resilience and flexibility. The ideal answer shows a moment where the ground shifted, you processed it, and you adapted your approach effectively — not just that you survived the change.',
    keyPoints: [
      'Emotional regulation — did you panic or did you process and adapt?',
      'Practical flexibility — how did you change your approach?',
      'Outcome — did the adaptation work?',
    ],
    tips: [
      'Showing the internal moment of processing (acknowledging it was unwelcome but choosing to adapt) adds authenticity.',
      'A change that required you to do something you were not naturally good at is stronger than one that happened to play to your existing strengths.',
      'Work experience, travel, university coursework changes, or any life event with genuine disruption can work here.',
    ],
    exampleStructure:
      'During [context], [the change that happened — what it was and why it was significant]. My initial reaction was [honest — even if it was frustration or uncertainty]. What I did was [how you adapted practically]. The change required me to [specific new approach or skill]. The result was [outcome]. What I took from it is [specific learning about how you handle uncertainty].',
    commonMistakes: [
      'Glossing over any negative initial reaction — authenticity matters here.',
      'A change that was actually minor and easily absorbed.',
      'Not explaining HOW you adapted — just that you did.',
    ],
  },

  {
    id: 'beh-7',
    category: 'behavioural',
    question: 'Tell me about a time you showed initiative beyond what was required.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'STAR — the Action section should show your reasoning for going beyond the brief',
    frameworkExplained:
      'Firms want proactive trainees who do not wait to be told what to do. This question tests whether you identify problems or opportunities without being prompted and act on them without being asked.',
    keyPoints: [
      'Proactiveness — do you spot and act on things beyond your immediate brief?',
      'Judgment — did the initiative make sense? Was it appropriate to act unilaterally?',
      'Impact — did it make a real difference?',
    ],
    tips: [
      'The best answers show you recognised a gap or opportunity, considered whether it was appropriate to act, and then did so with a good outcome.',
      'Academic, work, and extra-curricular contexts all work — the initiative is the thing.',
      'Show your reasoning: "I noticed X, which was not my responsibility, but I thought it would cause Y if left, so I...".',
    ],
    exampleStructure:
      'In [context], I noticed [what you spotted — the gap, the opportunity, the risk]. It was not my responsibility to address it, but I thought [your reasoning for acting]. What I did was [specific action]. I checked with [supervisor / appropriate person] before/after because [professional judgment]. The result was [outcome]. This is something I now [how it shapes how you work generally].',
    commonMistakes: [
      'An example that was actually part of your job description — that is not initiative, it is expected.',
      'Acting unilaterally when you should have escalated — shows poor judgment not good initiative.',
      'No measurable outcome or impact.',
    ],
  },

  {
    id: 'beh-8',
    category: 'behavioural',
    question: 'Give an example of when you delivered difficult feedback or news to someone.',
    frequency: 'Occasional',
    firmTiers: ['Magic Circle', 'Silver Circle'],
    framework: 'STAR — emphasise your preparation and how you balanced honesty with empathy',
    frameworkExplained:
      'Commercial lawyers regularly deliver news clients do not want to hear — that a deal is at risk, that a legal position is weaker than hoped, that something went wrong. This question tests emotional intelligence and professional courage.',
    keyPoints: [
      'Did you prepare what you were going to say and how?',
      'Did you balance honesty with empathy — not brutal, not so soft you obscured the message?',
      'How did you handle their reaction?',
    ],
    tips: [
      'The preparation step is often underrated: thinking through the key message, anticipating their reaction, choosing the right setting.',
      'The message must come through clearly — being kind at the expense of clarity is a failure of professional responsibility.',
      'A work or leadership context (giving feedback to a society member, telling a client in an internship about a problem) is more credible than a purely personal situation.',
    ],
    exampleStructure:
      'In [context], I had to tell [who] that [what the difficult news was]. I prepared by [what you thought through before the conversation]. In the conversation, I [how you delivered it — clearly, directly, with appropriate empathy]. Their reaction was [honest account]. I [how you handled that]. The outcome was [longer-term result]. What I have taken from it is [specific insight about delivering difficult messages].',
    commonMistakes: [
      'An example where the feedback was not actually that difficult.',
      'Delivering the message but then abandoning the person emotionally.',
      'Burying the message so thoroughly in softening language that it did not land.',
    ],
  },

  {
    id: 'beh-9',
    category: 'behavioural',
    question: 'Tell me about a time you had to learn something new quickly and how you approached it.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'STAR — the Action should describe your learning method, not just the fact of learning',
    frameworkExplained:
      'Trainees rotate across four different practice areas in two years. This question tests whether you have a real strategy for rapid skill acquisition — not just that you are smart enough to eventually pick things up.',
    keyPoints: [
      'Learning strategy — do you have a method for getting up to speed quickly?',
      'Speed — how fast is "quickly" for you?',
      'Quality — did you learn it well enough to actually use it?',
    ],
    tips: [
      'The learning method is the heart of the answer: breaking the material into components, finding the right resource, finding someone to ask, testing your understanding.',
      'A technical skill (programming language, new software, unfamiliar legal area) is more compelling than a soft skill.',
      'Academic or work contexts both work — what matters is the speed and the approach.',
    ],
    exampleStructure:
      'In [context], I had [timeframe] to get up to speed on [what]. My approach was [specific learning method — what you did first, how you structured your learning, who or what you used as a resource]. I was able to [what you could do at the end]. The outcome was [how it was tested or applied]. My approach to rapid learning now is [generalised version of your method — showing it has become a habit].',
    commonMistakes: [
      'Answering with just "I worked hard and picked it up" — that is not a method.',
      'A learning example that took months — "quickly" implies real pace.',
      'Not connecting to the outcome — what did the learning enable?',
    ],
  },

  {
    id: 'beh-10',
    category: 'behavioural',
    question: 'Describe a situation where you had to work through a disagreement within a team.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'STAR — emphasise your specific role in resolving the disagreement, not just the team\'s process',
    frameworkExplained:
      'Firms test interpersonal effectiveness and professionalism. The best answers show that you can navigate conflict constructively — understanding both sides, finding common ground, and keeping the work on track — without being passive or dismissive.',
    keyPoints: [
      'Your specific intervention — what did YOU do?',
      'Did you understand the other person\'s position genuinely?',
      'Was the outcome constructive — did the team function better afterwards?',
    ],
    tips: [
      'A disagreement about the work itself (approach, strategy, priority) is more relevant than a personality clash.',
      'Show that you took the other person\'s view seriously before trying to resolve it.',
      'If the team ended up adopting the other person\'s position, that is fine — it shows intellectual honesty.',
    ],
    exampleStructure:
      'During [context], [brief description of the disagreement and who was involved]. My role was [how you were positioned]. I approached it by [what you actually did — listened, mediated, reframed]. I made sure to [what you did to genuinely understand the other side]. We resolved it by [outcome — consensus, compromise, or a clear decision]. The team [how the dynamic improved or the project moved forward]. What I learned from it is [specific takeaway about managing disagreement].',
    commonMistakes: [
      'Positioning yourself as entirely right and the other party as unreasonable.',
      'A team disagreement where you played no active role in resolving it.',
      'An outcome that involved ongoing tension — firms want to see genuine resolution.',
    ],
  },

  // ── MOTIVATION ─────────────────────────────────────────────────────────────

  {
    id: 'mot-1',
    category: 'motivation',
    question: 'Why do you want to be a solicitor rather than a barrister or an in-house counsel?',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'Positive case for solicitor → Acknowledge the other options honestly → Why this path for you',
    frameworkExplained:
      'This question tests whether you have made an informed, reasoned choice rather than just defaulting to the most visible legal career path. Know what distinguishes solicitors from barristers and in-house lawyers — and have a genuine reason for your preference.',
    keyPoints: [
      'Do you actually know the differences between these roles?',
      'Is your reasoning genuine and specific, or generic platitudes?',
      'Does your answer fit your apparent character and interests?',
    ],
    tips: [
      'Barrister: independent advocacy, court focus, self-employed, less ongoing client contact. In-house: one employer, strategic business integration, often more limited legal exposure. Solicitor: ongoing client relationships, deal or dispute from start to finish, working in a team, broad exposure across areas.',
      'The solicitor role at a City firm involves significant business advisory work — not just the law. This matters.',
      '"More stable" or "better pay" are not answers — they sound like you are settling for law firm life rather than choosing it.',
      'Good answers often involve something specific about what solicitors do that you want to do: being the person who sees a transaction through, the ongoing relationship with clients, the team environment.',
    ],
    exampleStructure:
      'What draws me to the solicitor role is [specific aspect — long-term client relationships, advising on deals from start to finish, being part of the team that structures a transaction]. I find [barrister path / in-house path] genuinely interesting, but [honest, specific reason why solicitor suits you better — e.g., I want the breadth of transactional and advisory work rather than specialising in pure advocacy at this stage]. What specifically attracted me to this route was [concrete experience or moment of clarity].',
    commonMistakes: [
      '"I want to be a solicitor because I am not good enough to be a barrister" — shows a complete misunderstanding of the differences.',
      '"It is more stable" or "better hours" — both are questionable claims and neither is a positive reason.',
      'Not knowing what in-house or barrister roles actually involve.',
    ],
  },

  {
    id: 'mot-2',
    category: 'motivation',
    question: 'Why commercial law specifically, rather than another type of legal practice?',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'What drew you to the intersection of law and business → Specific moment or experience → Why this over other areas',
    frameworkExplained:
      'This tests genuine interest in commercial work versus other legal areas (family law, criminal law, public law). The best answers show an intellectual interest in how businesses operate and how law shapes that, not just a preference for City salaries.',
    keyPoints: [
      'Do you genuinely find commercial issues interesting?',
      'Is there a specific area — M&A, capital markets, disputes — that particularly appeals?',
      'What do you understand about what commercial lawyers actually do for their clients?',
    ],
    tips: [
      'The best answers reference a real experience that crystallised your interest: a work experience placement, a deal you read about, a business your family runs, an economic event that sparked your curiosity.',
      'Show you understand that commercial lawyers are ultimately business advisers — the law is the mechanism but the client need is commercial.',
      'It is fine to say you are drawn to a particular area (TMT, finance, disputes) — specificity is credible.',
    ],
    exampleStructure:
      'My interest in commercial law grew out of [specific experience or moment — internship, reading a deal, family business, economics course]. What genuinely interests me is [the specific intellectual appeal — the way law shapes how deals are structured / how regulatory change ripples through an industry / what drives M&A strategy]. I find [specific area] particularly compelling because [genuine reason]. The alternative legal paths did not speak to me in the same way because [honest reason — you want to be close to business decisions, not litigation advocacy for its own sake, etc.].',
    commonMistakes: [
      'Claiming to love commercial law without any evidence that you have engaged with it seriously.',
      'Focusing entirely on the financial rewards.',
      'Not knowing what commercial lawyers actually do — confusing it with general legal advice.',
    ],
  },

  {
    id: 'mot-3',
    category: 'motivation',
    question: 'Why do you want to work at a City or US law firm rather than a regional or high-street firm?',
    frequency: 'Very Common',
    firmTiers: ['Magic Circle', 'Silver Circle', 'US Firms'],
    framework: 'Positive case for this type of firm → Acknowledge alternatives fairly → Your specific reasons',
    frameworkExplained:
      'Firms want to know you have made a considered choice to pursue elite international work, not just gone for the most prestigious names. The answer should reflect an understanding of what makes Magic Circle / US firm work different.',
    keyPoints: [
      'Do you know what distinguishes City / US firm work from regional practice?',
      'Is your reasoning about the WORK, not just the prestige or the salary?',
      'Does your answer reflect genuine research and engagement?',
    ],
    tips: [
      'City/US firm differences: cross-border transactions, systemic complexity, exposure to the biggest clients and deals, working within a global network. Regional firms: deeper community connection, breadth of work including more SME and private client, often faster to court or client contact.',
      'A UK regional firm answer is not that you could not get into a City firm — both are legitimate paths for different reasons.',
      'US firm specifics: typically lockstep pay (higher), smaller trainee intakes, focus on particular practice areas (finance, M&A, disputes). This is worth knowing if you are applying to US firms.',
    ],
    exampleStructure:
      'What specifically draws me to City / US firm practice is [the complexity and scale of the work — the deals, clients, and legal issues are qualitatively different]. My interest in [M&A / finance / disputes] naturally orients me towards [firms where that work is at the highest level]. Regional practice is a genuine alternative, but [honest reason why it is not your preference — wanting to work on cross-border matters / be involved in landmark transactions / develop expertise in specific areas at scale]. The environment at firms like [specific firm] — [one specific thing you know about their culture, deals, or approach] — is also something I find genuinely compelling.',
    commonMistakes: [
      'Only citing prestige and salary as reasons.',
      'Implying regional or high-street practice is inferior — it is just different.',
      'Not knowing what makes the specific type of firm you are targeting different.',
    ],
  },

  {
    id: 'mot-4',
    category: 'motivation',
    question: 'You are a first-year student. Why are you applying now rather than waiting until your final year?',
    context: 'This is increasingly common as more firms open first-year programmes. It is also asked at open days and insight scheme applications.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Demonstrate this is a reasoned decision, not a bet-hedging exercise → Show early genuine interest → Show what you want to get from the experience',
    frameworkExplained:
      'Firms that run first-year insight schemes or open days want to know you are not just applying because it is easy to — they want to see that you have already engaged with the profession seriously enough to know you are interested.',
    keyPoints: [
      'Is your interest genuine and informed, or are you just applying everywhere at once?',
      'What do you actually want to get from a first-year programme or early application?',
      'Do you understand what the programme involves?',
    ],
    tips: [
      'Early application demonstrates commitment and genuine interest — own that positively.',
      'Show you understand that first-year programmes are about exploration and testing your interest against reality — not just putting a firm on your CV.',
      'Reference what you already know and how you have engaged with commercial law — even if that is just reading, a first-year society involvement, or curiosity sparked by a module.',
      'It is fine to say "I wanted to explore whether my interest in commercial law matches the reality of the work" — that is mature and honest.',
    ],
    exampleStructure:
      'I am applying now because I have been seriously thinking about commercial law since [specific prompt — a module, reading, conversation]. I do not want to wait until final year to discover whether that interest is real. What I want from [programme name] is [specific — to see how a deal is actually structured / to understand how trainees work / to test whether I find the day-to-day as interesting as I imagine]. I think early engagement makes me a better applicant later too — [one concrete reason]. I am not applying to everything at once: I have targeted [firm name] because [specific genuine reason].',
    commonMistakes: [
      '"I want to get ahead of the competition" — this sounds strategic rather than genuinely interested.',
      'Vagueness about what you want from the programme.',
      'Not mentioning any existing engagement with commercial law.',
    ],
  },

  {
    id: 'mot-5',
    category: 'motivation',
    question: 'Why do you want to join this firm specifically?',
    context: 'Always prepare firm-specific content. Generic answers ("great culture, great clients, great training") are the single most common weakness in TC/vac scheme interviews.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'Research anchor → Specific deal or matter → Culture or structure → Training + development → How it fits you',
    frameworkExplained:
      'This is the most important motivation question and the one most candidates fail. You need at least one piece of information that is specific to THIS firm and cannot be said about every other Magic Circle or US firm.',
    keyPoints: [
      'Specificity — can you say something that only applies to this firm?',
      'Research depth — have you gone beyond the website?',
      'Fit — does your reason connect to your own background and interests?',
    ],
    tips: [
      'Read the firm\'s recent deals announcements, partner commentary, annual report, or graduate recruitment blogs.',
      'If you have been to an open day, talk event, or spoken to a trainee — use it.',
      'One highly specific reason is worth more than five generic ones.',
      'Connecting the firm\'s strengths to your own areas of interest (e.g., you are interested in energy law → firm has a leading energy practice) is compelling.',
      'Avoid: "great culture" / "collaborative environment" / "impressive client list" — every firm says this about itself.',
    ],
    exampleStructure:
      'What specifically draws me to [firm] is [one or two highly specific reasons — a recent deal that caught your attention and what it showed about the firm\'s work, a particular practice area they lead in, something specific about their training structure, something from a talk or event you attended]. I find [practice area / deal / cultural aspect] particularly compelling because [genuine reason connecting to your own interests]. I also [one more general but still specific thing — e.g., the seat structure gives genuine breadth in the first two years]. From what I have read and heard [reference to research], the environment at [firm] is [specific quality]. That matters to me because [brief personal reason].',
    commonMistakes: [
      '"Great training programme" — every firm has one, this says nothing.',
      '"Impressive client list" — this applies to every firm in your category.',
      'Mentioning the salary as a reason.',
      'Generic praise with no evidence of actual research.',
    ],
  },

  {
    id: 'mot-6',
    category: 'motivation',
    question: 'What do you understand about what a trainee solicitor actually does day to day?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Factual accuracy → Honest acknowledgement of less glamorous elements → Why it still appeals',
    frameworkExplained:
      'Firms ask this because many applicants have an unrealistic, TV-drama version of the trainee role. The best candidates show they know the reality — including the less exciting parts — and still want to do it.',
    keyPoints: [
      'Do you actually know what trainees do?',
      'Do you have realistic expectations?',
      'Do you find the reality appealing rather than off-putting?',
    ],
    tips: [
      'Trainees: sit with supervisors, assist on matters across four seats, do due diligence, draft ancillary documents, attend client calls and meetings, manage file admin, support associates. The responsibility increases as you demonstrate you can handle it.',
      '"Research" and "drafting" are the two most common trainee tasks — show you know this.',
      'Referencing a work experience or open day where you saw the reality is very effective.',
      'The unglamorous parts (completing standard form documents, quality-checking schedules at 11pm) show you have a realistic picture.',
    ],
    exampleStructure:
      'From [how you know — work experience, research, talking to trainees], I understand that most of a trainee\'s time is spent [specific realistic tasks — due diligence, drafting ancillary documents, assisting associates, attending client calls where you take notes initially]. The responsibility builds as you prove yourself. What I find appealing about that is [genuine reason — learning by immersion, being part of real deals even in a junior capacity]. I know there are less exciting elements — [specific example of unglamorous reality] — but I think they are worth it because [why the overall trajectory appeals].',
    commonMistakes: [
      'Describing a version of the trainee role that is essentially "partner work with less experience" — shows no real knowledge.',
      'Failing to acknowledge any routine or administrative elements of the role.',
      'Only talking about the interesting parts without showing you have thought about the full picture.',
    ],
  },

  {
    id: 'mot-7',
    category: 'motivation',
    question: 'Where do you see yourself in five to ten years?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Realistic ambition → Current focus → Longer trajectory → Openness',
    frameworkExplained:
      'This is a test of realistic ambition and commitment to the profession. The answer should show a credible trajectory — not unchecked ambition ("I will be a partner in five years") or a lack of it ("I have no idea").',
    keyPoints: [
      'Is your ambition realistic and evidence of genuine commitment?',
      'Do you know what the career progression looks like?',
      'Are you committed to this firm as a long-term place, or just using it as a stepping stone?',
    ],
    tips: [
      'Typical trajectory: trainee (2 years) → NQ associate → senior associate (4–7 years) → partnership track or senior counsel or in-house. Be broadly aware of this.',
      'At an interview, do not mention going in-house unless directly asked — it signals you see the firm as a stepping stone.',
      'Partnership is a credible long-term aim but requires showing you understand what it involves: business development, client relationships, team management.',
      'It is honest and fine to say "I am focused on being an excellent trainee first — the trajectory beyond that depends on what I specialise in and where I find most value".',
    ],
    exampleStructure:
      'In the medium term, I am focused on being an excellent trainee — building a strong foundation across different seats and working out where my deepest interests lie. In the longer term, making partner is the goal, but I know that depends on developing real expertise and client relationships, not just time served. I am particularly drawn to [area] and could see a strong practice there. I am also realistic that priorities evolve — I am open to where the work takes me, but my starting intent is to build a long-term career at this firm.',
    commonMistakes: [
      '"I will be a partner in five years" — shows no understanding of what partnership involves.',
      '"I might go in-house" — signals your heart is not in private practice.',
      '"I am not sure yet" — shows no ambition or thought.',
    ],
  },

  {
    id: 'mot-8',
    category: 'motivation',
    question: 'Tell me about a significant piece of work experience and what you learned from it.',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Context → What you actually did → The insight you extracted → How it influenced your view of law',
    frameworkExplained:
      'This is not just an opportunity to list what you did — it is an opportunity to show the quality of your reflection. The most revealing part is what you extracted and how it refined your understanding of commercial law.',
    keyPoints: [
      'Reflection quality — did you actually think about what the experience taught you?',
      'Relevant lessons — is the learning connected to what lawyers do?',
      'Authentic engagement — did you pay attention during the experience?',
    ],
    tips: [
      'The experience does not need to be a law firm placement — work in a business, finance, consultancy, or any commercial environment all yield relevant insights.',
      'Be honest about what surprised you or what you found harder than expected — that is more credible than "it confirmed my passion".',
      'What you observed about how professionals operate (client communication, team dynamics, under pressure) can be as valuable as the legal content.',
    ],
    exampleStructure:
      'During [experience — where, what type of work, briefly], I [what you specifically did or were exposed to]. What I found most interesting was [specific insight — about how deals work, how clients behave, what lawyers spend time on, a moment that changed your view]. What surprised me was [honest observation]. I took from it [specific lesson that shapes how you think about commercial law or your own career]. It confirmed / adjusted my interest because [genuine reason].',
    commonMistakes: [
      'Listing tasks without any reflection on what they taught you.',
      '"It confirmed my passion for commercial law" — this needs to be backed by something specific.',
      'An experience that is entirely irrelevant to commercial law with no attempt to draw a connection.',
    ],
  },

  // ── COMMERCIAL AWARENESS ───────────────────────────────────────────────────

  {
    id: 'com-1',
    category: 'commercial',
    question: 'Tell me about a commercial story or issue you have been following recently.',
    context: 'Prepare 2–3 stories in depth before any interview. One M&A or finance deal, one regulatory or geopolitical story, one broader economic trend.',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'Story → Why it matters → Legal angle → Your view',
    frameworkExplained:
      'Do not just summarise the headline. Explain the commercial context, why it is significant for the businesses or markets involved, what the legal implications are, and — most importantly — what you think about it.',
    keyPoints: [
      'Do you have a genuine view, or just a summary?',
      'Can you identify the legal dimension, not just the business news?',
      'Is the story relevant to the firm you are speaking to?',
    ],
    tips: [
      'Choose a story relevant to one of the firm\'s strong practice areas — this shows you have done your research.',
      'Know the legal angle: regulatory impact, M&A implications, dispute risks, financing structures.',
      'Have a view: "I think X is significant because..." or "The interesting question for lawyers is whether...".',
      'Avoid stories that are weeks old with no follow-up — you should be following it, not just having spotted it.',
      'Read the FT, Bloomberg Law, or the firm\'s own insight pieces for relevant content.',
    ],
    exampleStructure:
      'One story I have been following is [story — what happened, who the parties are, when]. The reason I find it commercially interesting is [why it matters — for the sector, for investors, for the regulatory landscape]. The legal angle is particularly [interesting / complex] because [specific legal dimension — regulatory approval challenge, novel contractual question, cross-border enforcement issue]. My own view on it is [your perspective — what you think will happen, what makes this precedent-setting, what the firm acting for X would be thinking about].',
    commonMistakes: [
      'Summarising a headline without any analysis.',
      'No legal angle — just describing a business story.',
      'No opinion — just reporting facts.',
      'A story that has no relevance to the type of work the firm does.',
    ],
  },

  {
    id: 'com-2',
    category: 'commercial',
    question: 'What sectors or industries do you find most interesting, and why?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Name the sector(s) → Genuine reason for interest → Connect to legal work → Connect to the firm',
    frameworkExplained:
      'This tests whether you have a real intellectual engagement with the commercial world. The best answers pick one or two sectors with genuine depth of interest and connect them to specific legal practice areas and ideally to the firm you are interviewing with.',
    keyPoints: [
      'Genuine interest — does this feel real or manufactured?',
      'Commercial understanding — do you know what is driving the sector?',
      'Legal connection — do you know what lawyers in this sector actually do?',
    ],
    tips: [
      'Connect your sector interest to a practice area: TMT interest → technology transactions, data regulation, IP. Energy interest → project finance, regulatory work, ESG. Private equity → M&A, leveraged finance.',
      'Two sectors with real depth is better than five sectors named superficially.',
      'If the firm has a strong practice in your chosen sector, make that connection explicitly.',
      'Avoid "healthcare because everyone needs it" or "technology because it is growing" — these are generic.',
    ],
    exampleStructure:
      'I find [sector] particularly interesting at the moment. What drives that is [specific reason — a structural shift, a regulatory development, an economic trend]. I have been following [specific story or trend in the sector]. The legal dimension that interests me most is [specific area — how competition law applies to big tech / how energy transition is reshaping project finance / how financial regulation is changing post-crisis]. I know that [firm] has a strong [sector/practice area], which is part of what draws me here.',
    commonMistakes: [
      'Generic sector interest with no specific knowledge.',
      'No connection to what lawyers in the sector actually do.',
      'Interests that have no connection to any practice areas the firm covers.',
    ],
  },

  {
    id: 'com-3',
    category: 'commercial',
    question: 'Walk me through a recent deal or transaction that caught your attention.',
    frequency: 'Common',
    firmTiers: ['Magic Circle', 'Silver Circle', 'US Firms'],
    framework: 'Who → What → Why it happened → How it was structured → What the lawyers did → Significance',
    frameworkExplained:
      'This tests whether you can analyse a transaction at a level beyond a press release summary. Know the parties, the structure, the strategic rationale, and what the legal work involved.',
    keyPoints: [
      'Do you know the deal in detail, or just the headline?',
      'Can you identify what lawyers actually did in the transaction?',
      'Do you have a view on the strategic rationale or outcome?',
    ],
    tips: [
      'Choose a deal in a sector the firm is known for — M&A, private equity, finance, energy, TMT.',
      'Sources: firm deal announcements, FT Alphaville, Bloomberg Law, Mergermarket, Dealbook.',
      'Know: the buyer and target (or borrower and lenders), the deal size, how it was structured (share purchase, asset deal, all-cash, share-plus-cash), any financing, any regulatory hurdles.',
      'What lawyers did: advising on structure, negotiating key agreements, running due diligence, managing regulatory approvals, drafting finance documents.',
    ],
    exampleStructure:
      'A deal I have been following is [name or describe — parties and sector]. [Acquirer] acquired [target] for approximately [size] in [month/year]. The deal is interesting to me because [strategic rationale — why the buyer wanted this, what it achieves]. In terms of structure, [brief: how it was structured — all-cash, leveraged buyout, share deal]. The main legal work involved [what lawyers on both sides did — due diligence on X, drafting the SPA, managing [regulatory body] approval]. What I find most significant is [your view — precedent-setting nature, regulatory outcome, valuation point].',
    commonMistakes: [
      'Describing a deal from years ago as "recent".',
      'Not knowing the deal size, structure, or parties beyond the headline.',
      'No sense of what the lawyers actually did.',
      'No personal view — just a summary.',
    ],
  },

  {
    id: 'com-4',
    category: 'commercial',
    question: 'What do you think is the biggest challenge facing law firms right now?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Name one or two challenges → Explain the mechanism → Connect to what it means for lawyers',
    frameworkExplained:
      'This tests whether you think about the legal industry as a business, not just a profession. The best answers pick a real structural challenge, explain its mechanism, and show you understand the implications for how firms operate.',
    keyPoints: [
      'Strategic awareness — do you think about the profession commercially?',
      'Analytical depth — can you explain why something is a challenge, not just name it?',
      'Balance — are you aware of multiple challenges rather than just fixated on one?',
    ],
    tips: [
      'Strong candidates: AI and automation (what it means for associate-level work, pricing, training), competition for talent (US firms paying significantly above Magic Circle lockstep), client pricing pressure (in-house teams using fixed-fee and alternatives), globalisation and multi-jurisdictional complexity.',
      'AI is the most topical challenge — show you have a nuanced view: it automates certain tasks but raises the bar for higher-value advisory work.',
      'Be careful not to imply law firms are about to collapse — the best answers acknowledge challenge and resilience.',
    ],
    exampleStructure:
      'I think the most significant challenge right now is [one primary challenge]. The mechanism is [why it is a challenge — not just naming it]. This matters for law firms because [specific operational, commercial, or structural consequence]. A related challenge is [secondary point — briefly]. Firms that [adaptive response] are likely to navigate this better. What I find interesting as a prospective trainee is [how this shapes the role and what opportunities it creates].',
    commonMistakes: [
      'Just saying "AI will replace lawyers" — this is a lazy answer.',
      'Naming a challenge without explaining the mechanism.',
      '"Work-life balance" — this is a challenge for individuals, not firms as businesses.',
      'An answer so negative it suggests you do not think the profession has a future.',
    ],
  },

  {
    id: 'com-5',
    category: 'commercial',
    question: 'How do you stay commercially aware on a regular basis?',
    frequency: 'Very Common',
    firmTiers: ['All'],
    framework: 'Regular habits → Specific sources → How you make it stick',
    frameworkExplained:
      'Firms want to hear about genuine habits, not a list of sources you looked at the week before applications opened. The best answers describe a realistic regular routine and show you actually engage with what you read.',
    keyPoints: [
      'Genuine habit vs pre-interview cramming — are these sources you use regularly?',
      'Depth — do you understand what you read, or just skim headlines?',
      'Active engagement — do you think about what you read, discuss it, or connect it to legal issues?',
    ],
    tips: [
      'Sources that work well: FT (even 10 minutes a day), Bloomberg Law briefings, firm deal announcements, The Economist, specific sector publications if you have a real interest.',
      'Actively engaging with a platform like Folio (if you use it) is worth mentioning honestly.',
      'The best answer describes how you make what you read stick: discussing with friends, noting interesting stories, connecting to modules.',
      'If you listen to business podcasts on your commute — say so. It shows you integrate this into your actual life.',
    ],
    exampleStructure:
      'I have built a genuine habit of reading [specific sources] most days — [how you fit it in: morning commute, first 10 minutes of the day]. I tend to focus on [specific areas: M&A, regulatory, energy] because [genuine reason]. To make it stick, I [what you actually do — discuss interesting stories with friends who are also applying, note stories I want to follow up on, test myself with a commercial awareness quiz]. One story I have been following recently is [brief example — shows the habit is real].',
    commonMistakes: [
      'Claiming to read the entire FT every day — this is not credible for most students.',
      'A list of every financial publication without showing you actually engage.',
      '"I started preparing a few weeks ago" — exactly what firms do not want to hear.',
    ],
  },

  {
    id: 'com-6',
    category: 'commercial',
    question: 'What impact do you think AI will have on the legal profession?',
    frequency: 'Common',
    firmTiers: ['All'],
    framework: 'Short term (current automation) → Medium term (changing what trainees do) → Long term (structural change) → Your view',
    frameworkExplained:
      'This question tests whether you have thought carefully about technology and the future of legal work, beyond the headlines. Firms want a nuanced view — not "AI will replace lawyers" and not "nothing will change".',
    keyPoints: [
      'Nuance — can you distinguish between what AI can and cannot do in legal work?',
      'Practical understanding — do you know which tasks are being automated and which are not?',
      'Equilibrium — do you see both challenge and opportunity?',
    ],
    tips: [
      'Tasks AI is already doing: document review, due diligence, contract analysis, precedent search, drafting first-pass standard documents. These are significant in volume but lower in complexity.',
      'What AI cannot (yet) do: exercise judgment, build client relationships, manage transactions, appear in court, think strategically about a client\'s business.',
      'The effect on trainees: the nature of training is likely to change. Less time on routine tasks, more need to develop higher-value skills earlier.',
      'Firms are adapting: building internal AI tools, pricing models are changing, and clients are using AI to challenge legal costs.',
    ],
    exampleStructure:
      'In the near term, AI is already automating the most time-intensive parts of document-intensive work — [due diligence, contract review, large-scale disclosure]. That changes the economics: a task that took 50 junior hours can now take five. The medium-term effect is a shift in what trainees do — less routine processing, more need to develop judgment and client skills earlier. What AI does not change is the need for someone who understands a client\'s business and can advise under conditions of real uncertainty and complexity. In the longer term, I think it reshapes the profession rather than replaces it. The firms that adapt — using AI to deliver better work faster at competitive prices — will win. What interests me is [specific aspect of how law firm strategy is adapting].',
    commonMistakes: [
      '"AI will replace all lawyers" — oversimplified.',
      '"AI will have no real impact on law" — clearly wrong.',
      'No specific examples of what AI is already doing in legal work.',
    ],
  },

  {
    id: 'com-7',
    category: 'commercial',
    question: 'If a client came to you tomorrow wanting to acquire a competitor, what would your first questions be?',
    frequency: 'Occasional',
    firmTiers: ['Magic Circle', 'Silver Circle', 'US Firms'],
    framework: 'Strategic rationale → Transaction structure → Regulatory → Financing → Risk',
    frameworkExplained:
      'This is a "think like a lawyer" question. It tests whether you approach a commercial situation in a structured way — considering the business logic, legal structure, regulatory environment, and key risks before any advice is given.',
    keyPoints: [
      'Structured thinking — do you ask in the right order?',
      'Commercial instinct — do you understand that law follows the business rationale?',
      'Breadth — do you consider the full picture (regulatory, financing, people) rather than just the legal mechanics?',
    ],
    tips: [
      'Start with "why" — the strategic rationale shapes everything else.',
      'Structure matters: share purchase vs asset purchase are fundamentally different with different risk profiles.',
      'Regulatory is increasingly important: competition law clearance, FDI review, sector-specific regulation.',
      'Do not try to give the full legal advice — the question is about the first questions, not the final answer.',
    ],
    exampleStructure:
      'My first questions would be around the strategic rationale — why this competitor? What is the client trying to achieve: market share, technology, talent, geographic reach? That shapes everything else. Then I would want to understand the structure: are we looking at a share purchase or asset deal? What are the financing arrangements — cash, debt, equity? Then regulatory: do we expect competition law clearance requirements given market share? Are there any sector-specific approvals? And key risks: what is on the target\'s balance sheet that we do not know about yet — pending litigation, regulatory investigations, key customer contracts? The due diligence scope flows from those first principles.',
    commonMistakes: [
      'Starting with legal technicalities rather than business rationale.',
      'Not mentioning regulatory — in most significant acquisitions, this is a primary issue.',
      'Trying to give the full legal advice rather than the diagnostic questions.',
    ],
  },

  {
    id: 'com-8',
    category: 'commercial',
    question: 'What trends are you seeing in M&A or capital markets activity at the moment?',
    frequency: 'Occasional',
    firmTiers: ['Magic Circle', 'Silver Circle', 'US Firms'],
    framework: 'Name one or two specific trends → What is driving them → What it means for deal flow and legal work',
    frameworkExplained:
      'This tests real market awareness. You need to know current themes — not historical ones — and understand what is driving them at a macro and sector level.',
    keyPoints: [
      'Currency of knowledge — are your examples recent (last 6–12 months)?',
      'Causal understanding — do you know WHY the trend is happening?',
      'Legal relevance — do you connect the trend to what lawyers do?',
    ],
    tips: [
      'M&A current themes: PE deal activity and what drives it (interest rates, dry powder deployment, sector consolidation), public M&A (take-private transactions), cross-border deal complexity.',
      'Capital markets: IPO market conditions, high-yield and investment grade bond issuance, ESG-linked financing.',
      'Drivers to understand: interest rates and their effect on leverage and valuations, geopolitical shifts affecting cross-border M&A, regulatory environment in key jurisdictions.',
      'Sources: FT Lex column, Mergermarket quarterly reports, firm client briefings.',
    ],
    exampleStructure:
      'One trend I have been following is [specific trend — e.g., the resurgence of take-private transactions]. What is driving it is [mechanism — lower public market valuations relative to private / PE dry powder needing deployment / regulatory burden of public listing]. What is interesting from a legal perspective is [specific legal dimension — deal structure complexity, public M&A rules, financing conditions]. I have been following [specific recent example] which illustrates this well because [why it is a good example of the trend].',
    commonMistakes: [
      'A trend from two years ago with no recent development.',
      'A trend without any understanding of what is causing it.',
      'No connection to what the trend means for legal work.',
    ],
  },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getQuestionsByCategory(category: InterviewCategorySlug): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.category === category);
}

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id);
}

export function getCategoryQuestionCount(category: InterviewCategorySlug): number {
  return INTERVIEW_QUESTIONS.filter((q) => q.category === category).length;
}
